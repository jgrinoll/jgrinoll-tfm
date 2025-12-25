import { getUserData } from "@/app/_actions/user_actions";
import { getSessionInfo } from "@/app/_lib/auth_utils";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Flex, Row, Space, Tabs } from "antd";
import Title from "antd/es/typography/Title";
import { redirect } from "next/navigation";
import "server-only";
import LogoutButton from "./_components/LogoutButton";
import EditProfileButton from "./_components/EditProfileButton";
import { CompatibilityProps } from "antd/es/tabs";
import type { Tab } from "@rc-component/tabs/lib/interface";
import StatisticsTab from "./_components/estadistiques/StatisticsTab";
import ListsTab from "./_components/llistes/ListsTab";
import ChallengesTab from "./_components/reptes/ChallengesTab";

export default async function Page({
  params,
}: {
  params: Promise<{ userId?: number }>;
}) {
  let { userId } = await params;
  if (!userId) {
    const sessionInfo = await getSessionInfo();
    if (!sessionInfo) redirect("/");

    userId = sessionInfo.id;
  }
  const user = await getUserData(userId);
  if (!user) redirect("/");

  const tabs: (Tab & CompatibilityProps)[] = [
    {
      label: "Estadístiques",
      key: "Estadístiques",
      children: <StatisticsTab user={user} />,
    },
    {
      label: "Llistes",
      key: "Llistes",
      children: <ListsTab user={user} />,
    },
    {
      label: "Reptes",
      key: "Reptes",
      children: <ChallengesTab user={user} />,
    },
  ];

  return (
    <>
      <Row>
        <Col span={8} style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
          <Avatar
            src={user?.avatar_url}
            icon={<UserOutlined />}
            style={{ width: "100%", maxWidth: "300px", height: "auto", aspectRatio: "1" }}
          />
        </Col>
        <Col span={16}>
          <Flex
            justify="space-between"
            vertical
            style={{ padding: ".5rem", width: "100%", height: "100%" }}
          >
            <Title level={1}>{user?.username}</Title>
            <Flex justify="space-evenly" style={{ width: "100%" }}>
              <EditProfileButton user={user!} />
              <LogoutButton />
            </Flex>
          </Flex>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1" centered items={tabs} />
    </>
  );
}
