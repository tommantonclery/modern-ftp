export async function pingConnection(connectionId: string): Promise<"online" | "offline"> {
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        body: JSON.stringify({ connectionId, path: "." }),
        headers: { "Content-Type": "application/json" },
      });
      return res.ok ? "online" : "offline";
    } catch {
      return "offline";
    }
  }
  