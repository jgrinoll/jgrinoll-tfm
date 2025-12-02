"use client";

import { userDataAtom } from "@/app/_lib/jotai/atoms";
import { useSetAtom } from "jotai";
import Link from "next/link";

const LogoutButton = () => {
  const setUserData = useSetAtom(userDataAtom);

  const logout = async () => {
    setUserData(null);

    fetch("/api/auth", {
      method: "DELETE",
    });
  };

  return <Link href="/" onClick={logout}>Tancar Sessió</Link>;
};

export default LogoutButton;
