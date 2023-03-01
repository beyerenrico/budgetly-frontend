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

function NewContract({ onAdd }: Props) {
  const { activeUser } = useActiveUserStore((state) => ({
    activeUser: state.activeUser,
  }));

  const [values, setValues] = useState<ContractCreate>({
    name: "",
    user: activeUser?.sub ?? "",
  });

  const handleChange =
    (prop: keyof Contract) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    await api.contracts.create(values);

    setValues({
      ...values,
      name: "",
    });

    onAdd();
  };

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Add Contract
      </Typography>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel htmlFor="name">Name</InputLabel>
        <OutlinedInput
          value={values.name}
          onChange={handleChange("name")}
          id="name"
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
