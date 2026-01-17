"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/supabase/client";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, AlertCircle, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface SupportTicket {
  id: number;
  user_id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  created_at: string;
  payment_proof_url?: string;
  admin_response?: string;
  admin_response_at?: string;
  admin_notes?: string;
  payment_issue_type?: string;
}

interface SupportTicketWithEvent {
  id: number;
  user_id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  created_at: string;
  payment_proof_url?: string;
  admin_response?: string;
  admin_response_at?: string;
  admin_notes?: string;
  payment_issue_type?: string;
  event?: {
    name: string;
    id: number;
  };
}

export default function SupportTicketsList() {
  const [tickets, setTickets] = useState<SupportTicketWithEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTicket, setSelectedTicket] =
    useState<SupportTicketWithEvent | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // First get the current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        // Get the texus_id from the users table
        const { data: userData } = await supabase
          .from("users")
          .select("texus_id")
          .eq("user_auth_id", user.id)
          .single();

        if (!userData?.texus_id) {
          setLoading(false);
          return;
        }

        // Get all support tickets for this user
        const { data: ticketsData, error } = await supabase
          .from("support")
          .select(
            `
            *,
            event:events (
              id,
              name
            )
          `
          )
          .eq("user_id", userData.texus_id);

        if (error) {
          console.error("Error fetching tickets:", error);
          setLoading(false);
          return;
        }

        setTickets(ticketsData || []);
      } catch (error) {
        console.error("Error in fetchTickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();

    // Set up realtime subscription
    const channel = supabase
      .channel("support_tickets_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "support",
        },
        async (payload) => {
          // Refresh the tickets when changes occur
          const fetchTickets = async () => {
            const {
              data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data: userData } = await supabase
              .from("users")
              .select("texus_id")
              .eq("user_auth_id", user.id)
              .single();

            if (!userData?.texus_id) return;

            const { data } = await supabase
              .from("support")
              .select(
                `
                *,
                event:events (
                  id,
                  name
                )
              `
              )
              .eq("user_id", userData.texus_id);

            setTickets(data || []);
          };

          fetchTickets();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Get filtered tickets based on search query and filters
  const filteredTickets = tickets.filter((ticket) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ticket.event?.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus =
      statusFilter === "all" || ticket.status === statusFilter;

    // Filter by category
    const matchesCategory =
      categoryFilter === "all" || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
          >
            Pending
          </Badge>
        );
      case "in_progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-400 border-blue-500/30"
          >
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-400 border-green-500/30"
          >
            Resolved
          </Badge>
        );
      case "closed":
        return (
          <Badge
            variant="outline"
            className="bg-gray-500/10 text-gray-400 border-gray-500/30"
          >
            Closed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-400 border-purple-500/30"
          >
            {status}
          </Badge>
        );
    }
  };

  // Get category badge color
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "payment":
        return (
          <Badge
            variant="outline"
            className="bg-purple-500/10 text-purple-400 border-purple-500/30"
          >
            Payment
          </Badge>
        );
      case "registration":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-400 border-blue-500/30"
          >
            Registration
          </Badge>
        );
      case "event":
        return (
          <Badge
            variant="outline"
            className="bg-green-500/10 text-green-400 border-green-500/30"
          >
            Event
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="bg-gray-500/10 text-gray-400 border-gray-500/30"
          >
            {category}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-3 sm:mb-4">
          <Skeleton className="h-8 w-full sm:w-64 bg-blue-500/5 rounded-lg" />
          <Skeleton className="h-8 w-full sm:w-64 bg-blue-500/5 rounded-lg" />
        </div>

        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-32 w-full bg-blue-500/5 rounded-lg border border-blue-300/10"
          />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <HelpCircle className="h-12 w-12 text-blue-300/50 mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">
          No Support Tickets
        </h3>
        <p className="text-gray-400 max-w-md mb-6">
          You {"haven't"} submitted any support tickets yet. If you need
          assistance, you can create a new ticket from the support page.
        </p>
        <Button
          onClick={() => (window.location.href = "/support")}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Go to Support
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-3 sm:mb-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tickets..."
            className="bg-blue-500/5 border-blue-300/20 pl-9 h-9 text-sm text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-blue-500/5 border-blue-300/20 h-9 text-sm text-white w-full sm:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-blue-300/20 text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-blue-500/5 border-blue-300/20 h-9 text-sm text-white w-full sm:w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-blue-300/20 text-white">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="payment">Payment</SelectItem>
              <SelectItem value="registration">Registration</SelectItem>
              <SelectItem value="event">Event</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-blue-500/5 border border-blue-300/10 rounded-lg">
          <AlertCircle className="h-8 w-8 text-blue-300/50 mb-2" />
          <h3 className="text-md font-medium text-white">
            No matching tickets
          </h3>
          <p className="text-gray-400 text-sm">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 place-items-stretch">
            {filteredTickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.01 }}
                className="transition-all h-full w-full"
              >
                <Card
                  className="h-44 w-full bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border-blue-300/20 text-white overflow-hidden hover:shadow-[0_0_20px_rgba(147,197,253,0.2)] transition-all duration-300 cursor-pointer backdrop-blur-sm"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                      <CardTitle className="text-base sm:text-lg font-medium text-blue-100">
                        {ticket.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2">
                        {getStatusBadge(ticket.status)}
                        {getCategoryBadge(ticket.category)}
                      </div>
                    </div>
                    <CardDescription className="text-xs sm:text-sm line-clamp-2 text-gray-400">
                      Ticket #{ticket.id} • Created{" "}
                      {format(new Date(ticket.created_at), "MMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0">
                    <div className="text-sm text-gray-300 break-words line-clamp-2 mb-2">
                      {ticket.description}
                    </div>
                    {ticket.event && (
                      <div className="text-xs text-gray-400">
                        Related to event:{" "}
                        <span className="text-blue-300">
                          {ticket.event.name}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      )}

      {/* Ticket Detail Modal */}
      <Dialog
        open={!!selectedTicket}
        onOpenChange={(open) => !open && setSelectedTicket(null)}
      >
        <DialogContent className="bg-gradient-to-b from-gray-900 to-gray-950 border-blue-300/20 text-white max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-[0_0_25px_rgba(59,130,246,0.15)]">
          {selectedTicket && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader className="border-b border-blue-300/10 pb-4">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <DialogTitle className="text-xl text-blue-100 font-semibold">
                    {selectedTicket.title}
                  </DialogTitle>
                  {getStatusBadge(selectedTicket.status)}
                  {getCategoryBadge(selectedTicket.category)}
                </div>
                <DialogDescription className="text-gray-400">
                  Ticket #{selectedTicket.id} • Created{" "}
                  {format(new Date(selectedTicket.created_at), "MMM d, yyyy")}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-300/10">
                  <h3 className="text-sm font-medium text-blue-200 mb-2">
                    Description
                  </h3>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">
                    {selectedTicket.description}
                  </p>
                </div>

                {selectedTicket.event && (
                  <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-300/10">
                    <h3 className="text-sm font-medium text-blue-200 mb-2">
                      Related Event
                    </h3>
                    <p className="text-blue-300 text-sm flex items-center">
                      {selectedTicket.event.name}
                    </p>
                  </div>
                )}

                {selectedTicket.category === "payment" && (
                  <div className="bg-purple-500/5 p-4 rounded-lg border border-purple-300/10">
                    <h3 className="text-sm font-medium text-purple-200 mb-2">
                      Payment Issue Details
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-purple-500/10 text-purple-400 border-purple-500/30"
                      >
                        {selectedTicket.payment_issue_type ||
                          "General Payment Issue"}
                      </Badge>
                    </div>
                  </div>
                )}

                {selectedTicket.payment_proof_url && (
                  <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-300/10">
                    <h3 className="text-sm font-medium text-blue-200 mb-3">
                      Payment Proof
                    </h3>
                    <div className="relative h-72 rounded-lg overflow-hidden border border-blue-300/20 shadow-lg">
                      <Image
                        src={selectedTicket.payment_proof_url}
                        alt="Payment Proof"
                        layout="fill"
                        objectFit="contain"
                        className="backdrop-blur-sm bg-black/30"
                      />
                    </div>
                    <div className="text-center mt-3">
                      <a
                        href={selectedTicket.payment_proof_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center gap-1 bg-blue-500/10 px-3 py-1.5 rounded-full transition-colors"
                      >
                        View Full Image <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                )}

                {selectedTicket.admin_response && (
                  <div className="bg-green-500/5 p-4 rounded-lg border border-green-300/10">
                    <h3 className="text-sm font-medium text-green-200 mb-2">
                      Admin Response
                    </h3>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap p-3 rounded-md bg-gray-900/50">
                      {selectedTicket.admin_response}
                    </p>
                    {selectedTicket.admin_response_at && (
                      <p className="text-xs text-gray-400 mt-2 italic">
                        Responded on{" "}
                        {format(
                          new Date(selectedTicket.admin_response_at),
                          "MMM d, yyyy"
                        )}
                      </p>
                    )}
                  </div>
                )}

                {selectedTicket.admin_notes && (
                  <div className="bg-purple-500/5 p-4 rounded-lg border border-purple-300/10">
                    <h3 className="text-sm font-medium text-purple-200 mb-2">
                      Admin Notes
                    </h3>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap p-3 rounded-md bg-gray-900/50">
                      {selectedTicket.admin_notes}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 flex justify-end border-t border-blue-300/10">
                <Button
                  variant="outline"
                  onClick={() => setSelectedTicket(null)}
                  className="bg-blue-500/10 hover:bg-blue-500/20 border-blue-400/20 text-blue-200"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
