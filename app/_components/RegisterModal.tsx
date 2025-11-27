import {
  Button,
  Divider,
  Flex,
  Form,
  FormProps,
  Input,
  message,
  Modal,
  ModalProps,
} from "antd";
import React, { useState } from "react";
import { registerUser } from "../_actions/actions";
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

    const { rowsAffected, errorMsg } = await registerUser(userData);
    if (rowsAffected > 0) {
      messageApi.success("T'has registrat correctament!");
      if (onRegister) onRegister();
    } else {
      messageApi.error(errorMsg);
    }

    setRegisterLoading(false);
  };

  return (
    <Modal
      {...props}
      footer={
        <Flex justify="center">
          <Button
            type="primary"
            htmlType="submit"
            form="register-form"
            loading={registerLoading}
          >
            Registrar-me
          </Button>
        </Flex>
      }
      title="Registrar-me"
    >
      {messageContext}
      <Divider style={{ border: "1px solid #2A2A2A" }} />
      <Form
        id="register-form"
        name="register-form"
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 17 }}
        onFinish={onFinish}
      >
        <Form.Item<FieldType>
          label="Correu electrònic"
          name="email"
          rules={[
            { required: true, message: "El correu electrònic és necessari!" },
            { type: "email", message: "El correu electrònic no és vàlid!" },
            {
              max: 100,
              message: "El correu electrònic no pot superar els 100 caràcters!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Nom d'usuari"
          name="username"
          rules={[
            { required: true, message: "El nom d'usuari és obligatori!" },
            {
              max: 50,
              message: "El nom d'usuari no pot superar els 50 caràcters!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Contrasenya"
          name="password"
          rules={[
            { required: true, message: "La contrasenya és obligatòria!" },
            {
              min: 8,
              message: "La contrasenya ha de tenir un mínim de 8 caràcters!",
            },
            {
              max: 30,
              message: "La contrasenya no pot superar els 30 caràcters!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item<FieldType>
          label="Confirma la contrasenya"
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: "És obligatori confirmar la contrasenya!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Les contrasenyes no coincideixen!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RegisterModal;
