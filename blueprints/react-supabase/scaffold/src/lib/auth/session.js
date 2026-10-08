// Session is validated on the server only.
// Client code must not parse JWTs or import the database client.

export function requireSession(session) {
  if (!session || !session.user) {
    throw new Error("Unauthenticated");
  }
  return session.user;
}