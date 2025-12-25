"use client";

import UserDTO from "@/app/_lib/models/UserDTO";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

interface EditProfileButtonProps {
  user: UserDTO;
}
const EditProfileButton: React.FC<EditProfileButtonProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    setOpen(false);
    router.refresh();
  };

  return (
    <>
      <Link href="#" onClick={() => setOpen(true)}>
        Editar perfil
      </Link>
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
