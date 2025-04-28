import "server-only";
import { auth } from "@repo/auth/server";
import { Svix } from "svix";
import { keys } from "../keys";
import { headers } from "next/headers";

const svixToken = keys().SVIX_TOKEN;

export const send = async (eventType: string, payload: object) => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  const svix = new Svix(svixToken);

  const h = await headers(); // from next/headers
  const session = await auth.api.getSession({
    headers: h,
  });
  const orgId = session?.session.activeOrganizationId;
  if (!orgId) {
    return;
  }

  return svix.message.create(orgId, {
    eventType,
    payload: {
      eventType,
      ...payload,
    },
    application: {
      name: orgId,
      uid: orgId,
    },
  });
};

export const getAppPortal = async () => {
  if (!svixToken) {
    throw new Error("SVIX_TOKEN is not set");
  }

  const svix = new Svix(svixToken);

  const h = await headers(); // from next/headers
  const session = await auth.api.getSession({
    headers: h,
  });
  const orgId = session?.session.activeOrganizationId;
  if (!orgId) {
    return;
  }

  return svix.authentication.appPortalAccess(orgId, {
    application: {
      name: orgId,
      uid: orgId,
    },
  });
};
