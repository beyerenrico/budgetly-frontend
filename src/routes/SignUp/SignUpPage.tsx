import { Link, useLocation, useNavigate } from "react-router-dom";

import api from "../../api";

import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
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
import { useDisclosure } from "@mantine/hooks";
import { AxiosError } from "axios";

type Props = {};

function SignUpPage({}: Props) {
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length > 5 ? null : "Password must be at least 6 characters long",
      confirmPassword: (value) =>
        value.length > 5 ? null : "Password must be at least 6 characters long",
    },
  });

  const [visible, { toggle, close }] = useDisclosure(false);
  const navigation = useNavigate();
  const location = useLocation();

  const handleSubmit = async (values: typeof form.values) => {
    toggle();

    try {
      await api.authentication.signUp(values).then((res) => {
        notifications.show({
          title: "Success",
          message: "User profile created",
          color: "green",
          icon: <IconCheck />,
        });

        navigation("/auth/sign-in", {
          state: {
            code: 200,
            message: "Your user profile has been created. Please sign in.",
            _isRedirect: true,
          },
        });
      });
    } catch (error) {
      close();

      if (error instanceof AxiosError) {
        navigation(location.pathname, {
          state: {
            code: error.response?.status,
            message: error.response?.data.message,
            _isRedirect: true,
          },
        });

        return;
      }

      navigation(location.pathname, {
        state: {
          code: 500,
          message: "An error occured while signing in. Please try again later.",
          _isRedirect: true,
        },
      });
    }
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
          <Title order={1}>Create a new profile</Title>
          <Title order={6}>
            Or{" "}
            <Link style={{ textDecoration: "none" }} to="/auth/sign-in">
              sign in to an existing one
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
          <Space h="md" />
          <TextInput
            withAsterisk
            label="Password"
            placeholder="********"
            type="password"
            {...form.getInputProps("password")}
          />
          <Space h="md" />
          <TextInput
            withAsterisk
            label="Confirm Password"
            placeholder="********"
            type="password"
            {...form.getInputProps("confirmPassword")}
          />

          <Group position="right" mt="md">
            <Button type="submit">Submit</Button>
          </Group>
        </form>
      </Box>
    </Container>
  );
}

export default SignUpPage;
