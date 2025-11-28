"use client";
import {
  Button,
  Flex,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  ModalProps,
} from "antd";
import { useSetAtom } from "jotai";
import React, { useState } from "react";
import { getUserData } from "../../_actions/user_actions";
import { userDataAtom } from "../../_jotai/atoms";

type FieldType = {
  email: string;
  password: string;
};

type LoginModalProps = ModalProps & {
  onLogin?: () => void;
  onRegisterSelected?: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({
  onLogin,
  onRegisterSelected,
  ...props
}) => {
  const [loginLoading, setLoginLoading] = useState(false);
  const setUserData = useSetAtom(userDataAtom);

  const onFinish: FormProps<FieldType>["onFinish"] = async (formValues) => {
    setLoginLoading(true);
    const userData = {
      email: formValues.email,
      plainPassword: formValues.password,
    };

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      message.error("Login failed. Check credentials.");
      setLoginLoading(false);
      return;
    }

    const user = await res.json();
    setUserData(user);

    message.success(`Benvingut, ${user.username}!`);
    if (onLogin) onLogin();
    setLoginLoading(false);
  };

  return (
    <>
      <Modal {...props} footer={null}>
        <Form
          name="login-form"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 17 }}
          onFinish={onFinish}
        >
          <Form.Item<FieldType>
            label="Email"
            name="email"
            rules={[
              { required: true, message: "A valid email is required!" },
              { type: "email", message: "The email address is not valid!" },
              {
                max: 100,
                message: "The email must not exceed 100 characters!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a password!" },
              {
                min: 8,
                message: "The password must have at least 8 characters!",
              },
              {
                max: 30,
                message: "The password must not exceed 30 characters!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <p style={{ textAlign: "right" }}>
            No tens un compte?
            <a
              href="#"
              onClick={() => {
                if (onRegisterSelected) onRegisterSelected();
              }}
            >
              {" "}
              Registra't!
            </a>
          </p>
          <Flex justify="end" gap={10}>
            <Button type="primary" htmlType="submit" loading={loginLoading}>
              Login
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};

export default LoginModal;
