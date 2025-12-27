"use client";

import UserDTO from "@/app/_lib/models/UserDTO";
import { Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

interface EditProfileButtonProps {
  user: UserDTO;
}
const EditProfileButton: React.FC<EditProfileButtonProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setOpen(false);
    setIsRefreshing(true);
    router.refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <>
      {isRefreshing ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          <Spin size="small" /> Actualitzant...
        </span>
      ) : (
        <Link href="#" onClick={() => setOpen(true)}>
          Editar perfil
        </Link>
      )}
      <EditProfileModal
        open={open}
        user={user}
        onSave={handleSave}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export default EditProfileButton;
