import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconBrandGithub, IconBrandGoogleFilled } from "@tabler/icons-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="m-auto flex h-screen w-full max-w-sm flex-col items-center justify-center space-y-3.5 p-4">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <form className="w-full space-y-2.5">
        <Input placeholder="Name" name="name" required />
        <Input placeholder="Email address" type="email" name="email" required />
        <Input
          placeholder="Password"
          type="password"
          name="password"
          required
        />
        <Button className="w-full">Register</Button>
      </form>
      <p className="text-sm">
        <span className="text-muted-foreground">Already have an account? </span>
        <Link href="/auth/login" className="text-black hover:underline">
          Log in
        </Link>
      </p>
      <p className="text-muted-foreground text-center">or</p>
      <Button variant="secondary" className="w-full">
        <IconBrandGoogleFilled />
        Continue with Google
      </Button>
      <Button variant="secondary" className="w-full">
        <IconBrandGithub />
        Continue with GitHub
      </Button>
      <Link href="/" className="text-muted-foreground text-sm hover:underline">
        Back to home
      </Link>
    </div>
  );
}
