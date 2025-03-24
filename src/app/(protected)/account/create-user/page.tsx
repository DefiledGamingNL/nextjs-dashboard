import UserCreationForm from "@/components/form/UserCreationForm";
import React from "react";
import { isLoggedIn } from "@/utils/supabase/loggedIn";
import { redirect } from "next/navigation";

async function UserCreationPage() {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    const { user } = await loggedIn;

    const isAdmin = user?.role === "admin";
    const isManager = user?.role === "manager";
    if (isAdmin || isManager) {
      return <UserCreationForm />;
    } else {
      redirect("/");
    }
  }
}

export default UserCreationPage;
