"use client";

import { Button } from "antd";
import { useEffect, useState } from "react";
import RegisterModal from "./RegisterModal";
import SessionButton from "./SessionButton";
import { getSessionInfo } from "../_actions/auth_actions";
import { useSetAtom } from "jotai";
import { userDataAtom } from "../_jotai/atoms";
import { getUserData } from "../_actions/user_actions";

/** This component must:
 * - Display the logo at the top left of the page with a link to the start page
 * - Display a search bar
 * - If the user is logged in:
 *      - Display the logout button on the top right
 * - If the user is not logged in
 *      - Display the user image, which navigates to the user profile when clicked.
 */
const Header: React.FC = () => {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const setUserData = useSetAtom(userDataAtom);

  useEffect(() => {
    // Check if the user is logged in
    getSessionInfo().then(async (sessionInfo) => {
      if (!sessionInfo) {
        setUserData(null);
        return;
      }

      setUserData(await getUserData(sessionInfo?.id));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Button onClick={() => setRegisterModalOpen(true)}>
        Open Register Modal
      </Button>
      <RegisterModal
        open={registerModalOpen}
        onRegister={() => setRegisterModalOpen(false)}
        onCancel={() => setRegisterModalOpen(false)}
      />
      <SessionButton />
    </>
  );
};

export default Header;
