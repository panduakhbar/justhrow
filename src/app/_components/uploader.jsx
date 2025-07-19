"use client";

import React from "react";
import { toast } from "sonner";
import { ContentUploader } from "@/components/macro/content-uploader";
import { newContentsAction } from "../actions";

const initialState = {
  error: {
    errors: [],
  },
};

export function Uploader() {
  const [state, action, pending] = React.useActionState(
    newContentsAction,
    initialState,
  );

  React.useEffect(() => {
    if (state.error?.errors) {
      state.error.errors.map((error) => {
        toast.error(error);
      });
    }
  }, [state]);

  return (
    <form action={action} className="w-full">
      <ContentUploader pending={pending} />
    </form>
  );
}
