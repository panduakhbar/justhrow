"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/services/session";
import { createWorkspace } from "@/services/workspace";

export async function createWorkspaceAction(_, __) {
  const session = await getCurrentSession();

  if (!session?.user) {
    return {
      errors: ["No user found"],
    };
  }

  const workspace = await createWorkspace({ userId: session.user.id });

  redirect(`/workspaces/${workspace.id}`);
}
