import axios from "axios";

function jwtInterceptor() {
  axios.interceptors.request.use((req) => {
    // global loading start (skip if explicitly disabled)
    const disableGlobal = Boolean(
      (req.headers && (req.headers["X-Disable-Global-Loading"] || req.headers["x-disable-global-loading"]))
    );
    if (!disableGlobal) {
      try {
        window.dispatchEvent(new CustomEvent("global:loading", { detail: { delta: 1 } }));
        // mark so we can decrement only if we incremented
        req.__countedForGlobalLoading = true;
      } catch {}
    }
    const hasToken = Boolean(window.localStorage.getItem("access_token"));

    if (hasToken) {
      req.headers = {
        ...req.headers,
        Authorization: `Bearer ${window.localStorage.getItem("access_token")}`,
      };
    }

    return req;
  });

  axios.interceptors.response.use(
    (response) => {
      // global loading end (only if counted)
      if (response?.config?.__countedForGlobalLoading) {
        try {
          window.dispatchEvent(new CustomEvent("global:loading", { detail: { delta: -1 } }));
        } catch {}
      }
      return response;
    },
    (error) => {
      // global loading end on error (only if counted)
      if (error?.config?.__countedForGlobalLoading) {
        try {
          window.dispatchEvent(new CustomEvent("global:loading", { detail: { delta: -1 } }));
        } catch {}
      }
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.error.includes("Unauthorized")
      ) {
        window.localStorage.removeItem("access_token");
        // Don't automatically redirect - let the components handle the error
        console.error("Authentication failed:", error.response.data.error);
      }
      return Promise.reject(error);
    }
  );
}

export default jwtInterceptor;

