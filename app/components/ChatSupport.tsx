"use client";

import { useState } from "react";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

export default function ChatSupport() {
  const [open, setOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();

  const handleClick = async () => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    setOpen(true);
  };

  return (
    <>
      <ChatButton onClick={handleClick} />
      {open && user && <ChatWindow userId={user.id} onClose={() => setOpen(false)} />}
    </>
  );
}
