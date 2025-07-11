import useSWRMutation from "swr/mutation";
import { supabase } from "@/lib/client";

const download = async (
  _: string,
  { arg }: { arg: { blob: Blob; bucketName: string; objectKey: string } },
) => {
  const { data, error } = await supabase.functions.invoke("download", {
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

  return data.url;
};

export const useDownload = () => {
  return useSWRMutation("download", download);
};
