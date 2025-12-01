import { atom } from "jotai";
import UserDTO from "../models/UserDTO";

export const userDataAtom = atom<UserDTO | null>(null);

export const updateReadingProgressModalOpen = atom<boolean>(false);
export const updateReadingProgressModalBookId = atom<string | undefined>();
