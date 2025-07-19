"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUTCDate, isWithinWeek } from "@/lib/utils";
import { createContentMany, deleteContent } from "@/services/content";
import { uploadManyFile } from "@/services/s3";
import { getCurrentSession } from "@/services/session";
import {
  deleteWorkspace,
  getWorkspace,
  updateWorkspace,
} from "@/services/workspace";

export async function appendContentsAction(_, form) {
  const workspaceId = form.get("workspaceId");
  if (!workspaceId) {
    return { error: { errors: ["Workspace ID is required."] } };
  }
  const files = form.getAll("files");

  try {
    const session = await getCurrentSession();
    if (!session) {
      return { error: { errors: ["You must be logged in to upload files."] } };
    }
    const user = session.user;

    const workspace = await getWorkspace({ id: workspaceId, userId: user.id });

    if (!workspace) {
      return { error: { errors: ["Workspace not found."] } };
    }

    const filepaths = await uploadManyFile({ files, folder: workspaceId });

    await createContentMany({
      data: files.map((file, i) => {
        return {
          name: file.name,
          url: filepaths[i] ?? "",
          mimetype: file.type,
          size: file.size.toString(),
          userId: user.id,
          workspaceId: workspaceId,
        };
      }),
    });
  } catch (error) {
    console.log("[ERROR] Upload Action:", error);
    return { error: { errors: ["Failed to upload files. Please try again."] } };
  }

  revalidatePath(`/workspaces/${workspaceId}`);

  return { error: { errors: [] }, success: true };
}

export async function settingsAction(_, form) {
  const workspaceId = form.get("workspaceId");
  const name = form.get("name");
  const date = form.get("date");
  const time = form.get("time");
  if (!workspaceId) {
    return { error: { errors: ["Workspace ID is required."] } };
  }

  const state = {
    name,
    date,
    time,
  };

  if (!name || !date || !time) {
    return {
      error: { errors: ["All fields are required."] },
      state,
    };
  }

  try {
    const session = await getCurrentSession();
    if (!session) {
      return {
        error: { errors: ["You must be logged in to update settings."] },
      };
    }
    const user = session.user;
    const newDate = createUTCDate({ dateUTCStr: date, timeStr: time });

    if (!isWithinWeek({ now: new Date(), later: newDate })) {
      return {
        error: { errors: ["The date must be within the next 7 days."] },
        state,
      };
    }

    await updateWorkspace({
      id: workspaceId,
      name: state.name,
      willDeletedAt: newDate,
      userId: user.id,
    });
  } catch (error) {
    console.log("[ERROR] Settings Action:", error);
    return {
      error: {
        errors: ["Failed to update workspace. Please try again."],
      },
      state,
    };
  }
  revalidatePath(`/workspaces/${workspaceId}`);

  return { error: { errors: [] }, success: true };
}

export async function deleteContentAction(_, form) {
  const id = form.get("id");
  const workspaceId = form.get("workspaceId");
  if (!id || !workspaceId) {
    return { error: { errors: ["Content ID and Workspace ID are required."] } };
  }
  try {
    const session = await getCurrentSession();
    if (!session) {
      return {
        error: { errors: ["You must be logged in to delete content."] },
      };
    }
    const user = session.user;

    await deleteContent({ id, userId: user.id });
  } catch (error) {
    console.log("[ERROR] Delete Content Action:", error);
    return {
      error: { errors: ["Failed to delete content. Please try again."] },
    };
  }

  revalidatePath(`/workspaces/${workspaceId}`);

  return { error: { errors: [] }, success: true };
}

export async function deleteWorkspaceAction(_, form) {
  const id = form.get("id");
  if (!id) {
    return { error: { errors: ["Workspace ID is required."] } };
  }

  try {
    const session = await getCurrentSession();
    if (!session) {
      return {
        error: { errors: ["You must be logged in to delete a workspace."] },
      };
    }
    const user = session.user;

    await deleteWorkspace({
      id,
      userId: user.id,
    });
  } catch (error) {
    console.log("[ERROR] Delete Workspace Action:", error);
    return {
      error: { errors: ["Failed to delete workspace. Please try again."] },
    };
  }

  revalidatePath("/workspaces");
  redirect("/workspaces");
}
