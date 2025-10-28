import { DefaultTheme } from "styled-components";

export const colors = {
  black: "#0b0b0b",
  lightBlack: "#111111",
  white: "#ffffff",
  softWhite: "#f5f5f5",
  gold: "#d4af37",
  lightGray: "#bdbdbd",
  gray: "#888888",
  darkGray: "#555555",
};

export const lightTheme: DefaultTheme = {
  colors: {
    background: colors.softWhite,
    text: colors.black,
    accent: colors.gold,
    gray: colors.gray,
    darkGray: colors.darkGray,
    cardBg: "rgba(0, 0, 0, 0.05)",
    shadow: "rgba(0,0,0,0.6)",
    conversationBg: "#e2e0e0",
  },
};

export const darkTheme: DefaultTheme = {
  colors: {
    background: colors.black,
    text: colors.white,
    accent: colors.gold,
    gray: colors.lightGray,
    darkGray: colors.gray,
    cardBg: "rgba(255, 255, 255, 0.05)",
    shadow: "rgba(255,255,255,0.2)",
    conversationBg: "#3a3a3a",
  },
};
