import { createClient } from "@/utils/supabase/server";

export default async function Avatar() {
  const supabase = await createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();

  if (userError || !user?.user?.id) return null;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.user.id)
    .single();

  if (profileError || !profile?.avatar_url) return null;

  // Genereer een signed URL voor privé opslag
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from("avatars")
    .createSignedUrl(profile.avatar_url, 600); // Geldig voor 60 seconden

  if (signedUrlError || !signedUrlData?.signedUrl) return null;

  return (
    <img
      src={signedUrlData.signedUrl}
      alt="User avatar"
      className="w-24 h-24 rounded-full object-cover"
    />
  );
}
