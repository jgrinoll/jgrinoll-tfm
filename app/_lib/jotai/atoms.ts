import { atom } from "jotai";
import UserDTO from "../models/UserDTO";

export const userDataAtom = atom<UserDTO | null>(null);
