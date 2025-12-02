"use client";

import UserDTO from "@/app/_lib/models/UserDTO";
import Link from "next/link";
import { useState } from "react";
import EditProfileModal from "./EditProfileModal";

interface EditProfileButtonProps {
  user: UserDTO;
}
const EditProfileButton: React.FC<EditProfileButtonProps> = ({ user }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Link href="#" onClick={() => setOpen(true)}>
        Editar perfil
      </Link>
      <EditProfileModal
        open={open}
        user={user}
        onSave={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      />
    </>
  );
};

export default EditProfileButton;
