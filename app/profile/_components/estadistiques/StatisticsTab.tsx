import UserDTO from "@/app/_lib/models/UserDTO";
import Paragraph from "antd/es/typography/Paragraph";

interface StatisticsTabProps {
  user: UserDTO;
}
const StatisticsTab: React.FC<StatisticsTabProps> = ({ user }) => {
  return <Paragraph>Statistics tab for user {user.username}</Paragraph>;
};

export default StatisticsTab;
