"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateProfile } from "@/services/update-profile";

export default function ProfileForm({ user }) {
  const router = useRouter();
  const [name, setName] = useState(user.name || "");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateProfile({ name, password });
        toast.success("Profile updated successfully");
        setPassword("");
        router.push("/profile");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update profile");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-sm rounded-lg border border-gray-200 bg-white shadow-md">
      <form className="space-y-5 px-4 py-5" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
            autoComplete="new-password"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
