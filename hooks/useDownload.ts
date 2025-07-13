import { useCallback } from "react";
import useSWRMutation from "swr/mutation";
import { supabase } from "@/lib/client";

export const useDownload = () => {
  const download = useCallback(
    async (
      _: string,
      { arg }: { arg: { bucketName: string; objectKey: string } },
    ) => {
      const { data, error } = await supabase.functions.invoke("download", {
        method: "POST",
        body: {
          bucket_name: arg.bucketName,
          object_key: arg.objectKey,
        },
      });

      if (error) {
        throw error;
      }

      return data.url;
    },
    [],
  );

  return useSWRMutation("download", download);
};
