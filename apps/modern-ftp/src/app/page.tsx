"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted px-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Modern FTP
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          A secure, elegant file manager that brings FTP into the modern web. Login to get started.
        </p>
        <Button size="lg" onClick={() => signIn("google")}>Sign in with Google</Button>
      </div>
    </main>
  );
}
