import {
  Container,
  Flex,
  MediaQuery,
  Space,
  Spoiler,
  Text,
  Title,
} from "@mantine/core";

import { createBrowserRouter, redirect, useRouteError } from "react-router-dom";

import jwt_decode from "jwt-decode";

import { useTokenStore } from "./stores";

import Root from "./routes/Root";
import Home from "./routes/Dashboard/Home";
import Reports, { reportsLoader } from "./routes/Reports/ReportsPage";
import SignInPage from "./routes/SignIn/SignInPage";
import SignUpPage from "./routes/SignUp/SignUpPage";
import Transactions, {
  transactionsLoader,
} from "./routes/Transactions/TransactionsPage";
import Accounts, { accountsLoader } from "./routes/Accounts/AccountsPage";
import Categories, {
  categoriesLoader,
} from "./routes/Categories/CategoriesPage";
import Contracts, { contractsLoader } from "./routes/Contracts/ContractsPage";
import AddAccount, { addAccountsLoader } from "./routes/Accounts/AddAccount";
import RequisitionResults, {
  requisitionsResultsLoader,
} from "./routes/Accounts/RequisitionResults";
import Account, { accountLoader } from "./routes/Accounts/AccountPage";

const ErrorBoundary = () => {
  let error = useRouteError();

  return (
    <>
      <MediaQuery largerThan="md" styles={{ height: "500px" }}>
        <Flex align="center" sx={{ height: "100%" }}>
          <Container size="sm" sx={{ borderLeft: "4px solid #C1C2C5" }}>
            <Title order={1}>Something went wrong 😵</Title>
            <Space h="md" />
            <Text color="dimmed">
              There seems to be an issue on our side. We are already working on
              it! Please try again later and sorry for the inconvenience.
            </Text>
            <Space h="md" />
            <Spoiler
              showLabel="Show error details"
              hideLabel="Hide"
              maxHeight={0}
            >
              <Text sx={{ fontFamily: "monospace" }}>
                {error?.message ?? "No error message"}
              </Text>
            </Spoiler>
          </Container>
        </Flex>
      </MediaQuery>
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: () => {
      const { accessToken } = useTokenStore.getState().tokens;
      const { setTokens } = useTokenStore.getState();

      if (!accessToken) {
        return redirect("/auth/sign-in");
      }

      const decodedToken = jwt_decode(accessToken) as {
        exp: number;
      };

      let currentDate = new Date();

      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        setTokens({ accessToken: "", refreshToken: "" });
        return redirect("/auth/sign-in?expired=true");
      }

      return null;
    },
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorBoundary />,
      },
      {
        path: "reports",
        element: <Reports />,
        errorElement: <ErrorBoundary />,
        loader: reportsLoader,
      },
      {
        path: "transactions",
        element: <Transactions />,
        errorElement: <ErrorBoundary />,
        loader: transactionsLoader,
      },
      {
        path: "categories",
        element: <Categories />,
        errorElement: <ErrorBoundary />,
        loader: categoriesLoader,
      },
      {
        path: "contracts",
        element: <Contracts />,
        errorElement: <ErrorBoundary />,
        loader: contractsLoader,
      },
      {
        path: "accounts/add/requisitions",
        element: <RequisitionResults />,
        errorElement: <ErrorBoundary />,
        loader: requisitionsResultsLoader,
      },
      {
        path: "accounts/add",
        element: <AddAccount />,
        errorElement: <ErrorBoundary />,
        loader: addAccountsLoader,
      },
      {
        path: "accounts/:accountId",
        element: <Account />,
        errorElement: <ErrorBoundary />,
        loader: async ({ params }) => {
          return accountLoader(params.accountId!);
        },
      },
      {
        path: "accounts",
        element: <Accounts />,
        errorElement: <ErrorBoundary />,
        loader: accountsLoader,
      },
      { path: "*" },
    ],
  },
  {
    path: "/auth",
    loader: () => {
      const { accessToken } = useTokenStore.getState().tokens;

      if (accessToken) {
        return redirect("/");
      }

      return null;
    },
    children: [
      {
        path: "sign-up",
        element: <SignUpPage />,
      },
      {
        path: "sign-in",
        element: <SignInPage />,
      },
      {
        path: "*",
        loader: () => {
          return redirect("/auth/sign-in");
        },
      },
    ],
  },
]);

export default router;
