import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useAtom } from "jotai";
import { useState } from "react";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";
import { userDataAtom } from "@/app/_lib/jotai/atoms";
import Link from "next/link";

const SessionButton = () => {
  const [userData, setUserData] = useAtom(userDataAtom);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const onRegisterSelected = () => {
    setRegisterModalOpen(true);
    setLoginModalOpen(false);
  };

  return userData ? (
    <Link href={"/profile/"}>
      <Avatar
        src={userData.avatar_url}
        icon={<UserOutlined />}
      />
    </Link>
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
