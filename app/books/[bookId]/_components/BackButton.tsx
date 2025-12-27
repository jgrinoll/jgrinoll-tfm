"use client";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const BackButton: React.FC = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleBack = () => {
    startTransition(() => {
      router.back();
    });
  };

  return (
    <Button
      type="text"
      icon={<ArrowLeftOutlined />}
      onClick={handleBack}
      loading={isPending}
      disabled={isPending}
      style={{
        alignSelf: "flex-start",
        fontWeight: 600,
        color: "#ab77ff",
      }}
    >
      Enrere
    </Button>
  );
};

export default BackButton;
