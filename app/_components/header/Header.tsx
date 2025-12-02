"use client";

import { SearchOutlined } from "@ant-design/icons";
import { Flex, Form, Input } from "antd";
import { Header as AntdHeader } from "antd/es/layout/layout";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { userDataAtom } from "../../_lib/jotai/atoms";
import UserDTO from "../../_lib/models/UserDTO";
import SessionButton from "./SessionButton";
import Image from "next/image";

/** This component must:
 * - Display the logo at the top left of the page with a link to the start page
 * - Display a search bar
 * - If the user is logged in:
 *      - Display the logout button on the top right
 * - If the user is not logged in
 *      - Display the user image, which navigates to the user profile when clicked.
 */
type HeaderProps = { user: UserDTO | null };
type FieldType = {
  query: string;
};
const Header: React.FC<HeaderProps> = ({ user }) => {
  const router = useRouter();
  const setUserData = useSetAtom(userDataAtom);

  useEffect(() => setUserData(user), [user, setUserData]);

  const onSearch = (formData: FieldType) => {
    if (formData.query) {
      router.push(`/books?q=${encodeURIComponent(formData.query)}`);
    }
  };

  return (
    <AntdHeader
      style={{
        position: "sticky",
        top: 0,
        zIndex: 900,
        width: "100%",
      }}
    >
      <Flex
        justify="space-between"
        align="center"
        gap={5}
        style={{ height: "100%" }}
      >
        <Link href="/">
          <Flex align="center" justify="center">
            <Image
              id="logo"
              src={"/Logo.png"}
              alt="Website logo"
              width={60}
              height={48}
            />
          </Flex>
        </Link>
        <Form
          style={{
            width: "100%",
            height: "100%",
            paddingLeft: 10,
            paddingRight: 10,
            flex: 1,
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
    </AntdHeader>
  );
};

export default Header;
