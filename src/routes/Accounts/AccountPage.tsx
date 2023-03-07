import { useCallback, useEffect, useState } from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { useLoaderData } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Flex,
  Group,
  LoadingOverlay,
  Space,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import sortBy from "lodash/sortBy";
import moment from "moment";

import api from "../../api";
import { useActiveUserStore } from "../../stores";

type Props = {};

export async function accountLoader(accountId: string) {
  return {
    account: await api.accounts.findOne(accountId),
  };
}

function Account({}: Props) {
  const { account } = useLoaderData() as {
    account: Account;
  };

  const { activeUser } = useActiveUserStore((state) => ({
    activeUser: state.activeUser,
  }));

  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "valueDate",
    direction: "desc",
  });
  const [records, setRecords] = useState(
    sortBy(account?.transactions, "valueDate")
  );
  const [loading, setLoading] = useStateWithCallbackLazy(false);
  const [data, setData] = useState<Account>(account);

  const getTransactions = fetchTransactionsFromApi(
    setLoading,
    account,
    activeUser
  );

  const getBalances = fetchBalancesFromApi(setLoading, account, activeUser);
  const getDetails = fetchDetailsFromApi(setLoading, account, activeUser);

  useEffect(() => {
    const data = sortBy(account?.transactions, sortStatus.columnAccessor);
    setRecords(sortStatus.direction === "desc" ? data.reverse() : data);
  }, [sortStatus]);

  return (
    <Container size="xl">
      <LoadingOverlay visible={loading} />
      <Flex justify="space-between">
        <Title order={1}>Account</Title>
        <Group>
          <Button onClick={getDetails}>Fetch Details</Button>
          <Button onClick={getBalances}>Fetch Balances</Button>
          <Button onClick={getTransactions}>Fetch transactions</Button>
        </Group>
      </Flex>
      <Space h="xl" />
      <Title order={2}>Balances</Title>
      <Space h="md" />
      <Group>
        <Card shadow="sm" withBorder>
          <Flex justify="space-between">
            <Stack spacing="xs">
              <Title order={6} sx={{ marginBottom: "-10px" }}>
                Current Balance
              </Title>
              {account?.balances?.length && (
                <>
                  <Title order={2}>
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }).format(
                      parseFloat(
                        account.balances?.filter(
                          (balance) =>
                            balance.balanceType === "closingBooked" ||
                            balance.balanceType === "interimBooked"
                        )[0]?.balanceAmount
                      )
                    )}
                  </Title>
                  <Text color="dimmed">
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: "EUR",
                    }).format(
                      parseFloat(
                        account.balances?.filter(
                          (balance) =>
                            balance.balanceType === "interimAvailable"
                        )[0]?.balanceAmount
                      )
                    )}{" "}
                    incl. prebooked transactions
                  </Text>
                </>
              )}
            </Stack>
          </Flex>
        </Card>
      </Group>
      <Space h="xl" />
      <Title order={2}>Transactions</Title>
      <Space h="md" />
      <DataTable
        height={800}
        withBorder
        withColumnBorders
        records={records}
        columns={[
          {
            accessor: "remittanceInformationUnstructured",
            title: "Description",
            ellipsis: true,
            render: (record, index) => {
              return record.remittanceInformationUnstructured
                ?.split(",")
                .join("\n");
            },
          },
          {
            accessor: "transactionAmount",
            title: "Amount",
            sortable: true,
            textAlignment: "right",
            render: (record) =>
              new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: record.transactionCurrency,
              }).format(parseFloat(record.transactionAmount)),
          },
          {
            accessor: "valueDate",
            textAlignment: "right",
            sortable: true,
            render: (record) => moment(record.valueDate).fromNow(),
          },
        ]}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </Container>
  );
}

export default Account;

function fetchTransactionsFromApi(
  setLoading: any,
  account: Account,
  activeUser: ActiveUserData | null
) {
  return useCallback(() => {
    setLoading(true, () => {
      const fetchTransactions = async () => {
        const tokens = await api.nordigen.getTokens();
        const { transactions } = await api.nordigen.getTransactions(
          tokens.access,
          account.id
        );

        if (!activeUser) return;

        Object.keys(transactions).forEach(async (key: "booked" | "pending") => {
          transactions[key].forEach(async (transaction) => {
            console.log(transaction);
            await api.transactions.create({
              transactionId: transaction.transactionId,
              account: account.id,
              user: activeUser.sub,
              status: key,
              bankTransactionCode: transaction.bankTransactionCode,
              bookingDate: transaction.bookingDate,
              valueDate: transaction.valueDate,
              transactionAmount: transaction.transactionAmount.amount,
              transactionCurrency: transaction.transactionAmount.currency,
              creditorAccountIban: transaction.creditorAccount?.iban,
              creditorAccountCurrency: transaction.creditorAccount?.currency,
              debtorAccountIban: transaction.debtorAccount?.iban,
              debtorAccountName: transaction.debtorName,
              remittanceInformationUnstructured:
                transaction.remittanceInformationUnstructured,
            });
          });
        });
      };

      fetchTransactions().then(() => setLoading(false, () => {}));
    });
  }, []);
}

function fetchBalancesFromApi(
  setLoading: any,
  account: Account,
  activeUser: ActiveUserData | null
) {
  return useCallback(() => {
    setLoading(true, () => {
      const fetchBalances = async () => {
        const tokens = await api.nordigen.getTokens();
        const { balances } = await api.nordigen.getBalances(
          tokens.access,
          account.id
        );

        if (!activeUser) return;

        await api.balances.removeAllByAccount(account.id);

        balances.forEach(async (balances) => {
          await api.balances.create({
            balanceAmount: balances.balanceAmount.amount,
            balanceCurrency: balances.balanceAmount.currency,
            balanceType: balances.balanceType,
            creditLimitIncluded: balances.creditLimitIncluded,
            account: account.id,
            user: activeUser.sub,
          });
        });
      };

      fetchBalances().then(() => setLoading(false, () => {}));
    });
  }, []);
}

function fetchDetailsFromApi(
  setLoading: any,
  account: Account,
  activeUser: ActiveUserData | null
) {
  return useCallback(() => {
    setLoading(true, () => {
      const fetchDetails = async () => {
        const tokens = await api.nordigen.getTokens();
        const result = await api.nordigen.getDetails(tokens.access, account.id);

        if (!activeUser) return;

        console.log(result);
      };

      fetchDetails().then(() => setLoading(false, () => {}));
    });
  }, []);
}
