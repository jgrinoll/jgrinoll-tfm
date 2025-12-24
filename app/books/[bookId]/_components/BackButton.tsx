"use client";
import { Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <Button
      type="text"
      icon={<ArrowLeftOutlined />}
      onClick={() => router.back()}
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
