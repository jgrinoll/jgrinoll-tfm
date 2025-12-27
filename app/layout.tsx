import { AntdRegistry } from "@ant-design/nextjs-registry";
import { App, Flex, Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import type { Metadata } from "next";
import AppConfigProvider from "./_components/AppConfigProvider";
import Footer from "./_components/Footer";
import Header from "./_components/header/Header";
import "./globals.css";
import { getCurrentUser } from "./_lib/auth_utils";
import UpdateReadingProgressModal from "./_components/UpdateReadingProgressModal";
import BookReviewModal from "./_components/BookReviewModal";

export const metadata: Metadata = {
  title: "Book Tracking App",
  description: "A Joaquim Griñó Project",
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/favicon.ico", sizes: "any" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  console.log("Layout rendering...");
  

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
                  <UpdateReadingProgressModal />
                  <BookReviewModal />
                  <Content className="main-content">
                    <div className="container-max-width">{children}</div>
                  </Content>
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
