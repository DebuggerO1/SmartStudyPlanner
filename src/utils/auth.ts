export const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};
export const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

export const clearToken = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};
