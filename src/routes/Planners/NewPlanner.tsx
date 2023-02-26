import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import api from "../../api";

type Props = {
  onAdd: () => void;
};

function NewPlanner({ onAdd }: Props) {
  const [values, setValues] = useState<PlannerCreate>({
    name: "",
    description: "",
  });

  const handleChange =
    (prop: keyof Planner) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    await api.planners.create({
      name: values.name,
      description: values.description,
    });

    setValues({
      name: "",
      description: "",
    });

    onAdd();
  };

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Add Planner
      </Typography>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel htmlFor="name">Name</InputLabel>
        <OutlinedInput
          value={values.name}
          onChange={handleChange("name")}
          id="name"
          label="name"
        />
      </FormControl>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel htmlFor="description">Description</InputLabel>
        <OutlinedInput
          value={values.description}
          onChange={handleChange("description")}
          id="description"
          label="description"
        />
      </FormControl>
      <Button onClick={handleSubmit} variant="contained" fullWidth>
        Add
      </Button>
    </>
  );
}

export default NewPlanner;
