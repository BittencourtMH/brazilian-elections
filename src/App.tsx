import { MainScreen } from "components";
import file from "mock/comum/config/ele-c.json";
import { ElectionSettings } from "model/tse";

const data: ElectionSettings = file as any;

const App = () => <MainScreen data={data} />;

export default App;
