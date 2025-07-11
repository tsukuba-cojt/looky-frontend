import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Hono } from "jsr:@hono/hono";
import { createClient } from "npm:@supabase/supabase-js@2";
import type { Database } from "../database.types.ts";

const app = new Hono();

/**
 * @route GET /generate
 * @summary 服の推薦をリクエストする
 * @description
 * バックエンドにリクエストを送り、結果を取得する。
 *
 * @security BearerAuth
 *
 * @header Authorization Bearer Token
 *
 * @response 200 application/json
 * {
 *   data: object
 * }
 *
 * @response 400 application/json
 * {
 *   error: string
 * }
 */
app.post("/generate", async (c) => {
  try {
    const body = await c.req.json();
    const part = body.part ?? "";

    const supabase = createClient<Database>(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: c.req.header("Authorization") ?? "",
          },
        },
      },
    );

    const token = c.req.header("Authorization")?.replace("Bearer ", "");

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    const { data: task, error } = await supabase
      .from("t_task")
      .insert({ status: "pending", user_id: user?.id ?? "" }).select("id")
      .maybeSingle();

    if (error) {
      throw error;
    }

    const response = await fetch(
      `${Deno.env.get("FASTAPI_URL") ?? ""}/recommend`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Secret": Deno.env.get("FASTAPI_SECRET_KEY") ?? "",
        },
        body: JSON.stringify({
          task_id: task?.id ?? "",
          user_id: user?.id ?? "",
          clothes_category: part,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw error;
    }

    const data = await response.json();

    return new Response(JSON.stringify({ data }), {
      status: 200,
    });
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error }), {
      status: 400,
    });
  }
});

Deno.serve(app.fetch);
