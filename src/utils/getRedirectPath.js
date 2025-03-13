export const getRedirectPath = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "driver":
      return "/plate-no";
    case "guard":
      return "/access-pass";
    default:
      return "/";
  }
};
