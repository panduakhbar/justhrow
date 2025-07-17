import { getCurrentSession } from "@/services/session";
import { ProfileCard } from "../_components/profile-card";

export default async function ProfilePage() {
  const session = await getCurrentSession();

  if (!session || !session.user) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <p className="text-muted-foreground">Not logged in</p>
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="flex min-h-screen items-center justify-center">
      <ProfileCard
        name={user.name}
        email={user.email}
        avatarUrl={user.avatarUrl}
        id={user.id}
      />
    </main>
  );
}
