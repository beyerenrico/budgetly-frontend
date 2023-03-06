import { useState } from "react";

import { Link, redirect, useLoaderData } from "react-router-dom";

import api from "../../api";
import { Button, Container, Flex, Grid, Space, Title } from "@mantine/core";
import SingleAccount from "./SingleAccount";

type Props = {};

export async function accountsLoader() {
  const accounts = await api.accounts.findAll();

  if (!accounts.length) {
    return redirect("/accounts/add");
  }

  return { accounts };
}

function Accounts({}: Props) {
  const { accounts } = useLoaderData() as {
    accounts: Account[];
  };

  const [data, setData] = useState<Account[]>(accounts);

  const crudHandler = async () => {
    await api.accounts.findAll().then((data) => setData(data));
  };

  return (
    <Container size="xl">
      <Flex justify="space-between">
        <Title order={1}>Accounts</Title>
        <Button component={Link} to="/accounts/add">
          Add account
        </Button>
      </Flex>
      <Space h="xl" />
      <Grid>
        {data.map((account, index) => (
          <Grid.Col md={6} key={index}>
            <SingleAccount {...account} onDelete={crudHandler} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default Accounts;
