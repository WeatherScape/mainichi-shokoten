"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export async function uploadArtworkImage(userId: string, blob: Blob) {
  const supabase = createBrowserSupabaseClient();
  const timestamp = Date.now();
  const path = `artworks/${userId}/${timestamp}.webp`;

  const { error } = await supabase.storage
    .from("artworks")
    .upload(path, blob, {
      contentType: "image/webp",
      upsert: false
    });

  if (error) {
    throw new Error(`画像を保存できませんでした: ${error.message}`);
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from("artworks").getPublicUrl(path);

  return publicUrl;
}
