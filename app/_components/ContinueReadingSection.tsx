"use client";
import { useAtomValue } from "jotai";
import { userDataAtom } from "../_jotai/atoms";

export default function ContinueReadingSection() {
  const user = useAtomValue(userDataAtom);

  if (!user) return null;

  return (
    <section>
      <p>Welcome back, {user.username}!</p>
    </section>
  );
}
