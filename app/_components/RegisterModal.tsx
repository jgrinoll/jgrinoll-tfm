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
import { register } from "../_actions/auth_actions";
import RegisterUserDTO from "../_models/RegisterUserDTO";

type FieldType = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type RegisterModalProps = ModalProps & { onRegister?: () => void };

const RegisterModal: React.FC<RegisterModalProps> = ({
  onRegister,
  ...props
}) => {
  const [registerLoading, setRegisterLoading] = useState(false);
  const [messageApi, messageContext] = message.useMessage();

  const onFinish: FormProps<FieldType>["onFinish"] = async (formValues) => {
    console.log("Success:", formValues);

    setRegisterLoading(true);

    const userData: RegisterUserDTO = {
      email: formValues.email,
      username: formValues.username,
      plainPassword: formValues.password,
    };

    const { rowsAffected, errorMsg } = await register(userData);
    if (rowsAffected > 0) {
      messageApi.success("User registered successfully!");
      if (onRegister) onRegister();
    } else {
      messageApi.error(errorMsg);
    }

    setRegisterLoading(false);
  };

  return (
    <Modal {...props} footer={null}>
      {messageContext}
      <Form
        name="register-form"
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
          label="Username"
          name="username"
          rules={[
            { required: true, message: "Please enter a username!" },
            { max: 50, message: "The username must not exceed 50 characters!" },
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
        <Form.Item<FieldType>
          label="Confirm Password"
          name="confirmPassword"
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Flex justify="end" gap={10}>
          {/* <Button onClick={() => message.success("Test succeeded")}>Show message</Button> */}
          <Button onClick={props.onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={registerLoading}>
            Register
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

export default RegisterModal;
