import { useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { supabase } from "@/lib/client";

export const useUpload = () => {
  const upload = useCallback(
    async (
      _: string,
      { arg }: { arg: { blob: Blob; bucketName: string; objectKey: string } },
    ) => {
      const { data, error } = await supabase.functions.invoke("upload", {
        method: "POST",
        body: {
          bucket_name: arg.bucketName,
          object_key: arg.objectKey,
          content_type: arg.blob.type,
        },
      });

      if (error) {
        throw error;
      }

      const response = await fetch(data.url, {
        method: "PUT",
        body: arg.blob,
        headers: { "Content-Type": arg.blob.type },
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }
    },
    [],
  );

  return useSWRMutation("upload", upload);
};
