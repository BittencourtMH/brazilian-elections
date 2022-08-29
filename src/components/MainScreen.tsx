import { useEffect, useState } from "react";

import { Autocomplete, Stack, TextField } from "@mui/material";

import {
  Election,
  ElectionDay,
  ElectionSettings,
  Location,
  OfficeOrQuestion,
} from "model/tse";

type Props = {
  data: ElectionSettings;
};

export const MainScreen = ({ data }: Props) => {
  const [electionDay, setElectionDay] = useState<ElectionDay | null>(null);
  const [election, setElection] = useState<Election | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [officeOrQuestion, setOfficeOrQuestion] =
    useState<OfficeOrQuestion | null>(null);

  useEffect(() => {
    if (data.pl.length === 1) {
      setElectionDay(data.pl[0]);
    }
  }, [data]);

  useEffect(() => {
    setElection(electionDay?.e.length !== 1 ? null : electionDay.e[0]);
  }, [electionDay]);

  useEffect(() => {
    setLocation(election?.abr.length !== 1 ? null : election.abr[0]);
  }, [election]);

  useEffect(() => {
    setOfficeOrQuestion(location?.cp.length !== 1 ? null : location.cp[0]);
  }, [location]);

  return (
    <Stack direction="row" gap={2} m={4}>
      <Autocomplete
        getOptionLabel={(option) => option.dt}
        onChange={(_, value) => setElectionDay(value)}
        options={data.pl}
        renderInput={(params) => (
          <TextField {...params} label="Election day" sx={{ width: 200 }} />
        )}
        value={electionDay}
      />

      <Autocomplete
        getOptionLabel={(option) => option.nm}
        onChange={(_, value) => setElection(value)}
        options={electionDay?.e ?? []}
        renderInput={(params) => (
          <TextField {...params} label="Election" sx={{ width: 500 }} />
        )}
        value={election}
      />

      <Autocomplete
        getOptionLabel={(option) => option.cd}
        onChange={(_, value) => setLocation(value)}
        options={election?.abr ?? []}
        renderInput={(params) => (
          <TextField {...params} label="Location" sx={{ width: 200 }} />
        )}
        value={location}
      />

      <Autocomplete
        getOptionLabel={(option) => option.ds}
        onChange={(_, value) => setOfficeOrQuestion(value)}
        options={location?.cp ?? []}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Office or question"
            sx={{ width: 300 }}
          />
        )}
        value={officeOrQuestion}
      />
    </Stack>
  );
};
