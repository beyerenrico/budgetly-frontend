import { Container, Flex, Space, Title } from "@mantine/core";
import { useEffect } from "react";
import {
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import api from "../../api";
import { useActiveUserStore } from "../../stores";

type Props = {};

export async function requisitionsResultsLoader() {
  const reference = window.location.search.split("=")[1];
  const { activeUser } = useActiveUserStore.getState();

  if (!activeUser) return redirect("/auth/sign-in");

  const requisitionFromDb = await api.requisitions.findOne(reference);

  // const tokens = await api.nordigen.getTokens();
  // const requisitions = await requisitionsFromDb.map(async (requisition) => {
  //   return await api.nordigen.getRequisitions(tokens.access, requisition.id);
  // });

  return { activeUser, requisitionFromDb };
}

function RequisitionResults({}: Props) {
  const navigation = useNavigate();
  const { activeUser, requisitionFromDb } = useLoaderData() as {
    activeUser: ActiveUserData;
    requisitionFromDb: Requisition;
  };

  useEffect(() => {
    const fetchRequisitionDetails = async () => {
      const tokens = await api.nordigen.getTokens();
      const requisition = await api.nordigen.getRequisitions(
        tokens.access,
        requisitionFromDb.requisition
      );

      requisition.accounts.forEach(async (account) => {
        const details = await api.nordigen.getAccounts(tokens.access, account);
        const newAccount = await api.accounts.create({
          id: details.id,
          iban: details.iban,
          institution: details.institution_id,
          requisition: requisitionFromDb.id,
          user: activeUser.sub,
        });

        const { balances } = await api.nordigen.getBalances(
          tokens.access,
          newAccount.id
        );

        if (!activeUser) return;

        await api.balances.removeAllByAccount(newAccount.id);

        balances.forEach(async (balances) => {
          await api.balances.create({
            balanceAmount: balances.balanceAmount.amount,
            balanceCurrency: balances.balanceAmount.currency,
            balanceType: balances.balanceType,
            creditLimitIncluded: balances.creditLimitIncluded,
            account: newAccount.id,
            user: activeUser.sub,
          });
        });

        const { transactions } = await api.nordigen.getTransactions(
          tokens.access,
          newAccount.id
        );

        if (!activeUser) return;

        Object.keys(transactions).forEach(async (key: "booked" | "pending") => {
          transactions[key].forEach(async (transaction) => {
            await api.transactions.create({
              transactionId: transaction.transactionId,
              account: newAccount.id,
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

        navigation(`/accounts/${newAccount.id}`);
      });
    };
    fetchRequisitionDetails();
  }, [requisitionFromDb]);

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
