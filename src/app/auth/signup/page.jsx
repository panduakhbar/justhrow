import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { IconBrandGoogleFilled, IconBrandGithub } from "@tabler/icons-react";

export default function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-3.5">
      <h1 className="text-2xl font-bold">Create an account</h1>
      <form className="space-y-2.5">
        <Input placeholder="Name" name="name" required />
        <Input placeholder="Email address" type="email" name="email" required />
        <Input
          placeholder="Password"
          type="password"
          name="password"
          required
        />
        <Button className="w-[300px]">Register</Button>
      </form>
      <p className="text-gray-600">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-black hover:underline">
          Log in
        </Link>
      </p>
      <p className="text-center text-gray-600">or</p>
      <Button
        variant="secondary"
        className="w-[300px] font-semibold hover:bg-gray-300"
      >
        <IconBrandGoogleFilled />
        Continue with Google
      </Button>
      <Button
        variant="secondary"
        className="w-[300px] font-semibold hover:bg-gray-300"
      >
        <IconBrandGithub />
        Continue with GitHub
      </Button>
      <Link href="/" className="text-center text-gray-600 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
