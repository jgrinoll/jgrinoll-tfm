import { Card, Image, Space } from "antd";
import React from "react";

interface InfoTagProps {
  iconSrc: string;
  label: string;
  value: string | number;
}
const InfoTag: React.FC<InfoTagProps> = ({ label, value, iconSrc }) => {
  return (
    <Card style={{ padding: ".5rem", maxWidth: "25vw" }}>
      <Space vertical style={{ textAlign: "center" }}>
        <Image
          preview={false}
          src={iconSrc}
          style={{ padding: "5px", width: 64 }}
          alt={label + " icon"}
        />
        <b>{label}:</b>
        {value}
      </Space>
    </Card>
  );
};

export default InfoTag;
