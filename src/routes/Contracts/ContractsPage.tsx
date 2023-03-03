import { useState } from "react";

import { useLoaderData } from "react-router-dom";

import api from "../../api";
import { Container, Flex, Grid, Space, Title } from "@mantine/core";
import SingleContract from "./SingleContract";
import CreateContract from "./CreateContract";

type Props = {};

export async function contractsLoader() {
  const contracts = await api.contracts.findAll();
  return { contracts };
}

function Contracts({}: Props) {
  const { contracts } = useLoaderData() as {
    contracts: Contract[];
  };

  const [data, setData] = useState<Contract[]>(contracts);

  const crudHandler = async () => {
    await contractsLoader().then((data) => setData(data.contracts));
  };

  return (
    <Container size="md">
      <Flex justify="space-between">
        <Title order={1}>Contracts</Title>
        <CreateContract onCreate={crudHandler} />
      </Flex>
      <Space h="xl" />
      <Grid>
        {data.length === 0 && (
          <Grid.Col span={12}>
            <Title order={2}>No contracts found</Title>
          </Grid.Col>
        )}
        {data.map((contract, index) => (
          <Grid.Col md={6} lg={4} key={index}>
            <SingleContract {...contract} onDelete={crudHandler} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default Contracts;
