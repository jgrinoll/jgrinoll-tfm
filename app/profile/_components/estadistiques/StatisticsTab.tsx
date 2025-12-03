import UserDTO from "@/app/_lib/models/UserDTO";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";

interface StatisticsTabProps {
  user: UserDTO;
}
const StatisticsTab: React.FC<StatisticsTabProps> = ({ user }) => {
  return (
    <>
      <Title level={1}>Not implemented</Title>
      <Paragraph>Statistics tab for user {user.username}</Paragraph>
    </>
  );
};

export default StatisticsTab;
