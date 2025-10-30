import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useEmailConfirmationRedirect({ reloadOnceKey = "reg_success_refreshed" } = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    const { hash, pathname, search } = window.location;

    if (!hash) return;

    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const error = params.get("error");
    const errorCode = params.get("error_code");
    const type = params.get("type");

    // Clean the hash from URL immediately
    window.history.replaceState(null, "", `${pathname}${search}`);

    if (error || errorCode === "otp_expired" || errorCode === "otp_disabled") {
      navigate("/sign-up?status=otp_expired", { replace: true });
      return;
    }

    if (type === "signup") {
      const already = sessionStorage.getItem(reloadOnceKey);
      if (!already) {
        sessionStorage.setItem(reloadOnceKey, "1");
        window.location.reload();
      }
    }
  }, [navigate, reloadOnceKey]);
}


