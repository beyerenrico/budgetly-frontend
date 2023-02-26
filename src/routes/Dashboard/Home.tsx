import { useLoaderData } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import api from "../../api";

type Props = {};

export async function homeLoader() {
  const planners = await api.planners.findAll();
  const transactions = await api.transactions.findAll();
  const categories = await api.categories.findAll();
  const contracts = await api.contracts.findAll();
  return { planners, transactions, categories, contracts };
}

function Home({}: Props) {
  const { planners, transactions, categories, contracts } = useLoaderData() as {
    planners: Planner[];
    transactions: Transaction[];
    categories: Category[];
    contracts: Contract[];
  };

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Dashboard</Typography>
      </Box>
      <Box>
        <p>{JSON.stringify(planners)}</p>
        <p>{JSON.stringify(transactions)}</p>
        <p>{JSON.stringify(categories)}</p>
        <p>{JSON.stringify(contracts)}</p>
      </Box>
    </>
  );
}

export default Home;
