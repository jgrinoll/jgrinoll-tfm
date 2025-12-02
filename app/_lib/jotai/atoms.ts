import { atom } from "jotai";
import UserDTO from "../models/UserDTO";

export const userDataAtom = atom<UserDTO | null>(null);

// Reading progress modal atoms
export const updateReadingProgressModalOpen = atom<boolean>(false);
export const updateReadingProgressModalBookId = atom<string | undefined>();

// Book review modal atoms
export const bookReviewModalOpen = atom<boolean>(false);
export const bookReviewModalBookId = atom<string | undefined>();
