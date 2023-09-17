import type {
  SessionStorage} from "@remix-run/cloudflare";
import {
  createWorkersKVSessionStorage,
  logDevReady
} from "@remix-run/cloudflare";
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

type SessionData = {};

type SessionFlashData = {};

interface Env {
  VGMUSIC: KVNamespace;
  sessionStorage: SessionStorage<SessionData, SessionFlashData>;
}

declare module "@remix-run/server-runtime" {
  interface AppLoadContext extends Env {}
}

if (process.env.NODE_ENV === "development") {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (context) => ({
    env: context.env,
    VGMUSIC: context.env.VGMUSIC,
    sessionStorage: createWorkersKVSessionStorage({
      kv: context.env.VGMUSIC,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        secrets: [context.env.VGMUSIC_SECRET],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
        name: "__session",
      },
    }),
  }),
  mode: process.env.NODE_ENV,
});
