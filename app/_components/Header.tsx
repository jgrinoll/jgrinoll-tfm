"use client";

import { Button, Flex, Form, Input } from "antd";
import { useEffect, useState } from "react";
import RegisterModal from "./RegisterModal";
import SessionButton from "./SessionButton";
import { getSessionInfo } from "../_actions/auth_actions";
import { useSetAtom } from "jotai";
import { userDataAtom } from "../_jotai/atoms";
import { getUserData } from "../_actions/user_actions";
import { Header as AntdHeader } from "antd/es/layout/layout";
import Icon, { LoginOutlined, SearchOutlined } from "@ant-design/icons";

/** This component must:
 * - Display the logo at the top left of the page with a link to the start page
 * - Display a search bar
 * - If the user is logged in:
 *      - Display the logout button on the top right
 * - If the user is not logged in
 *      - Display the user image, which navigates to the user profile when clicked.
 */
type FieldType = {
  query: string;
};
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

  const onSearch = (formData: FieldType) => {
    console.log("Searching string: ", formData.query);

    // TODO - Redirect to search page and show results.
  };

  return (
    <AntdHeader>
      <Flex
        justify="space-between"
        align="center"
        gap={5}
        style={{ height: "100%" }}
      >
        <img id="logo" src={"/Logo.png"} />
        <Form
          style={{
            width: "100%",
            height: "100%",
            paddingLeft: 10,
            paddingRight: 10,
          }}
          onFinish={onSearch}
        >
          <Flex
            justify="center"
            align="center"
            style={{ width: "100%", height: "100%" }}
          >
            <Form.Item<FieldType>
              name="query"
              style={{ margin: 0, width: "100%" }}
            >
              <Input
                placeholder="Buscar llibre, autor, ISBN..."
                prefix={
                  <SearchOutlined
                    style={{ marginRight: 5, marginLeft: 5, fontSize: 16 }}
                  />
                }
              />
            </Form.Item>
          </Flex>
        </Form>
        <SessionButton />
      </Flex>
      <RegisterModal
        open={registerModalOpen}
        onRegister={() => setRegisterModalOpen(false)}
        onCancel={() => setRegisterModalOpen(false)}
      />
    </AntdHeader>
  );
};

export default Header;
