import { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <DotLottieReact
        src="https://lottie.host/8bc615ca-8b0f-469c-a967-505f6d5ee1ab/iyCZorYvtk.lottie"
        loop
        autoplay
        className="w-24 lg:w-32 h-24 lg:h-32"
      />
    </div>
  );
}
