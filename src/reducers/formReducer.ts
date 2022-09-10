import { federalElections, municipalElections } from "constants/election-types";
import { Election, ElectionDay, OfficeOrQuestion } from "model/tse/ea11";
import { Municipality, Uf } from "model/tse/ea12";

type Value = {
  electionDay: ElectionDay | null;
  election: Election | null;
  uf: Uf | null;
  municipality: Municipality | null;
  zone: string | null;
  officeOrQuestion: OfficeOrQuestion | null;
};

type Options = {
  [K in keyof Value]: NonNullable<Value[K]>[];
};

type Required = {
  [K in keyof Value]?: boolean;
};

type State = {
  value: Value;
  options: Options;
  required: Required;
  valid: boolean;
};

type ValueAction<T = keyof Value> = T extends keyof Value
  ? {
      type: T;
      payload: Value[T];
    }
  : never;

type Action =
  | ValueAction
  | {
      type: "options.uf";
      payload: Options["uf"];
    };

const required: Required = {
  electionDay: true,
  election: true,
  officeOrQuestion: true,
};

const getOfficesAndQuestions = (
  election: Value["election"],
  uf: Value["uf"]
) => {
  if (election && (election.tp !== "1" || election.t === "2" || uf))
    return election.abr
      .filter((location) => ["BR", uf?.cd].includes(location.cd))
      .flatMap((location) => location.cp)
      .filter(
        (officeOrQuestion) =>
          (uf?.cd === "DF" && officeOrQuestion.cd !== "7") ||
          (uf?.cd !== "DF" && officeOrQuestion.cd !== "8")
      );

  return [];
};

const updateValid = (state: State): State => ({
  ...state,
  valid: Object.entries(state.required)
    .filter(([_, value]) => value)
    .every(([key]) => state.value[key as keyof Value]),
});

export const init = (electionDays: Options["electionDay"]): State =>
  formReducer(
    {
      value: {
        electionDay: null,
        election: null,
        uf: null,
        municipality: null,
        zone: null,
        officeOrQuestion: null,
      },
      options: {
        electionDay: electionDays,
        election: [],
        uf: [],
        municipality: [],
        zone: [],
        officeOrQuestion: [],
      },
      required,
      valid: false,
    },
    {
      type: "electionDay",
      payload: electionDays.length === 1 ? electionDays[0] : null,
    }
  );

export const formReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "electionDay":
      const electionDay = action.payload;
      const elections = electionDay?.e ?? [];

      return formReducer(
        {
          ...state,
          value: { ...state.value, electionDay },
          options: { ...state.options, election: elections },
        },
        {
          type: "election",
          payload: elections.length === 1 ? elections[0] : null,
        }
      );

    case "election":
      const election = action.payload;

      return {
        value: {
          ...state.value,
          election,
          uf: null,
          municipality: null,
          zone: null,
          officeOrQuestion: null,
        },
        options: {
          ...state.options,
          uf: [],
          municipality: [],
          zone: [],
          officeOrQuestion: [],
        },
        required: election
          ? {
              ...required,
              uf: !federalElections.includes(election.tp),
              municipality: municipalElections.includes(election.tp),
            }
          : required,
        valid: false,
      };

    case "options.uf":
      const ufs = action.payload;

      return formReducer(
        {
          ...state,
          options: { ...state.options, uf: ufs },
        },
        { type: "uf", payload: ufs.length === 1 ? ufs[0] : null }
      );

    case "uf":
      const uf = action.payload;
      const municipalities = uf?.mu ?? [];

      const officesAndQuestions = getOfficesAndQuestions(
        state.value.election,
        uf
      );

      return formReducer(
        {
          ...state,
          value: {
            ...state.value,
            uf,
            officeOrQuestion:
              officesAndQuestions.length === 1 ? officesAndQuestions[0] : null,
          },
          options: {
            ...state.options,
            municipality: municipalities,
            officeOrQuestion: officesAndQuestions,
          },
        },
        {
          type: "municipality",
          payload:
            state.required.municipality && municipalities.length === 1
              ? municipalities[0]
              : null,
        }
      );

    case "municipality":
      const municipality = action.payload;

      return updateValid({
        ...state,
        value: { ...state.value, municipality, zone: null },
        options: { ...state.options, zone: municipality?.z ?? [] },
      });
  }

  return updateValid({
    ...state,
    value: { ...state.value, [action.type]: action.payload },
  });
};
