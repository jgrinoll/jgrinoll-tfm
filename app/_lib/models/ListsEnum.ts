// TODO - Redo all the logic with lists typing, I don't really like how it's done.
type List = "VULL_LLEGIR" | "LLEGINT" | "LLEGIT";
export default List;

export const ListsEnum: { [key in List]: string } = {
  VULL_LLEGIR: "Vull llegir",
  LLEGINT: "Llegint",
  LLEGIT: "Llegit",
} as const;
