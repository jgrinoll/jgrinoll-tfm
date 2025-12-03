import UserDTO from "@/app/_lib/models/UserDTO";
import Title from "antd/es/typography/Title";
import LevelProgressBar from "./LevelProgressBar";

interface StatisticsTabProps {
  user: UserDTO;
}
const StatisticsTab: React.FC<StatisticsTabProps> = ({ user }) => {
  const totalPages = user.total_pages_read ?? 0;
  const currentLevel = user.level ?? 1;

  return (
    <>
      <Title level={2}>Estadístiques</Title>
      <LevelProgressBar totalPages={totalPages} currentLevel={currentLevel} />
    </>
  );
};

export default StatisticsTab;
