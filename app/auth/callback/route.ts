import { createClient } from "@/supabase/server";
import { permanentRedirect } from "next/navigation";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();

    await supabase.auth.exchangeCodeForSession(code);
  }

  return permanentRedirect(requestUrl.pathname);
}
