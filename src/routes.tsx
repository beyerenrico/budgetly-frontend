import {
  createBrowserRouter,
  Navigate,
  redirect,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Root from "./routes/Root";
import Home, { homeLoader } from "./routes/Dashboard/Home";
import Transactions, {
  transactionsLoader,
} from "./routes/Transactions/TransactionsPage";
import Categories, {
  categoriesLoader,
} from "./routes/Categories/CategoriesPage";
import Planners, { plannersLoader } from "./routes/Planners/PlannersPage";
import Contracts, { contractsLoader } from "./routes/Contracts/ContractsPage";
import SignUpPage from "./routes/SignUp/SignUpPage";
import SignInPage from "./routes/SignIn/SignInPage";
import { useTokenStore } from "./stores";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: () => {
      const { accessToken } = useTokenStore.getState().tokens;

      if (!accessToken) {
        return redirect("/auth/sign-in");
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
