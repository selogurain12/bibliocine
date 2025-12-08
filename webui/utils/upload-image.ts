export async function uploadToCloudinary(base64: string) {

  const data = new FormData();
  data.append("file", `data:image/jpeg;base64,${base64}`);
  data.append("upload_preset", process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  data.append("cloud_name", process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: "POST",
      body: data,
    }
  );

  console.log("Cloudinary upload response status:", res.status);

  const json = await res.json();
  console.log("Cloudinary response:", json);
  return json.secure_url as string;
}
