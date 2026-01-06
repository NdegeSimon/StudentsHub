import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const theme = "dark";

  useEffect(() => {
    // Set data-theme attribute on html element for Tailwind dark mode
    document.documentElement.setAttribute('data-theme', theme);
    // Also set class for any components that might be using it
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return ctx;
};
