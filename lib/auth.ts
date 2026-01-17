import { createClient } from "@/supabase/client";

const supabase = createClient();

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error("Error signing in with Google:", error.message);
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut({ scope: "local" });
  window.location.reload();

  if (error) {
    console.error("Error signing out:", error.message);
  }
};
