import { ElectionDay } from "./ElectionDay";

export type ElectionSettings = {
  dg: string;
  hg: string;
  f: "S" | "O";
  c: string;
  pl: ElectionDay[];
};
