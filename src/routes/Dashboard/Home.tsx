import { useLoaderData } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import api from "../../api";

type Props = {};

export async function homeLoader() {
  const planners = await api.planners.findAll();
  const transactions = await api.transactions.findAll();
  return { planners, transactions };
}

function Home({}: Props) {
  const { planners, transactions } = useLoaderData() as {
    planners: Planner[];
    transactions: Transaction[];
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
      </Box>
    </>
  );
}

export default Home;
