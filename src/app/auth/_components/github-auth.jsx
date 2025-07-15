import { Button } from "@/components/ui/button";

import { githubLoginAction } from "../actions";
import { IconBrandGithub } from "@tabler/icons-react";

export function GithubAuth() {
  return (
    <form action={githubLoginAction} className="w-full">
      <Button type="submit" variant="secondary" className="w-full">
        <IconBrandGithub />
        Continue with Github
      </Button>
    </form>
  );
}
