import React from "react";
import LoginForm from "@/components/LoginForm";
import { getCampuses } from "@/lib/data";

export default async function LoginPage() {
  // Fetched server-side so the Campus dropdown in Create Account shows
  // real campuses from the database, not a hardcoded list.
  const campuses = await getCampuses();
  return <LoginForm campuses={campuses} />;
}