import { getUserData } from "@/app/_actions/user_actions";
import { getSessionInfo } from "@/app/_lib/auth_utils";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Col, Flex, Row, Tabs } from "antd";
import Title from "antd/es/typography/Title";
import Text from "antd/es/typography/Text";
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
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={8} lg={8} xl={6} style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem" }}>
          <Avatar
            src={user?.avatar_url}
            icon={<UserOutlined />}
            style={{ width: "100%", maxWidth: "300px", height: "auto", aspectRatio: "1" }}
          />
        </Col>
        <Col xs={24} sm={24} md={16} lg={16} xl={18}>
          <Flex
            justify="space-between"
            vertical
            style={{ padding: ".5rem", width: "100%", height: "100%" }}
          >
            <div>
              {user?.name && (
                <Title level={1} style={{ marginBottom: 0 }}>
                  {user.name}
                </Title>
              )}
              <Title level={3} style={{ marginTop: user?.name ? "1rem" : 0 }}>
                {user?.username}
              </Title>
              {user?.bio && (
                <Text style={{ display: "block", marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
                  {user.bio}
                </Text>
              )}
            </div>
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
