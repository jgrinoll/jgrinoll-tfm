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
import { authFetch } from "@/app/_lib/utils/authFetch";

type FieldType = {
  username: string;
  name: string;
  bio: string;
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

    const userData: Partial<UserDTO> = {
      username: formValues.username,
      name: formValues.name || null,
      bio: formValues.bio || null,
    };

    const res = await authFetch("/api/user", {
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
            form="edit-profile-form"
            loading={loading}
          >
            Guardar canvis
          </Button>
        </Flex>
      }
      title="Editar perfil"
    >
      <Divider style={{ border: "1px solid #2A2A2A" }} />
      <Form
        id="edit-profile-form"
        name="edit-profile-form"
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          username: user.username,
          name: user.name || '',
          bio: user.bio || ''
        }}
      >
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
          label="Nom complet"
          name="name"
          rules={[
            {
              max: 128,
              message: "El nom no pot superar els 128 caràcters!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          label="Biografia"
          name="bio"
          rules={[
            {
              max: 512,
              message: "La biografia no pot superar els 512 caràcters!",
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
