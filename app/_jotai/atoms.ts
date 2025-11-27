import { atom } from "jotai";
import UserDTO from "../_models/UserDTO";

export const userDataAtom = atom<UserDTO | null>(null);
