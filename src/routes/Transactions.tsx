import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  DataGridPremium,
  GridActionsCellItem,
  GridColumns,
  GridToolbar,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from "@mui/x-data-grid-premium";
import { Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api";
import SwipeableTemporaryDrawer from "../components/Drawer";
import NewTransaction from "./NewTransaction";
import moment from "moment";

type Props = {};

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export async function transactionsLoader() {
  const transactions = await api.transactions.findAll();
  const planners = await api.planners.findAll();
  return { transactions, planners };
}

function Transactions({}: Props) {
  const apiRef = useGridApiRef();
  const { transactions, planners } = useLoaderData() as {
    transactions: Transaction[];
    planners: Planner[];
  };
  const [data, setData] = useState<Transaction[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const plannerOptions = planners.map((planner) => ({
    value: planner,
    label: planner.name,
  }));

  const columns = useMemo<GridColumns<Transaction>>(
    () => [
      {
        field: "planner",
        headerName: "Planner",
        width: 200,
        editable: true,
        type: "singleSelect",
        groupable: true,
        valueOptions: plannerOptions,
        valueFormatter: ({ value }) => {
          return value?.name;
        },
        groupingValueGetter: ({ value }) => {
          return value?.name;
        },
      },
      {
        field: "amount",
        headerName: "Amount",
        width: 150,
        editable: true,
        type: "number",
        groupable: false,
        valueFormatter: ({ value }) => {
          return currencyFormatter.format(value);
        },
      },
      { field: "title", headerName: "Title", flex: 1, editable: true },
      { field: "sender", headerName: "Sender", flex: 1, editable: true },
      { field: "receiver", headerName: "Receiver", flex: 1, editable: true },
      {
        field: "date",
        headerName: "Date",
        flex: 1,
        editable: true,
        type: "date",
        valueFormatter: ({ value }) => {
          return value ? moment(value).format("DD.MM.YYYY HH:mm") : "";
        },
      },
      {
        field: "actions",
        type: "actions",
        width: 80,
        hideable: false,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={async () => {
              const rowElement = document.querySelector(
                `[role="row"][data-id="${params.id}"]`
              );

              rowElement?.setAttribute("data-deleting", "true");

              await api.transactions.remove(params.id as string);
              await transactionsLoader().then((data) =>
                setData(data.transactions)
              );
            }}
          />,
        ],
      },
    ],
    []
  );

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ["planner"],
      },
      aggregation: {
        model: {
          amount: "sum",
        },
      },
    },
  });

  const addHandler = async () => {
    await transactionsLoader().then((data) => setData(data.transactions));
    setDrawerOpen(false);
  };

  useEffect(() => {
    setData(transactions);
  }, [transactions]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Transactions</Typography>

        <SwipeableTemporaryDrawer
          buttonLabel="Add"
          anchor="right"
          open={drawerOpen}
          onToggle={(open) => setDrawerOpen(open)}
        >
          <Box padding={3} width={350} display="flex" flexDirection="column">
            <NewTransaction onAdd={addHandler} />
          </Box>
        </SwipeableTemporaryDrawer>
      </Box>
      <DataGridPremium
        density="compact"
        apiRef={apiRef}
        rows={data}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true, aggregation: true }}
        initialState={initialState}
        editMode="row"
        components={{
          Toolbar: GridToolbar,
        }}
        processRowUpdate={async (newRow: Transaction) => {
          if (!newRow.id) throw new Error("No ID");
          if (!newRow.planner) throw new Error("No planner");

          await api.transactions.update(newRow.id, {
            title: newRow.title,
            sender: newRow.sender,
            receiver: newRow.receiver,
            date: newRow.date,
            amount: newRow.amount,
            planner: newRow.planner.id,
          });

          return newRow;
        }}
      />
    </>
  );
}

export default Transactions;
