import { ThemeConfig } from "antd";
export const appTheme: ThemeConfig = {
  token: {
    fontFamily: "Poppins, sans-serif",
    colorPrimary: "#ab77ff",
    colorBgBase: "#fbf7ef",
    colorTextBase: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    paddingLG: 16,
    paddingXL: 20,
    controlHeight: 44,
    fontSize: 16,
  },
  components: {
    Button: {
      borderRadius: 12,
      paddingInline: 20,
      controlHeight: 44,
      fontWeight: 800,
    },
    Input: {
      colorPrimary: "#eb2f96",
      algorithm: true, // Enable algorithm
      borderRadius: 12,
      controlHeight: 44,
      colorBgBase: "#ffffff",
    },
    InputNumber: {
      colorPrimary: "#eb2f96",
      algorithm: true, // Enable algorithm
      borderRadius: 12,
      controlHeight: 44,
      controlWidth: 250,
      colorBgBase: "#ffffff",
    },
    Card: {
      borderRadius: 16,
      bodyPadding: 5,
      colorBgContainer: "#fbf7ef",
      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
      colorBorder: "#ab77ff",
    },
    Select: {
      colorPrimary: "#eb2f96",
      algorithm: true,
      borderRadius: 12,
      controlHeight: 44,
      colorBgBase: "#ffffff",
      colorBgContainer: "#ffffff",
    },
    Modal: {
      colorBgElevated: "#fcf1f4",
      colorBorder: "#ab77ff",
      borderRadiusLG: 16,
      paddingLG: 24,
    },
    Form: {
      labelHeight: 16,
      fontWeightStrong: 800,
    },
    Layout: {
      headerBg: "#fbf7ef",
      headerPadding: 10,
      bodyBg: "#fcf1f4",
      footerBg: "#fbf7ef",
      footerPadding: 0,
    },
    Typography: {
      fontSizeHeading1: 38,
      fontSizeHeading2: 30,
      fontSizeHeading3: 24,
      fontSizeHeading4: 20,
      fontSizeHeading5: 16,
      titleMarginBottom: 0,
    },
    Progress: {
      defaultColor: "#e66d57",
      remainingColor: "#f2b5aa99",
      colorBgContainer: "#fff",
    },
  },
};
