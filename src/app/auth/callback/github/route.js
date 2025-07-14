import { githubOAuth } from "@/lib/auth";
import {
  GOOGLE_OAUTH_USER_INFO_URL,
  IS_PROD,
  SESSION_LIFETIME_IN_DAYS,
} from "@/lib/constant";
import { createSession } from "@/services/session";
import { getUserByEmail } from "@/services/user";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function GET(request) {
  const cookieStore = await cookies();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  try {
    const tokens = await githubOAuth.validateAuthorizationCode(code);
    const accessToken = tokens.accessToken();

    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userInfo = await response.json();
    const emailResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const emails = await emailResponse.json();

    const primaryEmail = emails.find((e) => e.primary && e.verified)?.email;

    const existingUser = await getUserByEmail({ email: primaryEmail });

    if (existingUser) {
      const newSession = await createSession({ userId: existingUser.id });
      cookieStore.set("session", newSession.id, {
        httpOnly: true,
        secure: IS_PROD,
        maxAge: 60 * 60 * 24 * SESSION_LIFETIME_IN_DAYS,
        path: "/",
      });
    } else {
      const newUser = await prisma.user.create({
        data: {
          name: userInfo.login,
          email: primaryEmail,
          avatarUrl: userInfo.avatar_url,
        },
      });

      const newSession = await createSession({ userId: newUser.id });
      cookieStore.set("session", newSession.id, {
        httpOnly: true,
        secure: IS_PROD,
        maxAge: 60 * 60 * 24 * SESSION_LIFETIME_IN_DAYS,
        path: "/",
      });
    }
  } catch (e) {
    console.log({ e });
    return new Response(
      "Invalid authorization code, credentials, or redirect URI",
      { status: 400 },
    );
  }

  redirect("/");
}
