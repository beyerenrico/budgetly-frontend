import { useCallback } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Menu,
  rem,
  Space,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDots, IconTrash, IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import api from "../../api";

type Props = {
  id: string;
  name: string;
  onDelete: (id: string) => void;
};

function SingleContract({ id, name, onDelete }: Props) {
  const handleDelete = useCallback(async () => {
    try {
      await api.contracts.remove(id);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "You can't delete a contract with transactions",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    notifications.show({
      title: "Success",
      message: "Contract deleted",
      color: "green",
      icon: <IconCheck />,
    });

    onDelete(id);
  }, [id]);

  return (
    <Card shadow="sm" padding="lg" radioGroup="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Text weight={500}>{name}</Text>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon>
                <IconDots size="1rem" />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                icon={<IconTrash size={rem(14)} />}
                color="red"
                onClick={handleDelete}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Card.Section>
      <Space h="lg" />
      <Group sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Button component={Link} to={`/contracts/${id}`}>
          View
        </Button>
      </Group>
    </Card>
  );
}

export default SingleContract;
