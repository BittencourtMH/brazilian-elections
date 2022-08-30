import { useEffect, useState } from "react";

import { Autocomplete, Stack, TextField } from "@mui/material";

import {
  Election,
  ElectionDay,
  ElectionSettings,
  Location as Ea11Location,
  OfficeOrQuestion,
} from "model/tse/ea11";

import {
  Location as Ea12Location,
  Municipality,
  MunicipalitySettings,
} from "model/tse/ea12";

type Props = {
  electionSettings: ElectionSettings;
  getMunicipalities: (election: Election["cd"]) => MunicipalitySettings;
};

export const MainScreen = ({ electionSettings, getMunicipalities }: Props) => {
  const [electionDay, setElectionDay] = useState<ElectionDay | null>(null);
  const [election, setElection] = useState<Election | null>(null);
  const [location, setLocation] = useState<Ea11Location | null>(null);

  const [officeOrQuestion, setOfficeOrQuestion] =
    useState<OfficeOrQuestion | null>(null);

  const [municipalities, setMunicipalities] =
    useState<MunicipalitySettings | null>(null);

  const [uf, setUf] = useState<Ea12Location | null>(null);
  const [municipality, setMunicipality] = useState<Municipality | null>(null);
  const [zone, setZone] = useState<string | null>(null);

  useEffect(() => {
    if (electionSettings.pl.length === 1) {
      setElectionDay(electionSettings.pl[0]);
    }
  }, [electionSettings]);

  useEffect(() => {
    setElection(electionDay?.e.length !== 1 ? null : electionDay.e[0]);
  }, [electionDay]);

  useEffect(() => {
    setLocation(election?.abr.length !== 1 ? null : election.abr[0]);

    if (election) {
      setMunicipalities(getMunicipalities(election.cd));
    }
  }, [election, getMunicipalities]);

  useEffect(() => {
    setOfficeOrQuestion(location?.cp.length !== 1 ? null : location.cp[0]);
  }, [location]);

  useEffect(() => {
    setUf(municipalities?.abr.length !== 1 ? null : municipalities.abr[0]);
  }, [municipalities]);

  useEffect(() => {
    setMunicipality(uf?.mu.length !== 1 ? null : uf.mu[0]);
  }, [uf]);

  useEffect(() => {
    setZone(municipality?.z.length !== 1 ? null : municipality.z[0]);
  }, [municipality]);

  return (
    <Stack direction="row" flexWrap="wrap" gap={2} m={4}>
      <Autocomplete
        getOptionLabel={(option) => option.dt}
        onChange={(_, value) => setElectionDay(value)}
        options={electionSettings.pl}
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

      <Autocomplete
        getOptionLabel={(option) => option.ds}
        onChange={(_, value) => setUf(value)}
        options={municipalities?.abr ?? []}
        renderInput={(params) => (
          <TextField {...params} label="UF" sx={{ width: 300 }} />
        )}
        value={uf}
      />

      <Autocomplete
        getOptionLabel={(option) => option.nm}
        onChange={(_, value) => setMunicipality(value)}
        options={uf?.mu ?? []}
        renderInput={(params) => (
          <TextField {...params} label="Municipality" sx={{ width: 400 }} />
        )}
        value={municipality}
      />

      <Autocomplete
        onChange={(_, value) => setZone(value)}
        options={municipality?.z ?? []}
        renderInput={(params) => (
          <TextField {...params} label="Zone" sx={{ width: 200 }} />
        )}
        value={zone}
      />
    </Stack>
  );
};
