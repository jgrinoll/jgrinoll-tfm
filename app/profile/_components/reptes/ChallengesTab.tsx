import UserDTO from "@/app/_lib/models/UserDTO";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";

interface ChallengesTabProps {
  user: UserDTO;
}
const ChallengesTab: React.FC<ChallengesTabProps> = ({ user }) => {
  return (
    <>
      <Title level={1}>Not implemented</Title>
      <Paragraph>Challenges tab for user {user.username}</Paragraph>
    </>
  );
};

export default ChallengesTab;
