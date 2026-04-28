

import { theme as antdTheme, type ThemeConfig } from "antd";

export const theme: ThemeConfig = {
  
  algorithm: [antdTheme.defaultAlgorithm],
  token: {
    fontFamily: '"Inter Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    borderRadius: 14,
    borderRadiusLG: 20,
    borderRadiusSM: 10,
    colorPrimary: "#c9a46f",
    colorInfo: "#8cb2d8",
    colorSuccess: "#63b59a",
    colorWarning: "#d8a164",
    colorError: "#d56a71",
    colorBgBase: "#0d1117",
    colorBgLayout: "#0d1117",
    colorBgContainer: "rgba(18, 24, 32, 0.86)",
    colorBgElevated: "rgba(25, 32, 42, 0.96)",
    colorTextBase: "rgba(236, 241, 247, 0.96)",
    colorText: "rgba(236, 241, 247, 0.96)",
    colorTextSecondary: "rgba(184, 197, 215, 0.82)",
    colorTextTertiary: "rgba(146, 160, 178, 0.68)",
    colorBorder: "rgba(136, 151, 173, 0.28)",
    colorBorderSecondary: "rgba(136, 151, 173, 0.18)",
    boxShadow: "0 20px 52px rgba(0, 0, 0, 0.38)",
    boxShadowSecondary: "0 12px 30px rgba(0, 0, 0, 0.34)",
    controlHeight: 42,
    controlHeightLG: 50,
    lineWidth: 1,
  },
  components: {
    
    Layout: {
      bodyBg: "transparent",
      headerBg: "transparent",
      footerBg: "transparent",
    },
    Card: {
      colorBgContainer: "rgba(25, 32, 42, 0.92)",
      boxShadowTertiary: "0 16px 40px rgba(0, 0, 0, 0.32)",
    },
    Button: {
      fontWeight: 600,
      primaryShadow: "0 10px 28px rgba(201, 164, 111, 0.34)",
    },
    Input: {
      colorBgContainer: "rgba(31, 39, 51, 0.92)",
    },
  },
};
