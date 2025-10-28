"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      const { data: session } = await supabase.auth.getSession();
      const user = session.session?.user;

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (error || !data?.is_admin) {
        toast.error("Not authorized");
        router.push("/");
        return;
      }

      setAllowed(true);
      setLoading(false);
    }

    verify();
  }, [router]);

  if (loading) return <div>Checking permissions...</div>;
  if (!allowed) return null;

  return <>{children}</>;
}
