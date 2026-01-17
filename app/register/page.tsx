import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const supabase = await createClient();

  // Get authenticated user server-side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect if not logged in
    redirect("/");
  }

  // Check if user exists in database
  let userData = null;
  let userExists = false;
  let existingTexusId = "";

  if (user.email) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", user.email)
      .single();

    if (data && !error) {
      userData = data;
      userExists = true;
      existingTexusId = data.texus_id;
    }
  }

  return (
    <RegisterForm
      user={user}
      userData={userData}
      userExists={userExists}
      existingTexusId={existingTexusId}
    />
  );
}
