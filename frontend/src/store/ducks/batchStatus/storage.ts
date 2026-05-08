export const saveTheme = (theme: "light" | "dark") => {
  localStorage.setItem("theme", theme);
};

export const getTheme = (): "light" | "dark" | null => {
  return localStorage.getItem("theme") as "light" | "dark" | null;
};
