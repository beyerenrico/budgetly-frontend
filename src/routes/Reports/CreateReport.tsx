import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  Button,
  Group,
  FocusTrap,
  TextInput,
  LoadingOverlay,
  Textarea,
  Space,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import api from "../../api";
import { useActiveUserStore } from "../../stores";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { AxiosError } from "axios";

type Props = {
  onCreate: () => void;
};

function CreateReport({ onCreate }: Props) {
  const { activeUser } = useActiveUserStore((state) => ({
    activeUser: state.activeUser,
    setActiveUser: state.setActiveUser,
  }));
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [loadingVisible, { toggle: toggleLoading, close: closeLoading }] =
    useDisclosure(false);
  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: (value) => (value.length ? null : "You must provide a name"),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    toggleLoading();
    try {
      await api.reports.create({ user: activeUser?.sub!, ...values });

      notifications.show({
        title: "Success",
        message: "Report created",
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
        title="Create a new report"
      >
        <FocusTrap>
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <LoadingOverlay visible={loadingVisible} overlayBlur={2} />
            <TextInput
              withAsterisk
              label="Name"
              placeholder="My report"
              {...form.getInputProps("name")}
            />
            <Space h="md" />
            <Textarea
              label="Description"
              placeholder="This is my report"
              {...form.getInputProps("description")}
            />
            <Group position="right" mt="md">
              <Button type="submit">Create</Button>
            </Group>
          </form>
        </FocusTrap>
      </Modal>

      <Group position="center">
        <Button onClick={openModal}>Create Report</Button>
      </Group>
    </>
  );
}

export default CreateReport;
