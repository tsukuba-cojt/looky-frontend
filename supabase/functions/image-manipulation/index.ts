import {
  ImageMagick,
  initializeImageMagick,
} from "npm:@imagemagick/magick-wasm";
import { Hono } from "jsr:@hono/hono";

const app = new Hono();

const wasmBytes = await Deno.readFile(
  new URL(
    "magick.wasm",
    import.meta.resolve("npm:@imagemagick/magick-wasm"),
  ),
);
await initializeImageMagick(
  wasmBytes,
);

app.post("/send-email", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get("file") as Blob;

    const content = new Uint8Array(await file.arrayBuffer());

    const result = ImageMagick.read(
      content,
      (img): Uint8Array => {
        img.resize(500, 500);
        return img.write(
          (data) => data,
        );
      },
    );

    return new Response(
      result,
      { headers: { "Content-Type": "image/png" } },
    );
  } catch (error) {
    console.error(error);

    return new Response(JSON.stringify({ error }), {
      status: 400,
    });
  }
});

Deno.serve(app.fetch);
