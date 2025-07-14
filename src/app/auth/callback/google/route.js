import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { googleOAuth } from "@/lib/auth";
import {
  GOOGLE_OAUTH_USER_INFO_URL,
  IS_PROD,
  SESSION_LIFETIME_IN_DAYS,
} from "@/lib/constant";
import { createSession } from "@/services/session";
import { createUser, getUserByEmail } from "@/services/user";

export async function GET(request) {
  const cookieStore = await cookies();
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const codeVerifier = cookieStore.get("codeVerifier")?.value;

  if (!code || !codeVerifier) {
    return NextResponse.redirect(new URL("/auth/login"));
  }

  try {
    const tokens = await googleOAuth.validateAuthorizationCode(
      code,
      codeVerifier,
    );
    const accessToken = tokens.accessToken();

    const res = await fetch(GOOGLE_OAUTH_USER_INFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await res.json();

    const existingUser = await getUserByEmail({ email: userData.email });

    if (existingUser) {
      const newSession = await createSession(existingUser.id);
      cookieStore.set("session", newSession.id, {
        httpOnly: true,
        secure: IS_PROD,
        maxAge: 60 * 60 * 24 * SESSION_LIFETIME_IN_DAYS,
        path: "/",
      });
    } else {
      const newUser = await createUser({
        email: user.email,
        name: user.name,
        avatarUrl: user.picture,
      });

      const newSession = await createSession(newUser.id);
      cookieStore.set("session", newSession.id, {
        httpOnly: true,
        secure: IS_PROD,
        maxAge: 60 * 60 * 24 * SESSION_LIFETIME_IN_DAYS,
        path: "/",
      });
    }
  } catch (e) {
    console.log("[ERROR] Google Callback:", error);
    return NextResponse.redirect(new URL("/auth/login"));
  }

  redirect("/");
}
