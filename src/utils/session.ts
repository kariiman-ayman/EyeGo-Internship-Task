export type StoredSession = {
  isAuthenticated: boolean;
  user: { email: string } | null;
  token: string | null;
};

const STORAGE_KEY = "eyego-session";

export const JUST_LOGGED_IN_KEY = "eyego-just-logged-in";

export function loadSession(): StoredSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

export function saveSession(session: StoredSession) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    /* ignore storage errors */
  }
}