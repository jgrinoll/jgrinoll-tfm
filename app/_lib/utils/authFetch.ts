"use client";
import { getDefaultStore } from "jotai";
import { userDataAtom } from "../jotai/atoms";

export async function authFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    const store = getDefaultStore();
    store.set(userDataAtom, null);
    window.location.href = "/";
    throw new Error("Session expired");
  }

  return response;
}
