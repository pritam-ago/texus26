"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createClient } from "@/supabase/client";
import { FileUpload } from "./components/FileUpload";
import { UserProfileCard } from "./components/UserProfileCard";
import { Textarea } from "./components/Textarea";

// Define payment issue subtypes
const paymentIssueTypes = [
  "payment_failed",
  "double_charge",
  "wrong_amount",
  "payment_verification",
  "other_payment_issue",
] as const;

// Add a type for events
type Event = {
  id: string;
  name: string;
  event_type: string;
  datetime: string;
};

// Form schema with event selection
const supportTicketSchema = z
  .object({
    category: z.enum(["payment", "event", "registration"], {
      required_error: "Please select a category for your issue",
    }),
    paymentIssueType: z.enum(paymentIssueTypes).optional(),
    // Event ID for registration issues - now validated against real events
    eventId: z.string().optional(),
    title: z.string().min(5, {
      message: "Title must be at least 5 characters",
    }),
    description: z.string().min(20, {
      message:
        "Description must be at least 20 characters to help us understand your issue",
    }),
    email: z.string().email({
      message: "Please enter a valid email address",
    }),
    // Virtual field to track if payment proof is provided
    hasPaymentProof: z.boolean().optional(),
  })
  .refine(
    (data) => {
      if (data.category === "payment") {
        return !!data.paymentIssueType;
      }
      return true;
    },
    {
      message: "Please select a payment issue type",
      path: ["paymentIssueType"],
    }
  )
  .refine(
    (data) => {
      // For payment issues, validate that payment proof is provided
      if (data.category === "payment" && data.paymentIssueType) {
        return data.hasPaymentProof === true;
      }
      return true;
    },
    {
      message: "Payment screenshot is required for payment-related issues",
      path: ["hasPaymentProof"],
    }
  )
  .refine(
    (data) => {
      // For all registration issues, validate event ID
      if (data.category === "registration") {
        return !!data.eventId;
      }
      return true;
    },
    {
      message: "Please select an event for your registration issue",
      path: ["eventId"],
    }
  );

type SupportTicketFormValues = z.infer<typeof supportTicketSchema>;

export default function SupportPageClient({
  initialUser,
  initialUserData,
}: {
  initialUser: any;
  initialUserData: any;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProof, setPaymentProof] = useState<FileList | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    string | undefined
  >();
  const [user, setUser] = useState<any>(initialUser);
  const [userData, setUserData] = useState<any>(initialUserData);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [selectedEventName, setSelectedEventName] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Custom function to handle form messages - only show after submission attempt
  const CustomFormMessage = ({ name }: { name: string }) => {
    const showErrors = form.formState.isSubmitted; // Only show errors after submission attempt
    if (!showErrors) return null;

    return <FormMessage className="text-red-400" />;
  };

  // Initialize Supabase client (only used for updates/submissions)
  const supabase = createClient();

  // Default values for the form
  const defaultValues: Partial<SupportTicketFormValues> = {
    category: undefined,
    paymentIssueType: undefined,
    eventId: "",
    title: "",
    description: "",
    email: initialUser?.email || "",
    hasPaymentProof: false,
  };

  const form = useForm<SupportTicketFormValues>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues,
    mode: "onSubmit", // Only validate on submit
  });

  // Watch fields BEFORE they're used in useEffect
  const watchCategory = form.watch("category");
  const watchPaymentIssueType = form.watch("paymentIssueType");

  // Now we can use watchCategory in useEffect
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const { data, error } = await supabase.from("events").select("*");

        if (error) {
          console.error("Error fetching events:", error);
          return;
        }

        setEvents(data || []);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setIsLoadingEvents(false);
      }
    };

    if (watchCategory === "registration") {
      fetchEvents();
    }
  }, [watchCategory, supabase]);

  // Update the form when payment proof changes
  useEffect(() => {
    form.setValue("hasPaymentProof", paymentProof !== null);
    if (paymentProof) {
      form.clearErrors("hasPaymentProof");
    }
  }, [paymentProof, form]);

  // Handle category changes
  useEffect(() => {
    if (watchCategory !== selectedCategory) {
      setSelectedCategory(watchCategory);

      // Save current description before resetting
      const currentDescription = form.getValues("description");

      // Reset category-specific fields when changing categories
      if (watchCategory !== "payment") {
        form.setValue("paymentIssueType", undefined);
        setPaymentProof(null);
      }

      if (watchCategory !== "registration") {
        form.setValue("eventId", "");
      }

      // Clear description when changing categories
      form.setValue("description", "");

      // Force re-validation
      form.trigger();
    }
  }, [watchCategory, selectedCategory, form]);

  // Real-time form validation
  useEffect(() => {
    const checkFormValidity = () => {
      const title = form.getValues("title");
      const email = form.getValues("email");
      const description = form.getValues("description");
      const category = form.getValues("category");

      // Base validation that applies to all categories
      let isValid = !!title && title.length >= 5 && !!email;

      // Category-specific validation
      if (category === "payment") {
        isValid =
          isValid &&
          !!form.getValues("paymentIssueType") &&
          !!paymentProof &&
          !!description &&
          description.length >= 20;
      } else if (category === "registration") {
        isValid =
          isValid &&
          !!form.getValues("eventId") &&
          !!description &&
          description.length >= 20;
      } else if (category === "event") {
        isValid = isValid && !!description && description.length >= 20;
      }

      console.log("Form validation state:", {
        category,
        title: !!title && title.length >= 5,
        email: !!email,
        paymentIssueType:
          category === "payment" ? !!form.getValues("paymentIssueType") : "N/A",
        paymentProof: category === "payment" ? !!paymentProof : "N/A",
        eventId:
          category === "registration" ? !!form.getValues("eventId") : "N/A",
        description: !!description && description.length >= 20,
        isValid,
      });

      setIsFormValid(isValid);
    };

    // Run validation check
    checkFormValidity();

    // Subscribe to form value changes
    const subscription = form.watch(checkFormValidity);

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [form, paymentProof, form.watch]);

  const onSubmit = async (data: SupportTicketFormValues) => {
    console.log("onSubmit function called with data:", data);

    // Check if form is valid
    if (!isFormValid) {
      console.error("Form is not valid, preventing submission");
      // No need to display a toast here as it will be handled by the form submission handler
      return;
    }

    // Check if payment proof is required but missing
    if (data.category === "payment" && !paymentProof) {
      // Don't set form error - just show toast
      toast.error("Payment screenshot is required for payment issues");
      return;
    }

    setIsSubmitting(true);

    try {
      // Check Supabase connection
      const { error: connectionError } = await supabase
        .from("support")
        .select("count", { count: "exact", head: true });

      if (connectionError) {
        console.error("Error connecting to Supabase:", connectionError);
        throw new Error(`Connection error: ${connectionError.message}`);
      }

      // Find selected event details if this is a registration issue
      const selectedEvent =
        data.category === "registration" && data.eventId
          ? events.find((event) => event.id === data.eventId)
          : null;

      // Log user data for debugging
      console.log("User data for ticket submission:", {
        userData,
        texusId: userData?.texus_id,
        originalUserId: user?.id,
      });

      // Verify that we have a valid user ID
      if (!userData?.texus_id && user?.id) {
        console.warn("texus_id not found in userData, falling back to user.id");
      } else if (!userData?.texus_id && !user?.id) {
        console.warn(
          "No user identification found - ticket will be submitted anonymously"
        );
      }

      // Create support ticket object based on SupportTicket interface
      const supportTicketData: any = {
        title: data.title,
        description: data.description,
        status: "pending", // Default status for new tickets
        category: data.category,
        event_id: data.eventId ? parseInt(data.eventId) : null,
        // Using texus_id from userData as the primary user identifier, with fallbacks
        user_id: userData?.texus_id || user?.id || null,
        payment_issue_type: data.paymentIssueType || null,
        payment_proof_url: null, // Will be updated if file is uploaded
        admin_notes: "", // Empty by default
      };

      console.log("Preparing to submit support ticket:", supportTicketData);

      // Upload payment proof to Supabase storage if it exists
      let paymentProofUrl: string | null = null;
      if (paymentProof && paymentProof.length > 0) {
        try {
          const file = paymentProof[0];

          // Validate file size (5MB max)
          if (file.size > 5 * 1024 * 1024) {
            throw new Error(
              "File size exceeds 5MB limit. Please upload a smaller file."
            );
          }

          const fileExt = file.name.split(".").pop();
          const fileName = `${Math.random()
            .toString(36)
            .substring(2, 15)}_${Date.now()}.${fileExt}`;
          const filePath = `payment-proofs/${fileName}`;

          console.log("Uploading file:", fileName);

          // Upload file to Supabase storage
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("support-attachments")
              .upload(filePath, file, {
                cacheControl: "3600",
                upsert: false,
              });

          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            throw new Error(
              `Failed to upload payment proof: ${uploadError.message}`
            );
          }

          console.log("File uploaded successfully:", uploadData);

          // Get public URL for the uploaded file
          const { data: publicUrlData } = supabase.storage
            .from("support-attachments")
            .getPublicUrl(filePath);

          if (!publicUrlData?.publicUrl) {
            throw new Error("Failed to get public URL for uploaded file");
          }

          paymentProofUrl = publicUrlData.publicUrl;
          supportTicketData.payment_proof_url = paymentProofUrl;

          console.log("Payment proof URL set:", paymentProofUrl);
        } catch (fileError: any) {
          console.error("File upload error:", fileError);
          throw new Error(`File upload failed: ${fileError.message}`);
        }
      }

      // Insert support ticket into Supabase
      console.log("Inserting ticket into database:", supportTicketData);

      const { data: ticketData, error: ticketError } = await supabase
        .from("support")
        .insert(supportTicketData)
        .select()
        .single();

      if (ticketError) {
        console.error("Error creating support ticket:", ticketError);
        throw new Error(
          `Failed to create support ticket: ${ticketError.message}`
        );
      }

      console.log("Support ticket created successfully:", ticketData);

      toast.success("Your support ticket has been submitted successfully!");
      form.reset(defaultValues);
      setPaymentProof(null);

      // Keep email from user
      if (user?.email) {
        form.setValue("email", user.email);
      }
    } catch (error) {
      toast.error("Failed to submit your ticket. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
      {/* Info Sidebar */}
      <div className="w-full lg:w-96 bg-[#111] rounded-lg border border-zinc-800 shadow-xl backdrop-blur-sm h-fit lg:sticky top-4 self-start mb-4 lg:mb-0">
        <div className="p-6">
          <h2 className="text-xl font-semibold font-mont text-white border-b border-zinc-700 pb-3 mb-5">
            How Can We Help?
          </h2>

          <div className="space-y-5">
            <div>
              <span className="text-zinc-400 text-sm block mb-1">
                Support Hours
              </span>
              <span className="font-medium text-white block">
                Monday - Friday: 9AM - 6PM
              </span>
            </div>

            <div>
              <span className="text-zinc-400 text-sm block mb-1">
                Response Time
              </span>
              <span className="font-medium text-white block">
                Within 24-48 hours
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 p-6">
          <h3 className="font-semibold text-lg mb-3">Common Issues</h3>
          <ul className="space-y-3">
            <li className="flex flex-col">
              <span className="text-fuchsia-400 text-sm">Payment Issues</span>
              <span className="text-zinc-400 text-sm">
                Problems with payment failures, or duplicate charges
              </span>
            </li>
            <li className="flex flex-col">
              <span className="text-fuchsia-400 text-sm">Event Related</span>
              <span className="text-zinc-400 text-sm">
                Registration problems, event changes, or attendance questions
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Support Form Section */}
      <div className="flex-1 w-full">
        <Tabs defaultValue="ticket" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4 sm:mb-6 bg-[#111] border border-zinc-800">
            <TabsTrigger
              value="ticket"
              className="data-[state=active]:bg-zinc-900"
            >
              Submit a Ticket
            </TabsTrigger>
            <TabsTrigger
              value="faq"
              className="data-[state=active]:bg-zinc-900"
            >
              FAQs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ticket">
            <div className="bg-[#111] rounded-lg border border-zinc-800 shadow-xl backdrop-blur-sm">
              <div className="p-3 sm:p-4 md:p-6">
                <h2 className="text-lg sm:text-xl font-semibold font-mont text-white border-b border-zinc-700 pb-3 mb-3 sm:mb-5">
                  Raise a Support Ticket
                </h2>

                <Form {...form}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault(); // Prevent default form submission

                      // Validate the form
                      form.trigger().then((isValid) => {
                        if (isValid && !isSubmitting && !isLoading) {
                          // Form is valid - proceed with submission
                          const formData = form.getValues();
                          onSubmit(formData as SupportTicketFormValues);
                        } else {
                          // Just use a generic error message
                          if (!isValid) {
                            toast.error(
                              "Please complete all required fields before submitting"
                            );
                          } else if (isSubmitting) {
                            toast.info("Your form is already being submitted");
                          } else if (isLoading) {
                            toast.info("Please wait while we load data");
                          }

                          // Log the errors for debugging
                          console.log(
                            "Form validation errors:",
                            form.formState.errors
                          );
                        }
                      });
                    }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">
                            Issue Category
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-[#1A1A1A] border-zinc-700 text-white">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-[#1A1A1A] text-white border-zinc-700">
                              <SelectItem value="payment">
                                Payment Issue
                              </SelectItem>
                              <SelectItem value="registration">
                                Registration Issue
                              </SelectItem>
                              <SelectItem value="event">
                                Event Related
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription className="text-zinc-500">
                            Select the category that best describes your issue
                          </FormDescription>
                          <CustomFormMessage name="category" />
                        </FormItem>
                      )}
                    />

                    {/* Payment issue specific fields */}
                    {watchCategory === "payment" && (
                      <>
                        <FormField
                          control={form.control}
                          name="paymentIssueType"
                          render={({ field }) => (
                            <FormItem className="space-y-3">
                              <FormLabel className="text-zinc-300">
                                Payment Issue Type
                              </FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  className="gap-3 grid grid-cols-1 md:grid-cols-2"
                                >
                                  <FormItem className="flex items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="payment_failed" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="font-normal text-zinc-300">
                                        Payment Failed
                                      </FormLabel>
                                      <FormDescription className="text-xs text-zinc-500">
                                        Your payment was processed but
                                        registration failed
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                  <FormItem className="flex items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="double_charge" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="font-normal text-zinc-300">
                                        Double Charge
                                      </FormLabel>
                                      <FormDescription className="text-xs text-zinc-500">
                                        You were charged multiple times for the
                                        same event
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                  <FormItem className="flex items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="wrong_amount" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="font-normal text-zinc-300">
                                        Wrong Amount Charged
                                      </FormLabel>
                                      <FormDescription className="text-xs text-zinc-500">
                                        The charged amount doesn&apos;t match
                                        the event fee
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                  <FormItem className="flex items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="payment_verification" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="font-normal text-zinc-300">
                                        Payment Verification
                                      </FormLabel>
                                      <FormDescription className="text-xs text-zinc-500">
                                        Your payment was successful but not
                                        reflected in your account
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                  <FormItem className="flex items-start space-x-3 space-y-0">
                                    <FormControl>
                                      <RadioGroupItem value="other_payment_issue" />
                                    </FormControl>
                                    <div className="space-y-1">
                                      <FormLabel className="font-normal text-zinc-300">
                                        Other Payment Issue
                                      </FormLabel>
                                      <FormDescription className="text-xs text-zinc-500">
                                        Any other payment-related issue not
                                        listed above
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                </RadioGroup>
                              </FormControl>
                              <CustomFormMessage name="paymentIssueType" />
                            </FormItem>
                          )}
                        />

                        {/* File Upload for payment proof - now mandatory */}
                        {watchPaymentIssueType && (
                          <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
                            <div className="flex flex-row items-center justify-between">
                              <h3 className="text-base sm:text-lg font-medium text-white">
                                Upload Payment Screenshot{" "}
                                <span className="text-red-400">*</span>
                              </h3>
                            </div>
                            <FileUpload
                              onChange={(files) => {
                                setPaymentProof(files);
                                form.setValue(
                                  "hasPaymentProof",
                                  files !== null
                                );
                                form.clearErrors("hasPaymentProof");
                              }}
                              accept=".jpg,.jpeg,.png,.pdf"
                            />
                            {form.formState.errors.hasPaymentProof && (
                              <p className="text-sm font-medium text-red-400">
                                {form.formState.errors.hasPaymentProof.message}
                              </p>
                            )}
                            <p className="text-xs sm:text-sm text-zinc-500">
                              Please upload a screenshot of your payment receipt
                              to help us resolve your issue faster
                            </p>
                          </div>
                        )}

                        {/* Description field for payment issues */}
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-300">
                                Payment Issue Details{" "}
                                <span className="text-red-400">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please describe your payment issue in detail..."
                                  className="bg-[#1A1A1A] border-zinc-700 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-zinc-500">
                                Include relevant details like transaction ID,
                                payment date, amount, and any error messages you
                                received
                              </FormDescription>
                              <CustomFormMessage name="description" />
                            </FormItem>
                          )}
                        />

                        <div className="border-t border-zinc-800 my-4 pt-4"></div>
                      </>
                    )}

                    {/* Registration issue fields - now with event selection */}
                    {watchCategory === "registration" && (
                      <>
                        <FormField
                          control={form.control}
                          name="eventId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-300">
                                Select Event{" "}
                                <span className="text-red-400">*</span>
                              </FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  // Find the selected event and update the display name
                                  const selectedEvent = events.find(
                                    (event) => event.id === value
                                  );
                                  if (selectedEvent) {
                                    setSelectedEventName(selectedEvent.name);
                                  }
                                }}
                                value={field.value}
                                disabled={isLoadingEvents}
                              >
                                <FormControl>
                                  <SelectTrigger className="bg-[#1A1A1A] border-zinc-700 text-white">
                                    <SelectValue
                                      placeholder={
                                        isLoadingEvents
                                          ? "Loading events..."
                                          : "Select an event"
                                      }
                                    >
                                      {field.value && selectedEventName
                                        ? selectedEventName
                                        : isLoadingEvents
                                        ? "Loading events..."
                                        : "Select an event"}
                                    </SelectValue>
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-[#1A1A1A] text-white border-zinc-700 max-h-[300px]">
                                  <div className="px-2 py-2 sticky top-0 bg-[#1A1A1A] z-10 border-b border-zinc-700">
                                    <Input
                                      placeholder="Search events..."
                                      className="bg-zinc-900 border-zinc-700 text-white text-sm"
                                      onChange={(e) => {
                                        const searchValue =
                                          e.target.value.toLowerCase();
                                        const searchResults = events.filter(
                                          (event) =>
                                            event.name
                                              .toLowerCase()
                                              .includes(searchValue) ||
                                            (event.event_type &&
                                              event.event_type
                                                .toLowerCase()
                                                .includes(searchValue))
                                        );
                                        const contentEl = e.target.closest(
                                          "[data-event-content]"
                                        );
                                        if (contentEl) {
                                          contentEl
                                            .querySelectorAll(
                                              "[data-event-item]"
                                            )
                                            .forEach((item) => {
                                              const eventId =
                                                item.getAttribute(
                                                  "data-event-id"
                                                );
                                              const event = events.find(
                                                (e) => e.id === eventId
                                              );
                                              if (!event) return;

                                              const matches =
                                                event.name
                                                  .toLowerCase()
                                                  .includes(searchValue) ||
                                                (event.event_type &&
                                                  event.event_type
                                                    .toLowerCase()
                                                    .includes(searchValue));
                                              (
                                                item as HTMLElement
                                              ).style.display = matches
                                                ? "block"
                                                : "none";
                                            });
                                        }
                                      }}
                                    />
                                  </div>

                                  <div className="pt-2" data-event-content>
                                    {events.length === 0 ? (
                                      <SelectItem value="no-events" disabled>
                                        {isLoadingEvents
                                          ? "Loading events..."
                                          : "No events found"}
                                      </SelectItem>
                                    ) : (
                                      events.map((event) => (
                                        <SelectItem
                                          key={event.id}
                                          value={event.id}
                                          data-event-item
                                          data-event-id={event.id}
                                        >
                                          <div className="flex flex-col">
                                            <span>{event.name}</span>
                                            <span className="text-xs text-zinc-400">
                                              {event.event_type
                                                .toLocaleLowerCase()
                                                .split("_")
                                                .join(" ")}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      ))
                                    )}
                                  </div>
                                </SelectContent>
                              </Select>
                              <FormDescription className="text-zinc-500">
                                Select the event related to your registration
                                issue or search by name
                              </FormDescription>
                              <CustomFormMessage name="eventId" />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-300">
                                Registration Details{" "}
                                <span className="text-red-400">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please describe your registration issue in detail..."
                                  className="bg-[#1A1A1A] border-zinc-700 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-zinc-500">
                                Include all relevant details like whether you
                                want to modify, transfer, or cancel your
                                registration, and any specific changes needed.
                              </FormDescription>
                              <CustomFormMessage name="description" />
                            </FormItem>
                          )}
                        />
                        <div className="border-t border-zinc-800 my-4 pt-4"></div>
                      </>
                    )}

                    {/* Event issue specific fields */}
                    {watchCategory === "event" && (
                      <>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-zinc-300">
                                Event Details{" "}
                                <span className="text-red-400">*</span>
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Please describe your event-related issue in detail..."
                                  className="bg-[#1A1A1A] border-zinc-700 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-zinc-500">
                                Include all relevant details about your event
                                issue, such as schedule concerns, venue
                                questions, or any other event-specific
                                information.
                              </FormDescription>
                              <CustomFormMessage name="description" />
                            </FormItem>
                          )}
                        />

                        <div className="border-t border-zinc-800 my-4 pt-4"></div>
                      </>
                    )}

                    {/* Common fields */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">
                            Ticket Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Brief summary of your issue"
                              className="bg-[#1A1A1A] border-zinc-700 text-white"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-zinc-500">
                            Keep it concise and descriptive
                          </FormDescription>
                          <CustomFormMessage name="title" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-zinc-300">
                            Contact Email
                          </FormLabel>
                          {user ? (
                            <>
                              <UserProfileCard
                                user={user}
                                userData={userData}
                              />
                              <input type="hidden" {...field} />
                              <FormDescription className="text-zinc-500 mt-2">
                                We&apos;ll use this email to contact you about
                                your ticket
                              </FormDescription>
                            </>
                          ) : (
                            <>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="your.email@example.com"
                                  className="bg-[#1A1A1A] border-zinc-700 text-white"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-zinc-500">
                                We&apos;ll use this to contact you about your
                                ticket
                              </FormDescription>
                            </>
                          )}
                          <CustomFormMessage name="email" />
                        </FormItem>
                      )}
                    />

                    {/* Validation status */}
                    <div className="space-y-2 mt-2">
                      <p className="text-sm text-zinc-400">
                        Required fields based on category:
                      </p>
                      <div className="space-y-1">
                        <p className="text-xs flex items-center">
                          <span
                            className={`inline-block w-4 h-4 mr-2 rounded-full ${
                              form.getValues("title")
                                ? "bg-green-500"
                                : "bg-zinc-600"
                            }`}
                          ></span>
                          Ticket Title
                        </p>
                        <p className="text-xs flex items-center">
                          <span
                            className={`inline-block w-4 h-4 mr-2 rounded-full ${
                              form.getValues("email")
                                ? "bg-green-500"
                                : "bg-zinc-600"
                            }`}
                          ></span>
                          Contact Email
                        </p>

                        {watchCategory === "payment" && (
                          <>
                            <p className="text-xs flex items-center">
                              <span
                                className={`inline-block w-4 h-4 mr-2 rounded-full ${
                                  watchPaymentIssueType
                                    ? "bg-green-500"
                                    : "bg-zinc-600"
                                }`}
                              ></span>
                              Payment Issue Type
                            </p>
                            <p className="text-xs flex items-center">
                              <span
                                className={`inline-block w-4 h-4 mr-2 rounded-full ${
                                  paymentProof ? "bg-green-500" : "bg-zinc-600"
                                }`}
                              ></span>
                              Payment Screenshot
                            </p>
                            <p className="text-xs flex items-center">
                              <span
                                className={`inline-block w-4 h-4 mr-2 rounded-full ${
                                  form.getValues("description").length >= 20
                                    ? "bg-green-500"
                                    : "bg-zinc-600"
                                }`}
                              ></span>
                              Payment Details (min 20 chars)
                            </p>
                          </>
                        )}

                        {watchCategory === "registration" && (
                          <>
                            <p className="text-xs flex items-center">
                              <span
                                className={`inline-block w-4 h-4 mr-2 rounded-full ${
                                  form.getValues("eventId")
                                    ? "bg-green-500"
                                    : "bg-zinc-600"
                                }`}
                              ></span>
                              Selected Event
                            </p>
                            <p className="text-xs flex items-center">
                              <span
                                className={`inline-block w-4 h-4 mr-2 rounded-full ${
                                  form.getValues("description").length >= 20
                                    ? "bg-green-500"
                                    : "bg-zinc-600"
                                }`}
                              ></span>
                              Registration Details (min 20 chars)
                            </p>
                          </>
                        )}

                        {watchCategory === "event" && (
                          <p className="text-xs flex items-center">
                            <span
                              className={`inline-block w-4 h-4 mr-2 rounded-full ${
                                form.getValues("description").length >= 20
                                  ? "bg-green-500"
                                  : "bg-zinc-600"
                              }`}
                            ></span>
                            Event Details (min 20 chars)
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full py-2 sm:py-3 text-sm sm:text-base bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold"
                      disabled={isSubmitting || isLoading || !isFormValid}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="faq">
            <div className="bg-[#111] rounded-lg border border-zinc-800 shadow-xl backdrop-blur-sm">
              <div className="p-3 sm:p-4 md:p-6">
                <h2 className="text-lg sm:text-xl font-semibold font-mont text-white border-b border-zinc-700 pb-3 mb-3 sm:mb-5">
                  Frequently Asked Questions
                </h2>

                <div className="space-y-6">
                  <div className="border-b border-zinc-800 pb-4">
                    <h3 className="font-medium mb-2 text-white">
                      What if I can&apos;t attend an event I registered for?
                    </h3>
                    <p className="text-zinc-400">
                      You can transfer your registration to another person by
                      submitting a ticket under &quot;Event Related&quot;.
                    </p>
                  </div>

                  <div className="border-b border-zinc-800 pb-4">
                    <h3 className="font-medium mb-2 text-white">
                      How long does it take to process support tickets?
                    </h3>
                    <p className="text-zinc-400">
                      We typically respond to support tickets within 24-48 hours
                      during business days.
                    </p>
                  </div>

                  <div className="border-b border-zinc-800 pb-4">
                    <h3 className="font-medium mb-2 text-white">
                      Can I update my registration information?
                    </h3>
                    <p className="text-zinc-400">
                      Yes, you can update your registration information up until
                      48 hours before the event. Submit a ticket with your
                      request details.
                    </p>
                  </div>

                  <div className="border-b border-zinc-800 pb-4">
                    <h3 className="font-medium mb-2 text-white">
                      My payment was successful but I&apos;m not registered for
                      the event
                    </h3>
                    <p className="text-zinc-400">
                      Please submit a &quot;Payment Verification&quot; ticket
                      with your payment screenshot and transaction ID. Our team
                      will verify and resolve this issue.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2 text-white">
                      I have a question not answered here
                    </h3>
                    <p className="text-zinc-400">
                      Please submit a support ticket with your question and our
                      team will get back to you as soon as possible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
