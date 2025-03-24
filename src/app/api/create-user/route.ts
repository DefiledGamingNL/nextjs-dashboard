import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/adminClient";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    // Get the authenticated user
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getUser();

    if (sessionError || !sessionData.user) {
      return NextResponse.json(
        { error: "Unauthorized: No valid session" },
        { status: 401 }
      );
    }

    const userId = sessionData.user.id;

    // Fetch user's role from the 'profiles' table
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
        { error: "Forbidden: Only admins can create users" },
        { status: 403 }
      );
    }

    // Proceed with user creation if authorized
    const { data, error } = await adminSupabase.auth.admin.createUser({
      email,
      password,
    });

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ user: data.user }, { status: 200 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
