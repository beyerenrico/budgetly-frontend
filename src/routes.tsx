import { createBrowserRouter, redirect, useRouteError } from "react-router-dom";
import jwt_decode from "jwt-decode";

import Root from "./routes/Root";
import Home from "./routes/Dashboard/Home";
import SignUpPage from "./routes/SignUp/SignUpPage";
import SignInPage from "./routes/SignIn/SignInPage";
import Cards, { cardsLoader } from "./routes/Cards/CardsPage";
import Transactions, {
  transactionsLoader,
} from "./routes/Transactions/TransactionsPage";
import Categories, {
  categoriesLoader,
} from "./routes/Categories/CategoriesPage";
import Reports, { reportsLoader } from "./routes/Reports/ReportsPage";
import Contracts, { contractsLoader } from "./routes/Contracts/ContractsPage";

import { useTokenStore } from "./stores";
import {
  Container,
  Flex,
  MediaQuery,
  Space,
  Spoiler,
  Text,
  Title,
} from "@mantine/core";

const ErrorBoundary = () => {
  let error = useRouteError();
  console.log(error);

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
        path: "cards",
        element: <Cards />,
        errorElement: <ErrorBoundary />,
        loader: cardsLoader,
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
