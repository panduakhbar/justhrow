import { getCurrentSession } from "@/services/session";
import { redirect } from "next/navigation";

export default async function AuthLayout({ children }) {
  const session = await getCurrentSession();

  if (session) {
    redirect("/");
  }

  return children;
}
