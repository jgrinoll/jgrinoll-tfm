"use client";
import { ConfigProvider, theme } from "antd";
import { useMediaQuery } from "react-responsive";
import { appTheme } from "../appTheme";

export default function AppConfigProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  return (
    <ConfigProvider
      theme={{
        ...appTheme,
        algorithm: isMobile ? theme.compactAlgorithm : undefined,
      }}
    >
      {children}
    </ConfigProvider>
  );
}
