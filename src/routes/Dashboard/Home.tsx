import { Box, Typography } from "@mui/material";

type Props = {};

export async function homeLoader() {}

function Home({}: Props) {
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
    </>
  );
}

export default Home;
