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
import api from "../../api";
import SwipeableTemporaryDrawer from "../../components/Drawer";
import moment from "moment";
import NewTransaction from "./NewTransaction";
import NewCategory from "../Categories/NewCategory";
import { useSnackbar } from "notistack";
import NewContract from "../Contracts/NewContract";

type Props = {};

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export async function transactionsLoader() {
  const transactions = await api.transactions.findAll();
  const planners = await api.planners.findAll();
  const categories = await api.categories.findAll();
  const contracts = await api.contracts.findAll();

  return { transactions, planners, categories, contracts };
}

function Transactions({}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const apiRef = useGridApiRef();
  const { transactions, planners, categories, contracts } = useLoaderData() as {
    transactions: Transaction[];
    planners: Planner[];
    categories: Category[];
    contracts: Contract[];
  };
  const [stateTransactions, setStateTransactions] =
    useState<Transaction[]>(transactions);
  const [stateCategories, setStateCategories] =
    useState<Category[]>(categories);
  const [stateContracts, setStateContracts] = useState<Contract[]>(contracts);

  const [drawerOpenTransaction, setDrawerOpenTransaction] = useState(false);
  const [drawerOpenCategory, setDrawerOpenCategory] = useState(false);
  const [drawerOpenContract, setDrawerOpenContract] = useState(false);

  const [plannerOptions] = useState(
    planners.map((planner) => ({
      value: JSON.stringify(planner),
      label: planner.name,
    }))
  );

  const [categoryOptions, setCategoryOptions] = useState(
    stateCategories.map((category) => ({
      value: JSON.stringify(category),
      label: category.name,
    }))
  );

  const [contractOptions, setContractOptions] = useState(
    stateContracts.map((contract) => ({
      value: JSON.stringify(contract),
      label: contract.title,
    }))
  );

  const columns = useMemo<GridColumns<Transaction>>(
    () => [
      {
        field: "title",
        headerName: "Title",
        flex: 1,
        editable: true,
      },
      {
        field: "sender",
        headerName: "Sender",
        flex: 1,
        editable: true,
      },
      {
        field: "receiver",
        headerName: "Receiver",
        flex: 1,
        editable: true,
      },
      {
        field: "planner",
        headerName: "Planner",
        width: 200,
        editable: true,
        type: "singleSelect",
        groupable: true,
        valueOptions: plannerOptions,
        valueFormatter: ({ value }) => {
          if (typeof value === "string") {
            return JSON.parse(value).name;
          }

          return value?.name;
        },
        groupingValueGetter: ({ value }) => {
          if (typeof value === "string") {
            return JSON.parse(value).name;
          }

          return value?.name;
        },
      },
      {
        field: "category",
        headerName: "Category",
        flex: 1,
        editable: true,
        type: "singleSelect",
        groupable: true,
        valueOptions: () => {
          return categoryOptions;
        },
        valueFormatter: ({ value }) => {
          if (typeof value === "string") {
            return JSON.parse(value).name;
          }

          return value?.name;
        },
        groupingValueGetter: ({ value }) => {
          if (typeof value === "string") {
            return JSON.parse(value).name;
          }

          return value?.name;
        },
      },
      {
        field: "contract",
        headerName: "Contract",
        flex: 1,
        editable: true,
        type: "singleSelect",
        groupable: true,
        valueOptions: ({ row }) => {
          const filteredOptions = contractOptions.filter((contract) => {
            const contractValue: Contract = JSON.parse(contract.value);

            if (typeof contractValue.planner === "string") {
              contractValue.planner = JSON.parse(
                contractValue.planner
              ) as Planner;
            }

            if (typeof row?.planner === "string") {
              row.planner = JSON.parse(row.planner) as Planner;
            }

            return contractValue.planner?.id === row?.planner?.id;
          });

          return filteredOptions;
        },
        valueFormatter: ({ value }) => {
          if (typeof value === "string") {
            return JSON.parse(value).title;
          }

          return value?.title;
        },
        groupingValueGetter: ({ value }) => {
          if (typeof value === "string") {
            return JSON.parse(value).title;
          }

          return value?.title;
        },
      },
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
        field: "year",
        headerName: "Year",
        flex: 1,
        editable: false,
        groupingValueGetter: ({ row }) => {
          return row.date ? moment(row.date).format("YYYY") : "";
        },
        type: "string",
        valueGetter: ({ row }) => {
          return row.date ? moment(row.date).format("YYYY") : "";
        },
      },
      {
        field: "month",
        headerName: "Month",
        type: "singleSelect",
        valueOptions: [
          { value: "January", label: "January" },
          { value: "February", label: "February" },
          { value: "March", label: "March" },
          { value: "April", label: "April" },
          { value: "May", label: "May" },
          { value: "June", label: "June" },
          { value: "July", label: "July" },
          { value: "August", label: "August" },
          { value: "September", label: "September" },
          { value: "October", label: "October" },
          { value: "November", label: "November" },
          { value: "December", label: "December" },
        ],
        flex: 1,
        editable: false,
        groupingValueGetter(params) {
          return params.row.date ? moment(params.row.date).format("MMMM") : "";
        },
        valueGetter: ({ row }) => {
          return row.date ? moment(row.date).format("MMMM") : "";
        },
      },
      {
        field: "amount",
        headerName: "Amount",
        flex: 1,
        editable: true,
        type: "number",
        groupable: false,
        valueFormatter: ({ value }) => {
          return currencyFormatter.format(value);
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
                setStateTransactions(data.transactions)
              );
            }}
          />,
        ],
      },
    ],
    [plannerOptions, categoryOptions, contractOptions]
  );

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ["planner", "year", "month"],
      },
      sorting: {
        sortModel: [
          {
            field: "date",
            sort: "desc",
          },
        ],
      },
      aggregation: {
        model: {
          amount: "sum",
        },
      },
    },
  });

  const addHandlerTransaction = async () => {
    await transactionsLoader().then((data) =>
      setStateTransactions(data.transactions)
    );
    setDrawerOpenTransaction(false);
    enqueueSnackbar("Transaction added", { variant: "success" });
  };

  const addHandlerCategory = async () => {
    await transactionsLoader().then((data) => {
      setStateCategories(data.categories);
      setCategoryOptions(
        data.categories.map((category) => ({
          value: JSON.stringify(category),
          label: category.name,
        }))
      );
    });
    setDrawerOpenCategory(false);
    enqueueSnackbar("Category added", { variant: "success" });
  };

  const addHandlerContract = async () => {
    await transactionsLoader().then((data) => {
      setStateContracts(data.contracts);
      setContractOptions(
        data.contracts.map((contract) => ({
          value: JSON.stringify(contract),
          label: contract.title,
        }))
      );
    });
    setDrawerOpenContract(false);
    enqueueSnackbar("Contract added", { variant: "success" });
  };

  useEffect(() => {
    setStateTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    setStateCategories(categories);
  }, [categories]);

  useEffect(() => {
    setStateContracts(contracts);
  }, [contracts]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Transactions</Typography>

        <Box display="flex" gap={1}>
          <SwipeableTemporaryDrawer
            buttonLabel="Add Contract"
            buttonVariant="outlined"
            anchor="right"
            open={drawerOpenContract}
            onToggle={(open) => setDrawerOpenContract(open)}
          >
            <Box padding={3} width={350} display="flex" flexDirection="column">
              <NewContract onAdd={addHandlerContract} />
            </Box>
          </SwipeableTemporaryDrawer>
          <SwipeableTemporaryDrawer
            buttonLabel="Add Category"
            buttonVariant="outlined"
            anchor="right"
            open={drawerOpenCategory}
            onToggle={(open) => setDrawerOpenCategory(open)}
          >
            <Box padding={3} width={350} display="flex" flexDirection="column">
              <NewCategory onAdd={addHandlerCategory} />
            </Box>
          </SwipeableTemporaryDrawer>
          <SwipeableTemporaryDrawer
            buttonLabel="New Transaction"
            anchor="right"
            open={drawerOpenTransaction}
            onToggle={(open) => setDrawerOpenTransaction(open)}
          >
            <Box padding={3} width={350} display="flex" flexDirection="column">
              <NewTransaction onAdd={addHandlerTransaction} />
            </Box>
          </SwipeableTemporaryDrawer>
        </Box>
      </Box>
      <DataGridPremium
        isRowSelectable={() => false}
        density="compact"
        apiRef={apiRef}
        rows={stateTransactions}
        columns={columns}
        experimentalFeatures={{ newEditingApi: true, aggregation: true }}
        initialState={initialState}
        editMode="row"
        components={{
          Toolbar: GridToolbar,
        }}
        onProcessRowUpdateError={(params) => {
          enqueueSnackbar(params.error.message, { variant: "error" });
        }}
        processRowUpdate={async (newRow: Transaction) => {
          if (!newRow.id) throw new Error("No ID");

          if (typeof newRow.planner === "string") {
            newRow.planner = JSON.parse(newRow.planner) as Planner;
          }

          if (typeof newRow.category === "string") {
            newRow.category = JSON.parse(newRow.category) as Category;
          }

          if (typeof newRow.contract === "string") {
            newRow.contract = JSON.parse(newRow.contract) as Contract;
          }

          if (!newRow.planner) throw new Error("No planner");
          if (!newRow.category) throw new Error("No category");
          if (!newRow.contract) throw new Error("No contract");

          await api.transactions.update(newRow.id, {
            title: newRow.title,
            sender: newRow.sender,
            receiver: newRow.receiver,
            date: newRow.date,
            amount: newRow.amount,
            planner: newRow.planner.id,
            category: newRow.category.id,
            contract: newRow.contract.id,
          });

          enqueueSnackbar("Transaction updated", { variant: "success" });

          newRow.planner = JSON.stringify(newRow.planner);
          newRow.category = JSON.stringify(newRow.category);
          newRow.contract = JSON.stringify(newRow.contract);

          return newRow;
        }}
      />
    </>
  );
}

export default Transactions;
