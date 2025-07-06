import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral text-neutral-foreground">
      <Card className="w-full max-w-md border border-neutral-300 shadow-md rounded-xl bg-neutral-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-semibold text-neutral-900">
            Log in
          </CardTitle>
          <CardDescription className="text-neutral-500">
            Sign in to continue to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-neutral-900"
              >
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                required
                className="bg-neutral-50 border border-neutral-300 rounded-md shadow-sm
                  hover:border-neutral-700 focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700 transition"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block mb-1 text-sm font-medium text-neutral-900"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                required
                className="bg-neutral-50 border border-neutral-300 rounded-md shadow-sm
                  hover:border-neutral-700 focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700 transition"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-neutral-900 text-neutral-50 font-semibold rounded-md shadow-md
                hover:bg-neutral-700 transition"
            >
              Sign In
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-0">
          <p className="text-center text-neutral-500">or continue with</p>

          <Button
            variant="outline"
            className="w-full rounded-md border border-neutral-300 text-neutral-900
              hover:bg-neutral-100 transition flex items-center justify-center gap-2"
          >
            <FcGoogle size={20} />
            Continue with Google
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-md border border-neutral-300 text-neutral-900
              hover:bg-neutral-100 transition flex items-center justify-center gap-2"
          >
            <FaGithub size={20} />
            Continue with GitHub
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
