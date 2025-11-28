import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, Flex, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import type { Metadata } from "next";
import { getUserData } from "./_actions/user_actions";
import AppConfigProvider from "./_components/AppConfigProvider";
import Footer from "./_components/Footer";
import Header from "./_components/header/Header";
import "./globals.css";
import { getCurrentUser, getSessionInfo } from "./lib/auth_utils";

export const metadata: Metadata = {
  title: "Book Tracking App",
  description: "A Joaquim Griñó Project",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%" }}>
        {/* Provided by AntD to extract and inject antd first creen styles into HTML to avoid page flicker */}
        <AppConfigProvider>
          <AntdRegistry>
            <App>
              <Layout>
                <Flex vertical style={{ height: "100%" }}>
                  <Header user={user} />
                  <Content style={{ flex: 1, padding: 5 }}>{children}</Content>
                  <Footer />
                </Flex>
              </Layout>
            </App>
          </AntdRegistry>
        </AppConfigProvider>
      </body>
    </html>
  );
}
