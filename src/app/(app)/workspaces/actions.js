"use server";

import { redirect } from "next/navigation";
import { getCurrentSession } from "@/services/session";
import { createWorkspace } from "@/services/workspace";

export async function createWorkspaceAction(_, __) {
  let workspaceId = "";
  try {
    const session = await getCurrentSession();

    if (!session?.user) {
      return {
        error: {
          errors: ["You must be logged in to create workspace."],
        },
      };
    }

    const workspace = await createWorkspace({ userId: session.user.id });
    workspaceId = workspace.id;
  } catch (error) {
    console.log("[ERROR] Create Workspace Action:", error);
    return {
      error: {
        errors: ["Failed to create workspace. Please try again."],
      },
    };
  }

  redirect(`/workspaces/${workspaceId}`);
}
