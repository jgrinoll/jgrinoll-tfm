"use client";
import { useAtomValue } from "jotai";
import { userDataAtom } from "../_lib/jotai/atoms";
import { Button, Flex } from "antd";
import RegisterModal from "./auth/RegisterModal";
import { useState } from "react";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";

export default function SuggestRegistrationSection() {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const user = useAtomValue(userDataAtom);

  if (user) return null;

  return (
    <section>
      <Title level={1}>Registra't per fer el teu seguiment</Title>
      <Paragraph>
        Descobreix una manera senzilla i organitzada de gestionar els teus
        llibres. Registra't ara i transforma la teva experiència lectora en un
        viatge completament teu.
        <br />
        <br />
        <Flex
          justify="space-between"
          align="center"
          style={{ paddingRight: 5, paddingLeft: 5 }}
        >
          <small>
            <b>És ràpid, gratuït i pensat per a tu!</b>
          </small>
          <Button type="primary" onClick={() => setRegisterModalOpen(true)}>
            Registrar-me
          </Button>
        </Flex>
      </Paragraph>
      <RegisterModal
        open={registerModalOpen}
        onRegister={() => setRegisterModalOpen(false)}
        onCancel={() => setRegisterModalOpen(false)}
      />
    </section>
  );
}
