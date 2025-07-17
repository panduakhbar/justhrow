// app/profile/page.tsx
import { getCurrentSession } from "@/services/session";
import { getUserById } from "@/services/user";
import ProfileForm from "@/app/_components/profile-form";

export default async function ProfilePage() {
  const session = await getCurrentSession();

  if (!session?.user?.id) {
    return <p className="p-4 text-red-500">Unauthorized</p>;
  }

  const user = await getUserById({ id: session.user.id });

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm items-center justify-center p-8">
      <div className="flex w-full flex-col items-center justify-center gap-4">
        <h1 className="mb-6 text-center text-2xl font-bold">Edit Profile</h1>
        <ProfileForm user={user} />
      </div>
    </main>
  );
}
