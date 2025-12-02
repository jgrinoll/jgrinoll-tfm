import UserDTO from "@/app/_lib/models/UserDTO";
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

type FieldType = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

type EditProfileModalProps = ModalProps & {
  onSave?: () => void;
  user: UserDTO;
};

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  onSave,
  user,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const onFinish: FormProps<FieldType>["onFinish"] = async (formValues) => {
    console.log("Success:", formValues);

    setLoading(true);

    const userData: UserDTO = {
      email: formValues.email,
      username: formValues.username,
    } as UserDTO;

    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await res
      .json()
      .catch(() => ({ ok: false, error: "Responsta invàlida del servidor" }));

    if (!res.ok) {
      // Show error message to the user
      message.error(data?.error || "Hi ha hagut un error editant el perfil");
      setLoading(false);
      return;
    }

    message.success(`S'ha editat el perfil correctament!`);
    setLoading(false);
    if (onSave) onSave();
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
            loading={loading}
          >
            Registrar-me
          </Button>
        </Flex>
      }
      title="Registrar-me"
    >
      <Divider style={{ border: "1px solid #2A2A2A" }} />
      {/* //TODO - Implementar la modificació de les dades del perfil de l'usuari. */}
      <h1>FORMULARI PROVISIONAL, NO ES POT EDITAR EL PERFIL</h1>
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

export default EditProfileModal;
