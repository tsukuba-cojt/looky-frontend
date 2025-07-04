import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { Hono } from "jsr:@hono/hono";
import { GetObjectCommand, S3Client } from "npm:@aws-sdk/client-s3";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner";

const app = new Hono();

const client = new S3Client({
  region: Deno.env.get("AWS_REGION_NAME") ?? "",
  credentials: {
    accessKeyId: Deno.env.get("AWS_ACCESS_KEY") ?? "",
    secretAccessKey: Deno.env.get("AWS_SECRET_KEY") ?? "",
  },
});

/**
 * @route POST /download
 * @summary S3のオブジェクトに対する署名付きURLを発行
 * @description
 * `bucket_name`と`object_key`に基づいて署名付きURLを生成する。
 *
 * @requestBody application/json
 * {
 *   bucket_name: string,
 *   object_key: string
 * }
 *
 * @response 200 application/json
 * {
 *   url: string
 * }
 *
 * @response 400 application/json
 * {
 *   error: string
 * }
 */
app.post("/download", async (c) => {
  try {
    const body = await c.req.json();
    const bucketName = body.bucket_name ?? "";
    const objectKey = body.object_key ?? "";

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    return new Response(JSON.stringify({ url }), {
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
