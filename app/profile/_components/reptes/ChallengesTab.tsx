import UserDTO from "@/app/_lib/models/UserDTO";
import Paragraph from "antd/es/typography/Paragraph";

interface ChallengesTabProps {
  user: UserDTO;
}
const ChallengesTab: React.FC<ChallengesTabProps> = ({ user }) => {
  return <Paragraph>Challenges tab for user {user.username}</Paragraph>;
};

export default ChallengesTab;
