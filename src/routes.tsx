import { createBrowserRouter } from "react-router-dom";
import Layout from "./routes/Root";
import Home, { homeLoader } from "./routes/Home";
import Transactions, { transactionsLoader } from "./routes/Transactions";
import Planners, { plannersLoader } from "./routes/Planners";

const ErrorBoundary = () => {
  return <div>404</div>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
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
      { path: "*", element: <ErrorBoundary /> },
    ],
  },
]);

export default router;
