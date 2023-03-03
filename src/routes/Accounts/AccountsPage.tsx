import { useState } from "react";

import { useLoaderData } from "react-router-dom";

import api from "../../api";
import { Container, Flex, Grid, Space, Title } from "@mantine/core";
import SingleAccount from "./SingleAccount";
import CreateAccount from "./CreateAccount";

type Props = {};

export async function accountsLoader() {
  const accounts = await api.accounts.findAll();
  return { accounts };
}

function Accounts({}: Props) {
  const { accounts } = useLoaderData() as {
    accounts: Account[];
  };

  const [data, setData] = useState<Account[]>(accounts);

  const crudHandler = async () => {
    await accountsLoader().then((data) => setData(data.accounts));
  };

  return (
    <Container size="md">
      <Flex justify="space-between">
        <Title order={1}>Accounts</Title>
        <CreateAccount onCreate={crudHandler} />
      </Flex>
      <Space h="xl" />
      <Grid>
        {data.length === 0 && (
          <Grid.Col span={12}>
            <Title order={2}>No accounts found</Title>
          </Grid.Col>
        )}
        {data.map((account, index) => (
          <Grid.Col md={6} lg={4} key={index}>
            <SingleAccount {...account} onDelete={crudHandler} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default Accounts;
