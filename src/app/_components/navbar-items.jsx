"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NavbarItems() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth");

  if (isAuthPage) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-3 p-4">
      <Button className="rounded-full" asChild>
        <Link href="/auth/login">Log in</Link>
      </Button>
      <Button className="rounded-full" variant="secondary" asChild>
        <Link href="/auth/signup">Sign up to justhrow</Link>
      </Button>
    </div>
  );
}
