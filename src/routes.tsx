import { createBrowserRouter } from "react-router-dom";
import Layout, { rootLoader } from "./routes/Root";
import Home, { homeLoader } from "./routes/Dashboard/Home";
import Transactions, {
  transactionsLoader,
} from "./routes/Transactions/TransactionsPage";
import Categories, {
  categoriesLoader,
} from "./routes/Categories/CategoriesPage";
import Planners, { plannersLoader } from "./routes/Planners/PlannersPage";
import Contracts, { contractsLoader } from "./routes/Contracts/ContractsPage";

const ErrorBoundary = () => {
  return <div>404</div>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    loader: rootLoader,
    errorElement: <ErrorBoundary />,
    children: [
      { path: "/", element: <Home />, loader: homeLoader },
      {
        path: "/planners",
        element: <Planners />,
        loader: plannersLoader,
      },
      {
        path: "/transactions",
        element: <Transactions />,
        loader: transactionsLoader,
      },
      {
        path: "/categories",
        element: <Categories />,
        loader: categoriesLoader,
      },
      {
        path: "/contracts",
        element: <Contracts />,
        loader: contractsLoader,
      },
      { path: "*", element: <ErrorBoundary /> },
    ],
  },
]);

export default router;
