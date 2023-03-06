import { useCallback } from "react";
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Menu,
  rem,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconDots, IconTrash, IconX } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import api from "../../api";

type Props = {
  id: string;
  iban: string;
  balances?: Balance[];
  onDelete: (id: string) => void;
};

function SingleAccount({ id, iban, balances, onDelete }: Props) {
  const prettyIban = iban.match(/.{1,4}/g)?.join(" ");

  const handleDelete = useCallback(async () => {
    try {
      await api.accounts.remove(id);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "You can't delete a account with transactions",
        color: "red",
        icon: <IconX />,
      });
      return;
    }

    notifications.show({
      title: "Success",
      message: "Account deleted",
      color: "green",
      icon: <IconCheck />,
    });

    onDelete(id);
  }, [id]);

  return (
    <Card shadow="sm" padding="lg" radioGroup="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group position="apart">
          <Text weight={500}>{prettyIban ?? iban}</Text>
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
      <Stack>
        <Title order={2} sx={{ marginBottom: "-20px" }}>
          {new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(
            parseFloat(
              balances?.filter(
                (balance) => balance.balanceType === "closingBooked"
              )[0].balanceAmount!
            )
          )}
        </Title>
        <Text color="dimmed">
          {new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
          }).format(
            parseFloat(
              balances?.filter(
                (balance) => balance.balanceType === "interimAvailable"
              )[0].balanceAmount!
            )
          )}{" "}
          incl. prebooked transactions
        </Text>
      </Stack>
      <Space h="lg" />
      <Group sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Button component={Link} to={`/accounts/${id}`}>
          View
        </Button>
      </Group>
    </Card>
  );
}

export default SingleAccount;
