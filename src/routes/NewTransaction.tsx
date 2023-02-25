import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import api from "../api";

type Props = {
  onAdd: () => void;
};

function NewTransaction({ onAdd }: Props) {
  const [planners, setPlanners] = useState<Planner[]>([]);
  const [values, setValues] = useState<TransactionCreate>({
    title: "",
    sender: "",
    receiver: "",
    amount: 0.0,
    date: new Date().toISOString(),
    planner: "",
  });

  const handleChange =
    (prop: keyof Transaction) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();
    await api.transactions.create({
      title: values.title,
      sender: values.sender,
      receiver: values.receiver,
      amount: values.amount,
      date: values.date,
      planner: values.planner,
    });

    setValues({
      title: "",
      sender: "",
      receiver: "",
      amount: 0.0,
      date: new Date().toISOString(),
      planner: "",
    });

    onAdd();
  };

  useEffect(() => {
    api.planners.findAll().then((planners) => setPlanners(planners));
  }, []);

  return (
    <>
      <Typography variant="h6" marginBottom={1}>
        Add Transaction
      </Typography>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel htmlFor="title">Title</InputLabel>
        <OutlinedInput
          value={values.title}
          onChange={handleChange("title")}
          id="title"
          label="Title"
        />
      </FormControl>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel htmlFor="sender">Sender</InputLabel>
        <OutlinedInput
          value={values.sender}
          onChange={handleChange("sender")}
          id="sender"
          label="Sender"
        />
      </FormControl>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel htmlFor="receiver">Receiver</InputLabel>
        <OutlinedInput
          value={values.receiver}
          onChange={handleChange("receiver")}
          id="receiver"
          label="Receiver"
        />
      </FormControl>
      <FormControl fullWidth sx={{ my: 2 }}>
        <InputLabel htmlFor="amount">Amount</InputLabel>
        <OutlinedInput
          id="amount"
          type="number"
          value={values.amount}
          onChange={handleChange("amount")}
          endAdornment={<InputAdornment position="start">€</InputAdornment>}
          label="Amount"
        />
      </FormControl>
      <FormControl fullWidth sx={{ my: 2 }}>
        <DateTimePicker
          label="Date"
          onChange={(newValue) => {
            setValues({ ...values, date: newValue?.toISOString() || "" });
          }}
          value={moment(values.date)}
          renderInput={(params) => <TextField id="date" {...params} />}
        />
      </FormControl>
      <FormControl fullWidth sx={{ my: 2 }}>
        <Autocomplete
          id="planners"
          options={planners}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            if (!newValue) return;
            setValues({ ...values, planner: newValue.id });
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

export default NewTransaction;
