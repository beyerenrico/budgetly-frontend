import { Container, Flex, Space, Title } from "@mantine/core";
import { redirect, useLoaderData } from "react-router-dom";
import api from "../../api";
import { useActiveUserStore } from "../../stores";

type Props = {};

export async function requisitionsResultsLoader() {
  const { activeUser } = useActiveUserStore.getState();

  if (!activeUser) return redirect("/auth/sign-in");

  const requisitionsFromDb = await api.requisitions.findAll();
  const tokens = await api.nordigen.getTokens();
  const requisitions = await requisitionsFromDb.map(async (requisition) => {
    return await api.nordigen.getRequisitions(tokens.access, requisition.id);
  });

  return { requisitions };
}

function RequisitionResults({}: Props) {
  const { requisitions } = useLoaderData() as {
    requisitions: Requisition[];
  };

  // TODO: Need to add a way to display messages in case of premeture redirect, due to error or user cancellation

  return (
    <Container size="xl" sx={{ position: "relative" }}>
      <Flex justify="space-between">
        <Title order={1}>Finishing the process</Title>
      </Flex>
      <Space h={60} />
    </Container>
  );
}

export default RequisitionResults;
