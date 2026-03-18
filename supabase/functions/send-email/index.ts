import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Hono } from "jsr:@hono/hono";
import React from "npm:react";
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";
import { Resend } from "npm:resend";
import { render } from "npm:@react-email/render";
import { MagicLinkEmail } from "./_templates/magic-link.tsx";
import i18n from "./locales/index.ts";

const app = new Hono();

const resend = new Resend(Deno.env.get("RESEND_API_KEY") ?? "");
const hookSecret = (Deno.env.get("SEND_EMAIL_HOOK_SECRET") ?? "").replace(
  "v1,whsec_",
  "",
);
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";

app.post("/send-email", async (c) => {
  try {
    const payload = await c.req.text();
    const headers = Object.fromEntries(c.req.raw.headers);
    const wh = new Webhook(hookSecret);

    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string;
      };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
        site_url: string;
        token_new: string;
        token_hash_new: string;
      };
    };

    await i18n.changeLanguage("ja");

    const html = await render(
      React.createElement(MagicLinkEmail, {
        supabase_url: supabaseUrl,
        token,
        token_hash,
        redirect_to,
        email_action_type,
      }),
    );

    const { error } = await resend.emails.send({
      from: "noreply@yushin.dev",
      to: [user.email],
      subject: i18n.t("magic_link.subject"),
      html,
    });

    if (error) {
      throw new Error(error.message);
    }

    return c.body(JSON.stringify({}), 200, {
      "Content-Type": "application/json",
    });
  } catch {
    return c.body(
      JSON.stringify({
        error: {
          http_code: 400,
          message: "Bad Request",
        },
      }),
      400,
      {
        "Content-Type": "application/json",
      },
    );
  }
});

Deno.serve(app.fetch);
