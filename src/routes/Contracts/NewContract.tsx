import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import api from "../../api";
import { useSelectedPlannerStore } from "../../stores";

type Props = {
  onAdd: () => void;
};

function NewContract({ onAdd }: Props) {
  const { selectedPlanner } = useSelectedPlannerStore((state) => ({
    selectedPlanner: state.planner,
  }));
  const [values, setValues] = useState<ContractCreate>({
    title: "",
    planner: selectedPlanner,
  });

  const handleChange =
    (prop: keyof Contract) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    await api.contracts.create({
      title: values.title,
      planner: selectedPlanner?.id ?? null,
    });

    setValues({
      title: "",
      planner: selectedPlanner,
    });

    onAdd();
  };

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
      <Button onClick={handleSubmit} variant="contained" fullWidth>
        Add
      </Button>
    </>
  );
}

export default NewContract;
