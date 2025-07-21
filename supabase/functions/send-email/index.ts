import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Hono } from "jsr:@hono/hono";
import React from "npm:react";
import { Webhook } from "https://esm.sh/standardwebhooks";
import { Resend } from "npm:resend";
import { renderAsync } from "npm:@react-email/components";
import { MagicLinkEmail } from "./_templates/magic-link.tsx";
import i18n from "./locales/index.ts";

const app = new Hono();

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);
const hookSecret = Deno.env.get("SEND_EMAIL_HOOK_SECRET") as string;

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

    const html = await renderAsync(
      React.createElement(MagicLinkEmail, {
        supabase_url: Deno.env.get("SUPABASE_URL") ?? "",
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
      throw error;
    }

    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
});

Deno.serve(app.fetch);
