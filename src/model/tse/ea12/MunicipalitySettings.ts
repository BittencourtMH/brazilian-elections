import { Uf } from "./Uf";

export type MunicipalitySettings = {
  dg: string;
  hg: string;
  f: "S" | "O";
  abr: Uf[];
};
