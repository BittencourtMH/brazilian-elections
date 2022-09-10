import { Election, OfficeOrQuestion } from "model/tse/ea11";
import { Municipality, Uf } from "model/tse/ea12";

export type Query = {
  id: number;
  election: Election;
  uf: Uf | null;
  municipality: Municipality | null;
  zone: string | null;
  officeOrQuestion: OfficeOrQuestion;
  duration: number;
};
