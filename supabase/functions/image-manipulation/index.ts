import {
  ImageMagick,
  initializeImageMagick,
} from "npm:@imagemagick/magick-wasm";

const wasmBytes = await Deno.readFile(
  new URL(
    "magick.wasm",
    import.meta.resolve("npm:@imagemagick/magick-wasm"),
  ),
);
await initializeImageMagick(
  wasmBytes,
);

Deno.serve(async (req) => {
  const formData = await req.formData();
  const file = formData.get("file") as Blob;

  const content = new Uint8Array(await file.arrayBuffer());

  const result = ImageMagick.read(
    content,
    (img): Uint8Array => {
      img.resize(500, 300);
      img.blur(60, 5);

      return img.write(
        (data) => data,
      );
    },
  );

  return new Response(
    result,
    { headers: { "Content-Type": "image/png" } },
  );
});
