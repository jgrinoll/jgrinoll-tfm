import { Category } from "../models/Category";

export const CATEGORIES: Omit<Category, "thumbnail">[] = [
  { label: "Fantasia", value: "Fantasy" },
  { label: "Ficció per a Joves Adults", value: "Young Adult Fiction" },
  { label: "Ficció", value: "Fiction" },
  { label: "Ficció Juvenil", value: "Juvenile Fiction" },
  { label: "Còmics i Novel·les Gràfiques", value: "Comics & Graphic Novels" },
  { label: "Viatges", value: "Travel" },
  { label: "Ciència", value: "Science" },
  { label: "Negocis i Economia", value: "Business & Economics" },
];
