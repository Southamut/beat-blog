import { useEffect, useState } from "react";

export default function GlobalLoading() {
  const [pending, setPending] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      const delta = e?.detail?.delta ?? 0;
      setPending((n) => Math.max(0, n + delta));
    };
    window.addEventListener("global:loading", handler);
    return () => window.removeEventListener("global:loading", handler);
  }, []);

  if (pending <= 0) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="h-12 w-12 border-4 border-brown-200 border-t-brown-600 rounded-full animate-spin" />
    </div>
  );
}


