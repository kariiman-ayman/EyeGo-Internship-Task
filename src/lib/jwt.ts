import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "eyego-dev-jwt-secret-change-me",
);

const ALGORITHM = "HS256";
const EXPIRES_IN = "2h";

export type TokenPayload = {
  sub: string;
  email: string;
};

export async function signToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      algorithms: [ALGORITHM],
    });

    return payload as TokenPayload;
  } catch {
    return null;
  }
}