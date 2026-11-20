import { authClient } from "./auth-client";

// Server er protected route er jonno JWT token header
export async function getAuthHeader() {
  const { data } = await authClient.token();
  return { Authorization: `Bearer ${data?.token}` };
}
