"use client";
import UserDTO from "@/app/_lib/models/UserDTO";
import { Tabs } from "antd";
import SeasonalChallengesTab from "./SeasonalChallengesTab";
import AchievementsTab from "./AchievementsTab";

interface ChallengesTabProps {
  user: UserDTO;
}

const ChallengesTab: React.FC<ChallengesTabProps> = ({ user }) => {
  const items = [
    {
      key: "seasonal",
      label: "Reptes Temporals",
      children: <SeasonalChallengesTab user={user} />,
    },
    {
      key: "achievements",
      label: "Assoliments",
      children: <AchievementsTab user={user} />,
    },
  ];

  return <Tabs defaultActiveKey="seasonal" items={items} />;
};

export default ChallengesTab;
