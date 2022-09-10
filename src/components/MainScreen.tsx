import { useEffect, useReducer, useState } from "react";

import {
  Autocomplete,
  Button,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { Query } from "model/app";
import { ElectionSettings } from "model/tse/ea11";
import { formReducer, init } from "reducers/formReducer";
import { getMunicipalitySettings } from "services";

type Props = {
  electionSettings: ElectionSettings;
};

const durations = Array.from({ length: 12 }, (_, i) => 5 * (i + 1));

const columns: GridColDef<Query>[] = [
  {
    field: "election",
    flex: 1,
    headerName: "Election",
    valueGetter: (params) => params.row.election.nm,
  },
  { field: "uf", headerName: "UF", valueGetter: (params) => params.row.uf?.cd },
  {
    field: "municipality",
    flex: 1,
    headerName: "Municipality",
    valueGetter: (params) => params.row.municipality?.nm,
  },
  { field: "zone", headerName: "Zone" },
  {
    field: "officeOrQuestion",
    flex: 1,
    headerName: "Office or question",
    valueGetter: (params) => params.row.officeOrQuestion.ds,
  },
  { field: "duration", headerName: "Duration" },
];

export const MainScreen = ({ electionSettings }: Props) => {
  const [duration, setDuration] = useState(durations[0]);
  const [queries, setQueries] = useState<Query[]>([]);

  const [state, dispatch] = useReducer(formReducer, electionSettings.pl, init);

  const { value, options, required } = state;

  useEffect(() => {
    if (value.election) {
      dispatch({
        type: "options.uf",
        payload: getMunicipalitySettings(value.election.cd).abr,
      });
    }
  }, [value.election]);

  return (
    <Stack alignItems="start" gap={2} m={4}>
      <Stack direction="row" flexWrap="wrap" gap={2}>
        <Autocomplete
          disabled={!options.electionDay.length}
          getOptionLabel={(option) => option.dt}
          onChange={(_, value) =>
            dispatch({ type: "electionDay", payload: value })
          }
          options={options.electionDay}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Election day"
              required={required.electionDay}
              sx={{ width: 200 }}
            />
          )}
          value={value.electionDay}
        />

        <Autocomplete
          disabled={!options.election.length}
          getOptionLabel={(option) => option.nm}
          onChange={(_, value) =>
            dispatch({ type: "election", payload: value })
          }
          options={options.election}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Election"
              required={required.election}
              sx={{ width: 500 }}
            />
          )}
          value={value.election}
        />

        <Autocomplete
          disabled={!options.uf.length}
          getOptionLabel={(option) => option.ds}
          onChange={(_, value) => dispatch({ type: "uf", payload: value })}
          options={options.uf}
          renderInput={(params) => (
            <TextField
              {...params}
              label="UF"
              required={required.uf}
              sx={{ width: 300 }}
            />
          )}
          value={value.uf}
        />

        <Autocomplete
          disabled={!options.municipality.length}
          getOptionLabel={(option) => option.nm}
          onChange={(_, value) =>
            dispatch({ type: "municipality", payload: value })
          }
          options={options.municipality}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Municipality"
              required={required.municipality}
              sx={{ width: 400 }}
            />
          )}
          value={value.municipality}
        />

        <Autocomplete
          disabled={!options.zone.length}
          onChange={(_, value) => dispatch({ type: "zone", payload: value })}
          options={options.zone}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Zone"
              required={required.zone}
              sx={{ width: 200 }}
            />
          )}
          value={value.zone}
        />

        <Autocomplete
          disabled={!options.officeOrQuestion.length}
          getOptionLabel={(option) => option.ds}
          onChange={(_, value) =>
            dispatch({ type: "officeOrQuestion", payload: value })
          }
          options={options.officeOrQuestion}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Office or question"
              required={required.officeOrQuestion}
              sx={{ width: 300 }}
            />
          )}
          value={value.officeOrQuestion}
        />

        <TextField
          label="Duration"
          onChange={({ target }) => setDuration(Number(target.value))}
          select
          sx={{ width: 100 }}
          value={duration}
        >
          {durations.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <Button
        disabled={!state.valid}
        onClick={() =>
          setQueries([
            ...queries,
            {
              id: queries.length + 1,
              election: value.election!,
              uf: value.uf,
              municipality: value.municipality,
              zone: value.zone,
              officeOrQuestion: value.officeOrQuestion!,
              duration,
            },
          ])
        }
        variant="contained"
      >
        Add
      </Button>

      <DataGrid
        autoHeight
        columns={columns}
        rows={queries}
        sx={{ width: "100%" }}
      />
    </Stack>
  );
};
