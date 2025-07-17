import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProfileCard({ name, email, avatarUrl }) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="flex flex-col items-center space-y-2 pt-10">
        <Avatar className="h-24 w-24">
          {avatarUrl ? (
            <AvatarImage src={avatarUrl} alt={name} />
          ) : (
            <AvatarFallback className="uppercase">
              {name?.slice(0, 2)}
            </AvatarFallback>
          )}
        </Avatar>
        <CardTitle className="text-center text-2xl">{name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {email}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-4">
        <Button asChild className="w-full" variant="secondary">
          <Link href="/workspaces">View Your Workspace</Link>
        </Button>
        <Button asChild className="w-full">
          <Link href="/profile/edit">Edit Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
