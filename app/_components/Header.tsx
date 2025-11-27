"use client";

import { Button } from "antd";
import { useState } from "react";
import RegisterModal from "./RegisterModal";

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
    </>
  );
};

export default Header;
