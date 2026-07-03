export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDIARY_PRESET_UPLOAD!
  );

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDIARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Upload failed");
  }

  const data = await res.json();
  return data.secure_url as string;
}