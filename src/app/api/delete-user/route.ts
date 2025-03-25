import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/adminClient";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    // CHECK IF AUTHENTICATED
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getUser();

    if (sessionError || !sessionData.user) {
      return NextResponse.json(
        { error: "Unauthorized: No valid session" },
        { status: 401 }
      );
    }

    const userId = sessionData.user.id;

    // FETCH USER'S ROLE FROM THE 'PROFILES' TABLE
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError || !profile?.role) {
      return NextResponse.json(
        { error: "Unauthorized: Unable to verify role" },
        { status: 403 }
      );
    }

    if (profile.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Only admins can delete users" },
        { status: 403 }
      );
    }

    // DELETE THE PROFILE FIRST (to avoid foreign key constraint issues)
    const { error: profileDeleteError } = await adminSupabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (profileDeleteError) {
      console.error("Error deleting profile:", profileDeleteError.message);
      return NextResponse.json(
        { error: "Failed to delete user profile" },
        { status: 400 }
      );
    }

    // DELETE THE USER FROM AUTH
    const { error: userDeleteError } =
      await adminSupabase.auth.admin.deleteUser(id);

    if (userDeleteError) {
      console.error("Supabase error:", userDeleteError.message);
      return NextResponse.json(
        { error: userDeleteError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
