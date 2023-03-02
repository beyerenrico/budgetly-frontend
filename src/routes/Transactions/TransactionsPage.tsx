import {
  DataGridPremium,
  GridActionsCellItem,
  GridColumns,
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
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CategoryIcon from "@mui/icons-material/Category";
import FolderIcon from "@mui/icons-material/Folder";

import { useEffect, useMemo, useState } from "react";

import { useLoaderData, useNavigate } from "react-router-dom";

import moment from "moment";

import api from "../../api";
import { useActiveUserStore, useSelectedReportStore } from "../../stores";
import NewCategory from "../Categories/NewCategory";
import NewContract from "../Contracts/NewContract";
import SwipeableTemporaryDrawer from "../../components/Drawer";

import NewTransaction from "./NewTransaction";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";

type Props = {};

const currencyFormatter = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: "EUR",
});

export async function transactionsLoader() {
  const reports = await api.reports.findAll();
  const categories = await api.categories.findAll();
  const contracts = await api.contracts.findAll();
  const transactions = await api.transactions.findAll();

  return { reports, categories, contracts, transactions };
}

function Transactions({}: Props) {
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const { reports, categories, contracts, transactions } = useLoaderData() as {
    reports: Report[];
    categories: Category[];
    contracts: Contract[];
    transactions: Transaction[];
  };

  const { activeUser } = useActiveUserStore((state) => ({
    activeUser: state.activeUser,
  }));

  const { selectedReport } = useSelectedReportStore((state) => ({
    selectedReport: state.report,
    setSelectedReport: state.setReport,
  }));

  const [stateTransactions, setStateTransactions] =
    useState<Transaction[]>(transactions);
  const [stateCategories, setStateCategories] =
    useState<Category[]>(categories);
  const [stateContracts, setStateContracts] = useState<Contract[]>(contracts);
  const [rowGroupingModel, setRowGroupingModel] = useState<string[]>([]);
  const [columnVisibilityModel] = useState<Record<string, boolean>>({
    month: false,
    year: false,
  });

  const [drawerOpenTransaction, setDrawerOpenTransaction] = useState(false);
  const [drawerOpenCategory, setDrawerOpenCategory] = useState(false);
  const [drawerOpenContract, setDrawerOpenContract] = useState(false);

  const [reportOptions] = useState(
    reports.map((report) => ({
      value: JSON.stringify(report),
      label: report.name,
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
      label: contract.name,
    }))
  );

  const rowGroupingModelStr = rowGroupingModel.join("-");

  const columns = createColumns(
    categoryOptions,
    contractOptions,
    selectedReport,
    setStateTransactions,
    reportOptions
  );

  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      columns: {
        columnVisibilityModel: columnVisibilityModel,
      },
      rowGrouping: {
        model: rowGroupingModel,
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
    await api.transactions.findAll().then((data) => {
      setStateTransactions(data);
    });
    setDrawerOpenTransaction(false);
    notifications.show({
      title: "Success",
      message: "Transaction created",
      color: "green",
      icon: <IconCheck />,
    });
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
    notifications.show({
      title: "Success",
      message: "Category created",
      color: "green",
      icon: <IconCheck />,
    });
  };

  const addHandlerContract = async () => {
    await transactionsLoader().then((data) => {
      setStateContracts(data.contracts);
      setContractOptions(
        data.contracts.map((contract) => ({
          value: JSON.stringify(contract),
          label: contract.name,
        }))
      );
    });
    setDrawerOpenContract(false);
    notifications.show({
      title: "Success",
      message: "Contract created",
      color: "green",
      icon: <IconCheck />,
    });
  };

  const actions: {
    name: string;
    open: boolean;
    variant: "contained" | "outlined";
    setOpen: (open: boolean) => void;
    icon: JSX.Element;
    component: JSX.Element;
  }[] = createActions(
    drawerOpenTransaction,
    setDrawerOpenTransaction,
    addHandlerTransaction,
    drawerOpenCategory,
    setDrawerOpenCategory,
    addHandlerCategory,
    drawerOpenContract,
    setDrawerOpenContract,
    addHandlerContract
  );

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
        sx={{
          mb: 2,
        }}
      >
        <Typography variant="h4">Transactions</Typography>

        <Box gap={1} sx={{ display: { xs: "none", md: "flex" } }}>
          {actions.map(({ name, open, variant, setOpen, component }, index) => (
            <SwipeableTemporaryDrawer
              key={index}
              buttonLabel={name}
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
          ))}
        </Box>
      </Box>
      <SpeedDial
        ariaLabel="Add new transaction, category or contract"
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
        {actions.map(({ name, icon, setOpen }) => (
          <SpeedDialAction
            key={name}
            icon={icon}
            tooltipTitle={name}
            onClick={() => setOpen(true)}
          />
        ))}
      </SpeedDial>

      <Box
        sx={{
          height: {
            xs: "calc(100vh - 205px)",
            sm: "calc(100vh - 235px)",
            md: "calc(100vh - 200px)",
          },
          width: "100%",
        }}
      >
        <Stack
          sx={{
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            width: "100%",
            mb: 1,
          }}
          alignItems="flex-start"
          columnGap={1}
        >
          <Chip
            label="Group by year"
            onClick={() =>
              setRowGroupingModel((prev) => (prev.length === 1 ? [] : ["year"]))
            }
            variant={rowGroupingModelStr === "year" ? "filled" : "outlined"}
          />
          <Chip
            label="Group by year and month"
            onClick={() =>
              setRowGroupingModel((prev) =>
                prev.length === 2 ? [] : ["year", "month"]
              )
            }
            variant={
              rowGroupingModelStr === "year-month" ? "filled" : "outlined"
            }
          />
        </Stack>
        <DataGridPremium
          checkboxSelection
          rowGroupingModel={rowGroupingModel}
          columnVisibilityModel={columnVisibilityModel}
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
            notifications.show({
              title: "Error",
              message: params.error.message,
              color: "red",
              icon: <IconCheck />,
            });
          }}
          processRowUpdate={async (newRow: Transaction) => {
            if (!activeUser) {
              notifications.show({
                title: "Error",
                message: "Access denied",
                color: "red",
                icon: <IconCheck />,
              });
              navigate("/auth/sign-in");
              throw new Error("Not logged in");
            }

            if (!newRow.id) throw new Error("No ID");

            if (typeof newRow.report === "string") {
              newRow.report = JSON.parse(newRow.report) as Report;
            }

            if (typeof newRow.category === "string") {
              newRow.category = JSON.parse(newRow.category) as Category;
            }

            if (typeof newRow.contract === "string") {
              newRow.contract = JSON.parse(newRow.contract) as Contract;
            }

            await api.transactions.update(newRow.id, {
              name: newRow.name,
              sender: newRow.sender,
              receiver: newRow.receiver,
              date: newRow.date,
              amount: newRow.amount,
              user: activeUser.sub,
              category: newRow.category?.id,
              contract: newRow.contract?.id,
            });

            notifications.show({
              title: "Success",
              message: "Transaction updated",
              color: "green",
              icon: <IconCheck />,
            });

            newRow.report = JSON.stringify(newRow.report);
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

function createActions(
  drawerOpenTransaction: boolean,
  setDrawerOpenTransaction: (open: boolean) => void,
  addHandlerTransaction: () => Promise<void>,
  drawerOpenCategory: boolean,
  setDrawerOpenCategory: (open: boolean) => void,
  addHandlerCategory: () => Promise<void>,
  drawerOpenContract: boolean,
  setDrawerOpenContract: (open: boolean) => void,
  addHandlerContract: () => Promise<void>
): {
  name: string;
  open: boolean;
  variant: "contained" | "outlined";
  setOpen: (open: boolean) => void;
  icon: JSX.Element;
  component: JSX.Element;
}[] {
  return [
    {
      name: "Add Transaction",
      open: drawerOpenTransaction,
      variant: "contained",
      setOpen: setDrawerOpenTransaction,
      icon: <AccountBalanceIcon />,
      component: <NewTransaction onAdd={addHandlerTransaction} />,
    },
    {
      name: "Add Category",
      open: drawerOpenCategory,
      variant: "outlined",
      setOpen: setDrawerOpenCategory,
      icon: <CategoryIcon />,
      component: <NewCategory onAdd={addHandlerCategory} />,
    },
    {
      name: "Add Contract",
      open: drawerOpenContract,
      variant: "outlined",
      setOpen: setDrawerOpenContract,
      icon: <FolderIcon />,
      component: <NewContract onAdd={addHandlerContract} />,
    },
  ];
}

function createColumns(
  categoryOptions: { value: string; label: string }[],
  contractOptions: { value: string; label: string }[],
  selectedReport: Report | null,
  setStateTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>,
  reportOptions: { value: string; label: string }[]
) {
  return useMemo<GridColumns<Transaction>>(
    () => [
      {
        field: "amount",
        headerName: "Amount",
        minWidth: 150,
        flex: 1,
        editable: true,
        type: "number",
        groupable: false,
        valueFormatter: ({ value }) => {
          return currencyFormatter.format(value);
        },
      },
      {
        field: "name",
        headerName: "Name",
        minWidth: 150,
        flex: 1,
        editable: true,
      },
      {
        field: "sender",
        headerName: "Sender",
        minWidth: 150,
        flex: 1,
        editable: true,
      },
      {
        field: "receiver",
        headerName: "Receiver",
        minWidth: 150,
        flex: 1,
        editable: true,
      },
      {
        field: "category",
        headerName: "Category",
        minWidth: 150,
        flex: 1,
        editable: true,
        type: "singleSelect",
        groupable: true,
        valueOptions: categoryOptions,
        valueFormatter: ({ value }) => {
          if (typeof value === "string") {
            return JSON.parse(value)?.name;
          }

          return value?.name;
        },
        groupingValueGetter: ({ value }) => {
          if (typeof value === "string") {
            return JSON.parse(value)?.name;
          }

          return value?.name;
        },
      },
      {
        field: "contract",
        headerName: "Contract",
        minWidth: 150,
        flex: 1,
        editable: true,
        type: "singleSelect",
        groupable: true,
        valueOptions: contractOptions,
        valueFormatter: ({ value }) => {
          if (typeof value === "string") {
            return JSON.parse(value)?.name;
          }

          return value?.name;
        },
        groupingValueGetter: ({ value }) => {
          if (typeof value === "string") {
            return JSON.parse(value)?.name;
          }

          return value?.name;
        },
      },
      {
        field: "date",
        headerName: "Date",
        minWidth: 150,
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
        minWidth: 150,
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
        minWidth: 150,
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
        field: "actions",
        type: "actions",
        width: 80,
        hideable: false,
        getActions: (params) => [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={async () => {
              if (!selectedReport) return;

              const rowElement = document.querySelector(
                `[role="row"][data-id="${params.id}"]`
              );

              rowElement?.setAttribute("data-deleting", "true");

              await api.transactions.remove(params.id as string);
              await api.transactions
                .findAllByReport(selectedReport?.id)
                .then((data) => {
                  setStateTransactions(data);
                });
            }}
          />,
        ],
      },
    ],
    [reportOptions, categoryOptions, contractOptions]
  );
}
