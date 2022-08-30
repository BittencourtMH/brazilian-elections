import { Location } from "./Location";

export type Election = {
  cd: string;
  cdt2: string;
  nm: string;
  t: "1" | "2";
  tp: string;
  abr: Location[];
};
