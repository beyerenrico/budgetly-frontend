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
import api from "../../api";
import { useGlobalStore } from "../../main";

type Props = {
  onAdd: () => void;
};

function NewTransaction({ onAdd }: Props) {
  const { selectedPlanner } = useGlobalStore((state) => ({
    selectedPlanner: state.planner,
  }));
  const [categories, setCategories] = useState<Category[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [values, setValues] = useState<Transaction>({
    title: "",
    sender: "",
    receiver: "",
    amount: 0.0,
    date: new Date().toISOString(),
    planner: selectedPlanner,
    category: null,
    contract: null,
  });

  const handleChange =
    (prop: keyof Transaction) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();

    if (typeof values.planner === "string") {
      values.planner = JSON.parse(values.planner) as Planner;
    }

    if (typeof values.category === "string") {
      values.category = JSON.parse(values.category) as Category;
    }

    if (typeof values.contract === "string") {
      values.contract = JSON.parse(values.contract) as Contract;
    }

    await api.transactions.create({
      title: values.title,
      sender: values.sender,
      receiver: values.receiver,
      amount: values.amount,
      date: values.date,
      planner: selectedPlanner?.id ?? null,
      category: values.category?.id ?? null,
      contract: values.contract?.id ?? null,
    });

    setValues({
      title: "",
      sender: "",
      receiver: "",
      amount: 0.0,
      date: new Date().toISOString(),
      planner: selectedPlanner,
      category: null,
      contract: null,
    });

    onAdd();
  };

  useEffect(() => {
    api.categories.findAll().then((categories) => setCategories(categories));
    api.contracts.findAll().then((contracts) => setContracts(contracts));
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
          id="categories"
          value={values.category as Category}
          options={categories}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => {
            if (!newValue) return;
            setValues({ ...values, category: newValue });
          }}
          renderInput={(params) => <TextField {...params} label="Category" />}
        />
      </FormControl>
      <FormControl fullWidth sx={{ my: 2 }}>
        <Autocomplete
          id="contracts"
          value={values.contract as Contract}
          options={contracts}
          getOptionLabel={(option) => option.title}
          onChange={(event, newValue) => {
            if (!newValue) return;
            setValues({ ...values, contract: newValue });
          }}
          renderInput={(params) => <TextField {...params} label="Contract" />}
        />
      </FormControl>
      <Button onClick={handleSubmit} variant="contained" fullWidth>
        Add
      </Button>
    </>
  );
}

export default NewTransaction;
