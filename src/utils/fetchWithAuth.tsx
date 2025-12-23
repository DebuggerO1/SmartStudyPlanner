export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {
  // ✅ token from BOTH storages (remember me support)
  let token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    credentials: "include" // 🔑 refresh token cookie
  });

  // ---------------- REFRESH FLOW ----------------
  if (res.status === 401) {
    const refreshRes = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`,
      {
        method: "POST",
        credentials: "include"
      }
    );

    if (!refreshRes.ok) {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      window.location.href = "/login";
      return res;
    }

    const data = await refreshRes.json();

    // ✅ store new access token (respect previous choice)
    if (localStorage.getItem("token")) {
      localStorage.setItem("token", data.token);
    } else {
      sessionStorage.setItem("token", data.token);
    }

    // 🔁 retry original request with new token
    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${data.token}`
      },
      credentials: "include"
    });
  }

  return res;
};
