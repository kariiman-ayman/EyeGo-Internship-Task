import { MOCK_EMAIL, MOCK_PASSWORD } from "@/data/credentials";
import { hashPassword, verifyPassword } from "./password";

type StoredUser = {
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
};

export class UserError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

const users = new Map<string, StoredUser>();

function seedAdminUser() {
  const { salt, hash } = hashPassword(MOCK_PASSWORD);

  users.set(MOCK_EMAIL, {
    email: MOCK_EMAIL,
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  });
}

seedAdminUser();

export function createUser(email: string, password: string): StoredUser {
  const normalizedEmail = email.toLowerCase();

  if (users.has(normalizedEmail)) {
    throw new UserError(
      409,
      "An account with this email already exists.",
    );
  }

  const { salt, hash } = hashPassword(password);
  const user: StoredUser = {
    email: normalizedEmail,
    passwordHash: hash,
    salt,
    createdAt: new Date().toISOString(),
  };

  users.set(normalizedEmail, user);

  return user;
}

export function authenticate(
  email: string,
  password: string,
): StoredUser | null {
  const user = users.get(email.toLowerCase());

  if (!user) {
    return null;
  }

  return verifyPassword(password, user.salt, user.passwordHash) ? user : null;
}