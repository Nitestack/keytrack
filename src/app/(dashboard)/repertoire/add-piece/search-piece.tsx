"use client";

import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";

import { useState } from "react";

import { useDebouncedCallback } from "use-debounce";

import { api } from "~/trpc/react";

import type { AutocompleteInputChangeReason } from "@mui/material/Autocomplete";
import type { Dispatch, FC, SetStateAction } from "react";
import type { MBWork } from "~/services/music-brainz";

const SearchPiece: FC<{
  selectedPiece: MBWork | null;
  setSelectedPiece: Dispatch<SetStateAction<MBWork | null>>;
}> = ({ selectedPiece, setSelectedPiece }) => {
  const [searchResultItems, setSearchResultItems] = useState<MBWork[]>([]);

  const { data, isPending, mutate, variables } =
    api.repertoire.search.useMutation({
      onSuccess: (data) => {
        setSearchResultItems(data);
      },
    });

  const handleInputChange = useDebouncedCallback(
    (newValue: string, reason: AutocompleteInputChangeReason) => {
      if (reason === "selectOption") return; // if a piece was selected (no need to search again)
      if (variables?.work === newValue) {
        // if the last search query is the same as the current
        if (searchResultItems.length === 0 && data) setSearchResultItems(data); // use the last search result if available
        return;
      }
      if (newValue === "") {
        setSearchResultItems([]);
        return;
      }
      mutate({ work: newValue });
    },
    500,
  );

  return (
    <Autocomplete
      clearOnBlur={false}
      noOptionsText="No pieces found"
      handleHomeEndKeys
      fullWidth
      loading={isPending}
      value={selectedPiece}
      onChange={(_, newValue) => setSelectedPiece(newValue)}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      getOptionDisabled={(option) => option.isInRepertoire}
      options={searchResultItems}
      onInputChange={(_, value, reason) => handleInputChange(value, reason)}
      groupBy={(option) => option.composer}
      filterOptions={(option) => option}
      getOptionLabel={(option) => {
        let label = `${option.composer} - ${option.title}`;
        if (option.arrangement) label += ` (${option.arrangement})`;
        return label;
      }}
      renderOption={({ key, ...optionProps }, option) => (
        <ListItem key={key + option.id} {...optionProps}>
          <ListItemText
            primary={option.title + (option.isInRepertoire ? " (added)" : "")}
            secondary={option.arrangement}
          />
        </ListItem>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          margin="normal"
          placeholder="Search a piece"
          helperText="Powered by MusicBrainz"
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {isPending ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
    />
  );
};

export default SearchPiece;
