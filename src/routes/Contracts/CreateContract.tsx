import { forwardRef, useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Button, Group, FocusTrap, TextInput, LoadingOverlay, Drawer, Stepper, Title, Text, MultiSelect, Flex } from "@mantine/core";
import { useForm } from "@mantine/form";
import api from "../../api";
import { useActiveUserStore } from "../../stores";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { AxiosError } from "axios";

type Props = {
  transactions: Transaction[];
  onCreate: () => void;
};

function CreateContract({ transactions, onCreate }: Props) {
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [loadingVisible, { toggle: toggleLoading, close: closeLoading }] = useDisclosure(false);

  const data = transactions.map((transaction) => ({
    label: transaction.remittanceInformationUnstructured,
    value: transaction.id,
    amount: new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(parseFloat(transaction.transactionAmount)),
  }));

  const { activeUser } = useActiveUserStore((state) => ({
    activeUser: state.activeUser,
    setActiveUser: state.setActiveUser,
  }));

  const form = useForm({
    initialValues: {
      name: "",
      transactions: [],
      user: activeUser?.sub!,
    },

    validate: {
      name: (value) => (value.length ? null : "You must provide a name"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    toggleLoading();
    try {
      await api.contracts.create(values);

      notifications.show({
        title: "Success",
        message: "Contract created",
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

  const SelectItem = forwardRef<HTMLDivElement, typeof data>(({ label, amount, ...others }: typeof data, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <Text truncate w={300}>
          {label}
        </Text>
        <Text size="xs" color="dimmed">
          {amount}
        </Text>
      </Group>
    </div>
  ));

  return (
    <>
      <Drawer opened={modalOpened} onClose={closeModal} title="Create a new contract" position="right">
        <FocusTrap>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <LoadingOverlay visible={loadingVisible} overlayBlur={2} />
            <Stepper active={active} size="md" sx={{ marginTop: 16 }}>
              <Stepper.Step label="Transactions" description="Select the transactions of your new contract">
                <MultiSelect data={data} label="Transactions" placeholder="Pick transactions for your contract" itemComponent={SelectItem} dropdownPosition="bottom" />
                <Group position="right" mt="xl">
                  <Button onClick={nextStep}>Next step</Button>
                </Group>
              </Stepper.Step>
              <Stepper.Step label="Review" description="Please review the contract">
                <Text>Shows a form with a predefined name, the recurring pattern and gives the user the option to change it</Text>
                <Group mt="xl" sx={{ justifyContent: "space-between" }}>
                  <Button variant="default" onClick={prevStep}>
                    Back
                  </Button>
                  <Button type="submit">Create contract</Button>
                </Group>
              </Stepper.Step>
              <Stepper.Completed>
                <Title order={3}>Contract created</Title>
              </Stepper.Completed>
            </Stepper>
          </form>
        </FocusTrap>
      </Drawer>

      <Group position="center">
        <Button onClick={openModal}>Create Contract</Button>
      </Group>
    </>
  );
}

export default CreateContract;
