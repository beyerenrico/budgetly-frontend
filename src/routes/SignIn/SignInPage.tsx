import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "../../api";
import { useTokenStore, useActiveUserStore } from "../../stores";

import jwt_decode from "jwt-decode";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Notification,
  Space,
  TextInput,
  Title,
} from "@mantine/core";

type Props = {};

function SignInPage({}: Props) {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length > 5 ? null : "Password must be at least 6 characters long",
    },
  });

  const navigation = useNavigate();
  const location = useLocation();
  const [visible, { toggle }] = useDisclosure(false);

  const { setTokens } = useTokenStore((state) => ({
    setTokens: state.setTokens,
  }));

  const { setActiveUser } = useActiveUserStore((state) => ({
    setActiveUser: state.setActiveUser,
  }));

  const handleSubmit = async (values: typeof form.values) => {
    toggle();
    await api.authentication.signIn(values).then((res) => {
      const { sub, email } = jwt_decode(res.accessToken) as ActiveUserData;

      notifications.show({
        title: "Success",
        message: "You have been signed in",
        color: "green",
        icon: <IconCheck />,
      });

      setActiveUser({ sub, email });
      setTokens(res);
      navigation("/", {
        state: {
          code: 200,
          message: "You have been signed in",
          _isRedirect: true,
        },
      });
    });
  };

  return (
    <Container sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Box w={400} mx="auto">
        <Box sx={{ textAlign: "center" }}>
          {location.state?.message && location.state?.code && (
            <Notification
              icon={
                location.state.code === 200 ? (
                  <IconCheck size="1.1rem" />
                ) : (
                  <IconX size="1.1rem" />
                )
              }
              color={location.state.code === 200 ? "green" : "red"}
              sx={{ marginBottom: 16 }}
              withCloseButton={false}
            >
              {location.state.message}
            </Notification>
          )}
          <Title order={1}>Sign in to your account</Title>
          <Title order={6}>
            Or{" "}
            <Link style={{ textDecoration: "none" }} to="/auth/sign-up">
              create a new one
            </Link>
          </Title>
        </Box>
        <Space h="xl" />
        <form
          onSubmit={form.onSubmit((values) => handleSubmit(values))}
          style={{
            position: "relative",
            padding: 16,
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <LoadingOverlay visible={visible} overlayBlur={2} />
          <TextInput
            withAsterisk
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />
          <Space h="sm" />
          <TextInput
            withAsterisk
            label="Password"
            placeholder="********"
            type="password"
            {...form.getInputProps("password")}
          />

          <Group position="right" mt="md">
            <Button type="submit">Login</Button>
          </Group>
        </form>
      </Box>
    </Container>
  );
}

export default SignInPage;
