import "server-only";

/** Defaults to enabled for existing local setups; deployments can explicitly disable access. */
export function isClientPortalEnabled() {
  return process.env["CLIENT_PORTAL_ENABLED"]?.trim().toLowerCase() !== "false";
}
