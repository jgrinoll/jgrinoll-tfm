import { Button, Flex, Form, FormProps, Input, Modal, ModalProps } from "antd";
import React, { useState } from "react";

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

  const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
    console.log("Success:", values);

    setRegisterLoading(true);
    // TODO - POST the register endpoint

    setTimeout(() => {
      setRegisterLoading(false);
      if (onRegister) onRegister();
    }, 2000);
  };

  const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (
    errorInfo
  ) => {
    // Hi ha hagut algun error validant el formulari
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal {...props} footer={null}>
      <Form
        id="register-form"
        name="register-form"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
