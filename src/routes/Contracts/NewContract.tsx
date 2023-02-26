import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import api from "../../api";

type Props = {
  onAdd: () => void;
};

function NewContract({ onAdd }: Props) {
  const [planners, setPlanners] = useState<Planner[]>([]);
  const [values, setValues] = useState<ContractCreate>({
    title: "",
    planner: null,
  });

  const handleChange =
    (prop: keyof Contract) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    await api.contracts.create({
      title: values.title,
      planner: values.planner,
    });

    setValues({
      title: "",
      planner: null,
    });

    onAdd();
  };

  useEffect(() => {
    api.planners.findAll().then((planners) => setPlanners(planners));
  }, []);

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Add Contract
      </Typography>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel htmlFor="title">Title</InputLabel>
        <OutlinedInput
          value={values.title}
          onChange={handleChange("title")}
          id="title"
          label="Name"
        />
      </FormControl>
      <FormControl fullWidth sx={{ my: 2 }}>
        <Autocomplete
          id="planners"
          value={values.planner as Planner}
          options={planners}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            if (!newValue) return;
            setValues({ ...values, planner: newValue });
          }}
          renderInput={(params) => <TextField {...params} label="Planner" />}
        />
      </FormControl>
      <Button onClick={handleSubmit} variant="contained" fullWidth>
        Add
      </Button>
    </>
  );
}

export default NewContract;
