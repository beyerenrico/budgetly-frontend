import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  Group,
  FocusTrap,
  TextInput,
  LoadingOverlay,
  Space,
  SegmentedControl,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import api from "../../api";
import { useActiveUserStore } from "../../stores";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { AxiosError } from "axios";
import { DateInput } from "@mantine/dates";

type Props = {
  accounts: Account[];
  categories: Category[];
  onCreate: () => void;
};

function CreateTransaction({ accounts, categories, onCreate }: Props) {
  const { activeUser } = useActiveUserStore((state) => ({
    activeUser: state.activeUser,
    setActiveUser: state.setActiveUser,
  }));
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [loadingVisible, { toggle: toggleLoading, close: closeLoading }] =
    useDisclosure(false);

  const form = useForm<TransactionCreate>({
    initialValues: {
      amount: "0",
      name: "",
      recipient: "",
      date: new Date(),
      category: categories[0].id,
      account: accounts[0].id,
      user: activeUser?.sub!,
    },

    validate: {
      name: (value) => (value.length ? null : "You must provide a name"),
      recipient: (value) =>
        value.length ? null : "You must provide a recipient",
      amount: (value) => (value ? null : "You must provide an amount"),
      date: (value) => (value ? null : "You must provide a date"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    toggleLoading();
    console.log(values);
    try {
      await api.transactions.create(values);

      notifications.show({
        title: "Success",
        message: "Transaction created",
        color: "green",
        icon: <IconCheck />,
      });

      closeModal();
      closeLoading();
      form.reset();
      onCreate();
    } catch (error) {
      closeLoading();

      if (error instanceof AxiosError) {
        notifications.show({
          title: "Error",
          message: error.response?.data.message,
          color: "red",
          icon: <IconX />,
        });

        return;
      }

      notifications.show({
        title: "Error",
        message: "An unexpected error occured. Please try again later.",
        color: "red",
        icon: <IconX />,
      });
    }
  };

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title="Create a new transaction"
      >
        <FocusTrap>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <LoadingOverlay visible={loadingVisible} overlayBlur={2} />
            <SegmentedControl
              data={[
                { label: "Income", value: "income" },
                { label: "Expense", value: "expense" },
              ]}
            />
            <TextInput
              icon={<span>€</span>}
              withAsterisk
              label="Amount"
              placeholder="0,00"
              step={0.01}
              type="number"
              {...form.getInputProps("amount")}
            />
            <Space h="sm" />
            <TextInput
              withAsterisk
              label="Name or Description"
              placeholder="My transaction"
              {...form.getInputProps("name")}
            />
            <Space h="sm" />
            <TextInput
              withAsterisk
              label="Sender"
              placeholder="John Doe"
              {...form.getInputProps("sender")}
            />
            <Space h="sm" />
            <TextInput
              withAsterisk
              label="Receiver"
              placeholder="John Doe"
              {...form.getInputProps("receiver")}
            />
            <Space h="sm" />
            <DateInput
              withAsterisk
              label="Date"
              valueFormat="DD.MM.YYYY"
              placeholder="01.01.1970"
              {...form.getInputProps("date")}
            />
            <Space h="sm" />
            <Group position="right" mt="md">
              <Button type="submit">Create</Button>
            </Group>
          </form>
        </FocusTrap>
      </Modal>

      <Group position="center">
        <Button onClick={openModal}>Create Transaction</Button>
      </Group>
    </>
  );
}

export default CreateTransaction;
