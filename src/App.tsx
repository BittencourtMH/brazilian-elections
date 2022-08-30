import { MainScreen } from "components";
import file from "mock/comum/config/ele-c.json";
import { Election, ElectionSettings } from "model/tse/ea11";
import { MunicipalitySettings } from "model/tse/ea12";

const getMunicipalities = (election: Election["cd"]): MunicipalitySettings => {
  const code = election.padStart(6, "0");

  return require(`./mock/ele2022/${election}/config/mun-e${code}-cm.json`);
};

const data: ElectionSettings = file as any;

const App = () => (
  <MainScreen electionSettings={data} getMunicipalities={getMunicipalities} />
);

export default App;
