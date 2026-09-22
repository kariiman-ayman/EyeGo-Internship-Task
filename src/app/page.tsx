"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { loadSession } from "@/utils/session";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = loadSession();

    router.replace(session?.isAuthenticated ? "/dashboard" : "/login");
  }, [router]);

  return null;
}