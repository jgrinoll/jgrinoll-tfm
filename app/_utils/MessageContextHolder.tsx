"use client";

import { message } from "antd";

const MessageContextHolder = () => {
  const [, contextHolder] = message.useMessage();
  return <>{contextHolder}</>;
};

export default MessageContextHolder;
