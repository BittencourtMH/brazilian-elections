import { Municipality } from "./Municipality";
import { OfficeOrQuestion } from "./OfficeOrQuestion";

export type Location = {
  cd: string;
  mu?: Municipality[];
  cp: OfficeOrQuestion[];
};
