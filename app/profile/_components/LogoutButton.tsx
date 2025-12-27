"use client";

import { userDataAtom } from "@/app/_lib/jotai/atoms";
import { Spin } from "antd";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { useState } from "react";

const LogoutButton = () => {
  const setUserData = useSetAtom(userDataAtom);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const logout = async () => {
    setIsLoggingOut(true);
    setUserData(null);

    await fetch("/api/auth", {
      method: "DELETE",
    });

    setIsLoggingOut(false);
  };

  if (isLoggingOut) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
        <Spin size="small" /> Tancant sessió...
      </span>
    );
  }

  return (
    <Link href="/" onClick={logout}>
      Tancar Sessió
    </Link>
  );
};

export default LogoutButton;
