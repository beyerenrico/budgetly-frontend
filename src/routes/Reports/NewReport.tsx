import React, { useState } from "react";
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import api from "../../api";
import { useActiveUserStore } from "../../stores";

type Props = {
  onAdd: () => void;
};

function NewReport({ onAdd }: Props) {
  const { activeUser } = useActiveUserStore((state) => ({
    activeUser: state.activeUser,
  }));

  const [values, setValues] = useState<ReportCreate>({
    name: "",
    description: "",
    user: activeUser?.sub ?? "",
  });

  const handleChange =
    (prop: keyof Report) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    await api.reports.create(values);

    setValues({
      ...values,
      name: "",
      description: "",
    });

    onAdd();
  };

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Add Report
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

export default NewReport;
