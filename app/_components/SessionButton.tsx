import Icon, { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button } from "antd";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { userDataAtom } from "../_jotai/atoms";
import LoginModal from "./LoginModal";

const SessionButton = () => {
  const userData = useAtomValue(userDataAtom);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return userData ? (
    <Avatar size={64} src={userData.avatar_url} icon={<UserOutlined />} />
  ) : (
    <>
      <LoginModal
        open={loginModalOpen}
        onLogin={() => setLoginModalOpen(false)}
        onCancel={() => setLoginModalOpen(false)}
      />
      <LoginOutlined
        className="icon-btn"
        style={{ marginLeft: "auto", fontSize: "1.5rem" }}
        type="primary"
        onClick={() => setLoginModalOpen(true)}
      />
    </>
  );
};

export default SessionButton;
