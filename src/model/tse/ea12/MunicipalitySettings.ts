import { Location } from "./Location";

export type MunicipalitySettings = {
  dg: string;
  hg: string;
  f: "S" | "O";
  abr: Location[];
};
