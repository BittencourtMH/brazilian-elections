import { Election } from "model/tse/ea11";
import { MunicipalitySettings } from "model/tse/ea12";

export const getMunicipalitySettings = (
  election: Election["cd"]
): MunicipalitySettings => {
  const code = election.padStart(6, "0");

  return require(`mock/ele2022/${election}/config/mun-e${code}-cm.json`);
};
