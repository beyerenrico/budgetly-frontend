import {
  IconChevronRight,
  IconChevronLeft,
  IconSettings,
  IconDoorExit,
  IconCheck,
} from "@tabler/icons-react";
import {
  UnstyledButton,
  Group,
  Text,
  Box,
  useMantineTheme,
  rem,
  Menu,
} from "@mantine/core";
import { useActiveUserStore, useTokenStore } from "../stores";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

export function User() {
  const navigation = useNavigate();
  const theme = useMantineTheme();
  const { activeUser, setActiveUser } = useActiveUserStore((state) => ({
    activeUser: state.activeUser,
    setActiveUser: state.setActiveUser,
  }));

  const { setTokens } = useTokenStore((state) => ({
    setTokens: state.setTokens,
  }));

  const handleLogout = () => {
    setTokens({
      accessToken: "",
      refreshToken: "",
    });
    setActiveUser(null);
    navigation("/auth/sign-in", {
      state: {
        code: 200,
        message: "You have been signed out",
        _isRedirect: true,
      },
    });
    notifications.show({
      title: "Success",
      message: "You have been signed out",
      color: "green",
      icon: <IconCheck />,
    });
  };

  return (
    <Box
      sx={{
        paddingTop: theme.spacing.sm,
        borderTop: `${rem(1)} solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[4]
            : theme.colors.gray[2]
        }`,
      }}
    >
      <Menu shadow="md" width={200} position="right-end">
        <Menu.Target>
          <UnstyledButton
            sx={{
              display: "block",
              width: "100%",
              padding: theme.spacing.xs,
              borderRadius: theme.radius.sm,
              color:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[0]
                  : theme.black,

              "&:hover": {
                backgroundColor:
                  theme.colorScheme === "dark"
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              },
            }}
          >
            <Group>
              <Box sx={{ flex: 1 }}>
                <Text size="sm" weight={500}>
                  Logged in as
                </Text>
                <Text color="dimmed" size="xs">
                  {activeUser?.email}
                </Text>
              </Box>

              {theme.dir === "ltr" ? (
                <IconChevronRight size={rem(18)} />
              ) : (
                <IconChevronLeft size={rem(18)} />
              )}
            </Group>
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Profile</Menu.Label>
          <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>

          <Menu.Divider />

          <Menu.Item icon={<IconDoorExit size={14} />} onClick={handleLogout}>
            Sign out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
