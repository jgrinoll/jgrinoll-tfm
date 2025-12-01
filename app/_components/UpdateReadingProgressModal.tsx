"use client";
import type { Callbacks } from "@rc-component/form/lib/interface";
import { Button, Flex, Form, InputNumber, Modal, ModalProps } from "antd";
import React, { useState } from "react";

interface UpdateReadingProgressModalProps extends ModalProps {
  bookId: string;
}

type FieldType = {
  pageNumber: number;
  percentage: number;
};

const UpdateReadingProgressModal: React.FC<UpdateReadingProgressModalProps> = ({
  bookId,
  ...props
}) => {
  const [loading, setLoading] = useState(false);

  const onFinish: Callbacks<FieldType>["onFinish"] = async (values) => {
    setLoading(true);
    console.log("Form finished. Values are: ", values);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const onBookFinish = () => {
    setLoading(true);
    console.log("User finished the book!");
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
            label="Pàgina actual"
            name="pageNumber"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value && !getFieldValue("percentage")) {
                    return Promise.reject(
                      new Error(
                        "Has d'especificar el nombre de pàgines o el percentatge!"
                      )
                    );
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <InputNumber />
          </Form.Item>
          <Form.Item<FieldType>
            label="Percentatge de progrés"
            name="percentage"
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value && !getFieldValue("pageNumber")) {
                    return Promise.reject(
                      new Error(
                        "Has d'especificar el nombre de pàgines o el percentatge!"
                      )
                    );
                  } else {
                    return Promise.resolve();
                  }
                },
              }),
            ]}
          >
            <InputNumber />
          </Form.Item>
          <p style={{ textAlign: "right" }}>
            <a href="#" onClick={onBookFinish}>
              Has acabat el llibre?
            </a>
          </p>
          <Flex justify="end" gap={10}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Guardar progrés
            </Button>
          </Flex>
        </Form>
      </Modal>
    </>
  );
};
