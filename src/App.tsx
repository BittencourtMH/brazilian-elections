import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";

import { MainScreen } from "components";
import { getElectionSettings } from "services";

const App = () => <MainScreen electionSettings={getElectionSettings()} />;

export default App;
