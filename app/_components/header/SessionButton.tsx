import { userDataAtom } from "@/app/_lib/jotai/atoms";
import { LoginOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { useState } from "react";
import LoginModal from "../auth/LoginModal";
import RegisterModal from "../auth/RegisterModal";

const SessionButton = () => {
  const userData = useAtomValue(userDataAtom);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const onRegisterSelected = () => {
    setRegisterModalOpen(true);
    setLoginModalOpen(false);
  };

  return userData ? (
    <Link href={"/profile/"}>
      <Avatar src={userData.avatar_url} icon={<UserOutlined />} />
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
        onLoginSelected={() => {
          setLoginModalOpen(true);
          setRegisterModalOpen(false);
        }}
      />
    </>
  );
};

export default SessionButton;
