import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Check if a user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Set the online_status to false in the user's profile
    await supabase
      .from("profiles") // Replace "profiles" with your actual table name
      .update({ online_status: false })
      .eq("id", user.id);

    // Sign the user out
    await supabase.auth.signOut();
  }

  // Revalidate the path to update the UI
  revalidatePath("/", "layout");

  // Redirect to the login page
  return NextResponse.redirect(new URL("/login", req.url), {
    status: 302,
  });
}
