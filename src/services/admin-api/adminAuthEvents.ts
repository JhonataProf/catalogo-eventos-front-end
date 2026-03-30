export const ADMIN_AUTH_EXPIRED_EVENT = "celeiro-admin-auth-expired";

export function notifyAdminAuthExpired(): void {
  window.dispatchEvent(new Event(ADMIN_AUTH_EXPIRED_EVENT));
}
