import { createBrowserRouter, redirect } from "react-router-dom";
import Root from "./routes/Root";
import Home from "./routes/Dashboard/Home";
import Transactions, {
  transactionsLoader,
} from "./routes/Transactions/TransactionsPage";
import Categories, {
  categoriesLoader,
} from "./routes/Categories/CategoriesPage";
import Reports, { reportsLoader } from "./routes/Reports/ReportsPage";
import Contracts, { contractsLoader } from "./routes/Contracts/ContractsPage";
import SignUpPage from "./routes/SignUp/SignUpPage";
import SignInPage from "./routes/SignIn/SignInPage";
import { useTokenStore } from "./stores";
import jwt_decode from "jwt-decode";

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
        loader: homeLoader,
      },
      {
        path: "planners",
        element: <Planners />,
        loader: plannersLoader,
      },
      {
        path: "transactions",
        element: <Transactions />,
        loader: transactionsLoader,
      },
      {
        path: "categories",
        element: <Categories />,
        loader: categoriesLoader,
      },
      {
        path: "contracts",
        element: <Contracts />,
        loader: contractsLoader,
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
