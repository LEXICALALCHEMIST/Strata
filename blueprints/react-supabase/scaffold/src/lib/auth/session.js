export function requireSession(session) {
  if (!session || !session.user) {
    throw new Error("Unauthenticated");
  }
  return session.user;
}