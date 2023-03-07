import { useEffect, useState } from "react";

import { useLoaderData } from "react-router-dom";

import api from "../../api";

import { Container, Flex, Space, Title } from "@mantine/core";
import CreateTransaction from "./CreateTransaction";
import { useActiveUserStore } from "../../stores";

type Props = {};

export async function transactionsLoader() {
  const accounts = await api.accounts.findAll();
  const categories = await api.categories.findAll();
  const transactions = await api.transactions.findAll();

  return { accounts, categories, transactions };
}

function Transactions({}: Props) {
  const { accounts, categories, transactions } = useLoaderData() as {
    accounts: Category[];
    categories: Category[];
    transactions: Transaction[];
  };

  const [data, setData] = useState<Transaction[]>(transactions);
  const { activeUser } = useActiveUserStore((state) => ({
    activeUser: state.activeUser,
    setActiveUser: state.setActiveUser,
  }));

  useEffect(() => {
    setData(transactions);
  }, [transactions]);

  const crudHandler = async () => {
    await transactionsLoader().then((data) => setData(data.transactions));
  };

  return (
    <>
      <Container size="xl">
        <Flex justify="space-between">
          <Title order={1}>Transactions</Title>
          <CreateTransaction
            accounts={accounts}
            categories={categories}
            onCreate={crudHandler}
          />
        </Flex>
        <Space h="xl" />
      </Container>
    </>
  );
}

export default Transactions;
