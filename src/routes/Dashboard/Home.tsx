import { Box, Title } from "@mantine/core";

type Props = {};

function Home({}: Props) {
  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Title order={1}>Dashboard</Title>
      </Box>
    </>
  );
}

export default Home;
