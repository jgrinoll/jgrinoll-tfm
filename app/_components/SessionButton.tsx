import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useAtom } from "jotai";
import { useState } from "react";
import { userDataAtom } from "../_jotai/atoms";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const SessionButton = () => {
  const [userData, setUserData] = useAtom(userDataAtom);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const onRegisterSelected = () => {
    setRegisterModalOpen(true);
    setLoginModalOpen(false);
  };

  const logout = async () => {
    setUserData(null);

    await fetch("/api/auth", {
      method: "DELETE",
    });
  };

  return userData ? (
    <Avatar
      src={userData.avatar_url}
      icon={<UserOutlined />}
      onClick={logout}
    />
  ) : (
    <>
      <LoginModal
        open={loginModalOpen}
        onLogin={() => setLoginModalOpen(false)}
        onCancel={() => setLoginModalOpen(false)}
        onRegisterSelected={onRegisterSelected}
      />
      <LoginOutlined
        className="icon-btn"
        style={{ marginLeft: "auto", fontSize: "1.5rem" }}
        type="primary"
        onClick={() => setLoginModalOpen(true)}
      />
      <RegisterModal
        open={registerModalOpen}
        onRegister={() => setRegisterModalOpen(false)}
        onCancel={() => setRegisterModalOpen(false)}
      />
    </>
  );
};

export default SessionButton;
