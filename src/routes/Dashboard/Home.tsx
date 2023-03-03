import { Box, Container, Flex, Group, Text, Title } from "@mantine/core";

type Props = {};

function Home({}: Props) {
  return (
    <>
      <Container size="md">
        <Flex justify="space-between">
          <Box>
            <Title order={1}>Dashboard</Title>
            <Text color="dimmed">Welcome back!</Text>
          </Box>
        </Flex>
      </Container>
    </>
  );
}

export default Home;
