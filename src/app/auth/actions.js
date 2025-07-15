"use server";

import { googleOAuth, githubOAuth } from "@/lib/auth";
import { IS_PROD, SESSION_LIFETIME_IN_DAYS } from "@/lib/constant";
import { verifyPassword } from "@/services/auth";
import { createSession } from "@/services/session";
import { createUser, getUserByEmail } from "@/services/user";
import * as arctic from "arctic";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}

export async function loginAction(_, formData) {
  const cookieStore = await cookies();

  const email = formData.get("email");
  const password = formData.get("password");

  const state = {
    email,
    password,
  };

  if (!email || !password) {
    return {
      error: {
        errors: ["Email and password are required"],
        properties: {
          email: {
            errors: !email ? ["Email is required"] : [],
          },
          password: {
            errors: !password ? ["Password is required"] : [],
          },
        },
      },
      state,
    };
  }

  try {
    const user = await getUserByEmail({ email, withPassword: true });
    if (!user) {
      return { error: { errors: ["User not found"] }, state };
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return { error: { errors: ["Invalid password"] }, state };
    }

    const session = await createSession(user.id);
    cookieStore.set("session", session.id, {
      httpOnly: true,
      secure: IS_PROD,
      maxAge: 60 * 60 * 24 * SESSION_LIFETIME_IN_DAYS,
      path: "/",
    });
  } catch (error) {
    console.log("[ERROR] Login Action:", error);
    return {
      error: {
        errors: ["Something went wrong"],
      },
      state,
    };
  }

  redirect("/");
}

export async function registerAction(_, formData) {
  const cookieStore = await cookies();

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  const state = {
    name,
    email,
    password,
  };

  if (!name || !email || !password) {
    return {
      error: {
        errors: ["Name, email and password are required"],
        properties: {
          name: {
            errors: !name ? ["Name is required"] : [],
          },
          email: {
            errors: !email ? ["Email is required"] : [],
          },
          password: {
            errors: !password ? ["Password is required"] : [],
          },
        },
      },
      state,
    };
  }

  try {
    const currentUser = await getUserByEmail({ email });

    if (currentUser) {
      return {
        error: {
          errors: ["User already exists"],
        },
        state: { name, email, password },
      };
    }

    const user = await createUser({ name, email, password });

    const session = await createSession(user.id);
    cookieStore.set("session", session.id, {
      httpOnly: true,
      secure: IS_PROD,
      maxAge: 60 * 60 * 24 * SESSION_LIFETIME_IN_DAYS,
      path: "/",
    });
  } catch (error) {
    console.log("[ERROR] Register Action:", error);
    return {
      error: {
        errors: ["Something went wrong"],
      },
    };
  }

  redirect("/");
}

export async function googleLoginAction() {
  const cookieStore = await cookies();
  const state = arctic.generateState();
  const codeVerifier = arctic.generateCodeVerifier();
  const scopes = ["openid", "profile", "email"];

  const url = googleOAuth.createAuthorizationURL(state, codeVerifier, scopes);

  cookieStore.set("codeVerifier", codeVerifier);
  redirect(url.toString());
}

export async function githubLoginAction() {
  const state = arctic.generateState();
  const scopes = ["read:user", "user:email"];
  const url = githubOAuth.createAuthorizationURL(state, scopes);
  redirect(url);
}
