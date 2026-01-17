"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const UserProfileCard = ({
  user,
  userData,
}: {
  user: any;
  userData: any;
}) => {
  if (!user) return null;

  // Generate initials for fallback
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-md p-3 flex items-center gap-3">
      <Avatar className="h-10 w-10 border border-zinc-700">
        <AvatarImage
          src={user.user_metadata?.avatar_url || ""}
          alt={userData?.name || user.email}
        />
        <AvatarFallback className="bg-fuchsia-900 text-white">
          {getInitials(userData?.name || user.email)}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-white">{userData?.name || "User"}</p>
        <p className="text-xs text-zinc-400">{user.email}</p>
      </div>
    </div>
  );
};
