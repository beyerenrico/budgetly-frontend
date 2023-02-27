import { useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import {
  DataGridPremium,
  GridActionsCellItem,
  GridColumns,
  GridNoRowsOverlay,
  GridToolbar,
  useGridApiRef,
  useKeepGroupedColumnsHidden,
} from "@mui/x-data-grid-premium";
import {
  Box,
  Chip,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api";
import SwipeableTemporaryDrawer from "../../components/Drawer";
import moment from "moment";
import NewTransaction from "./NewTransaction";
import NewCategory from "../Categories/NewCategory";
import { useSnackbar } from "notistack";
import NewContract from "../Contracts/NewContract";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CategoryIcon from "@mui/icons-material/Category";
import FolderIcon from "@mui/icons-material/Folder";
import { useGlobalStore } from "../../main";
import NoPlannerOverlay from "./NoPlannerOverlay";

type Props = {};

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export async function transactionsLoader() {
  const planners = await api.planners.findAll();
  const categories = await api.categories.findAll();
  const contracts = await api.contracts.findAll();

  return { planners, categories, contracts };
}

function Transactions({}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const apiRef = useGridApiRef();
  const { planners, categories, contracts } = useLoaderData() as {
    planners: Planner[];
    categories: Category[];
    contracts: Contract[];
  };

  const { selectedPlanner, setSelectedPlanner } = useGlobalStore((state) => ({
    selectedPlanner: state.planner,
    setSelectedPlanner: state.setPlanner,
  }));

  const [stateTransactions, setStateTransactions] = useState<Transaction[]>([]);

  const [stateCategories, setStateCategories] =
    useState<Category[]>(categories);

  const [stateContracts, setStateContracts] = useState<Contract[]>(contracts);

  const [rowGroupingModel, setRowGroupingModel] = useState(["planner"]);

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

  const rowGroupingModelStr = rowGroupingModel.join("-");

  const columns = useMemo<GridColumns<Transaction>>(
    () => [
      {
        field: "title",
        headerName: "Title",
        width: 150,
        editable: true,
      },
      {
        field: "sender",
        headerName: "Sender",
        width: 150,
        editable: true,
      },
      {
        field: "receiver",
        headerName: "Receiver",
        width: 150,
        editable: true,
      },
      {
        field: "category",
        headerName: "Category",
        width: 150,
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
        width: 150,
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
        width: 150,
        editable: true,
        type: "date",
        valueFormatter: ({ value }) => {
          return value ? moment(value).format("DD.MM.YYYY HH:mm") : "";
        },
      },
      {
        field: "year",
        headerName: "Year",
        width: 150,
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
        width: 150,
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
        width: 150,
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
              await api.transactions
                .findAll({ planner: { id: selectedPlanner?.id } })
                .then((data) => {
                  setStateTransactions(data);
                });
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
        model: rowGroupingModel,
      },
      pinnedColumns: {
        right: ["amount"],
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
    await api.transactions
      .findAll({ planner: { id: selectedPlanner?.id } })
      .then((data) => {
        setStateTransactions(data);
      });
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

  const actions: {
    title: string;
    open: boolean;
    variant: "contained" | "outlined";
    setOpen: (open: boolean) => void;
    icon: JSX.Element;
    component: JSX.Element;
  }[] = [
    {
      title: "Add Transaction",
      open: drawerOpenTransaction,
      variant: "contained",
      setOpen: setDrawerOpenTransaction,
      icon: <AccountBalanceIcon />,
      component: <NewTransaction onAdd={addHandlerTransaction} />,
    },
    {
      title: "Add Category",
      open: drawerOpenCategory,
      variant: "outlined",
      setOpen: setDrawerOpenCategory,
      icon: <CategoryIcon />,
      component: <NewCategory onAdd={addHandlerCategory} />,
    },
    {
      title: "Add Contract",
      open: drawerOpenContract,
      variant: "outlined",
      setOpen: setDrawerOpenContract,
      icon: <FolderIcon />,
      component: <NewContract onAdd={addHandlerContract} />,
    },
  ];

  useEffect(() => {
    if (!selectedPlanner) return;

    api.transactions
      .findAll({ planner: { id: selectedPlanner?.id } })
      .then((data) => {
        setStateTransactions(data);
      });
  }, [selectedPlanner]);

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
        sx={{
          mb: 2,
        }}
      >
        <Typography variant="h4">Transactions</Typography>

        {selectedPlanner && (
          <Box gap={1} sx={{ display: { xs: "none", md: "flex" } }}>
            {actions.map(
              ({ title, open, variant, setOpen, component }, index) => (
                <SwipeableTemporaryDrawer
                  key={index}
                  buttonLabel={title}
                  buttonVariant={variant}
                  anchor="right"
                  open={open}
                  onToggle={(open) => setOpen(open)}
                >
                  <Box
                    padding={3}
                    width={350}
                    display="flex"
                    flexDirection="column"
                  >
                    {component}
                  </Box>
                </SwipeableTemporaryDrawer>
              )
            )}
          </Box>
        )}
      </Box>
      {selectedPlanner && (
        <SpeedDial
          ariaLabel="SpeedDial basic example"
          sx={{
            display: { md: "none" },
            position: "absolute",
            bottom: 16,
            left: {
              xs: 16,
              sm: "calc(240px + 24px)",
            },
          }}
          icon={<SpeedDialIcon />}
        >
          {actions.map(({ title, icon, setOpen }) => (
            <SpeedDialAction
              key={title}
              icon={icon}
              tooltipTitle={title}
              onClick={() => setOpen(true)}
            />
          ))}
        </SpeedDial>
      )}

      <Box
        sx={{
          height: {
            xs: "calc(100vh - 320px)",
            sm: "calc(100vh - 340px)",
            md: "calc(100vh - 200px)",
          },
          width: "100%",
        }}
      >
        <Stack
          sx={{
            flexDirection: { xs: "column", md: "row" },
            gap: 1,
            width: "100%",
            mb: 1,
          }}
          alignItems="flex-start"
          columnGap={1}
        >
          <Chip
            label="Group by year"
            onClick={() => setRowGroupingModel(["year"])}
            variant={rowGroupingModelStr === "year" ? "filled" : "outlined"}
          />
          <Chip
            label="Group by year and month"
            onClick={() => setRowGroupingModel(["year", "month"])}
            variant={
              rowGroupingModelStr === "year-month" ? "filled" : "outlined"
            }
          />
        </Stack>
        <DataGridPremium
          checkboxSelection
          rowGroupingModel={rowGroupingModel}
          density="compact"
          apiRef={apiRef}
          rows={stateTransactions}
          columns={columns}
          experimentalFeatures={{ newEditingApi: true, aggregation: true }}
          initialState={initialState}
          editMode="row"
          components={{
            Toolbar: GridToolbar,
            NoRowsOverlay: selectedPlanner
              ? GridNoRowsOverlay
              : NoPlannerOverlay,
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
      </Box>
    </>
  );
}

export default Transactions;
