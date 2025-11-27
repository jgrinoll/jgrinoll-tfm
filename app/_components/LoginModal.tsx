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
import React, { useState } from "react";
import { getSessionInfo, login } from "../_actions/auth_actions";
import LoginUserDTO from "../_models/LoginUserDTO";
import { useSetAtom } from "jotai";
import { userDataAtom } from "../_jotai/atoms";
import { getUserData } from "../_actions/user_actions";

type FieldType = {
  email: string;
  password: string;
};

type LoginModalProps = ModalProps & { onLogin?: () => void };

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, ...props }) => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [messageApi, messageContext] = message.useMessage();
  const setUserData = useSetAtom(userDataAtom);

  const onFinish: FormProps<FieldType>["onFinish"] = async (formValues) => {
    console.log("Attempting login:", formValues);

    setLoginLoading(true);

    const userData: LoginUserDTO = {
      email: formValues.email,
      plainPassword: formValues.password,
    };

    const loginResult = await login(userData);
    console.log("Login result: ", loginResult);

    if (loginResult) {
      const userData = await getUserData(loginResult.id)
      console.log("I got userdata: ", userData);
      
      setUserData(userData);
      messageApi.success(`Welcome, ${loginResult.username}!`);
      if (onLogin) onLogin();
    } else {
      messageApi.error("Login failed! Please check your credentials.");
    }

    setLoginLoading(false);
  };

  return (
    <Modal {...props} footer={null}>
      {messageContext}
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
            { max: 100, message: "The email must not exceed 100 characters!" },
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
        <Flex justify="end" gap={10}>
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loginLoading}>
            Login
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default LoginModal;
