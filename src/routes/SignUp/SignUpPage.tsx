import { Link, useNavigate } from "react-router-dom";

import api from "../../api";

import { IconCheck } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useForm } from "@mantine/form";
import {
  Box,
  Button,
  Container,
  Group,
  Space,
  TextInput,
  Title,
} from "@mantine/core";

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

  const navigation = useNavigate();

  const handleSubmit = async (values: typeof form.values) => {
    await api.authentication.signUp(values).then((res) => {
      notifications.show({
        title: "Success",
        message: "User profile created",
        color: "green",
        icon: <IconCheck />,
      });

      navigation("/auth/sign-in");
    });
  };

  return (
    <Container sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Box w={400} mx="auto">
        <Box sx={{ textAlign: "center" }}>
          <Title order={1}>Create a new profile</Title>
          <Title order={6}>
            Or{" "}
            <Link style={{ textDecoration: "none" }} to="/auth/sign-in">
              sign in to an existing one
            </Link>
          </Title>
        </Box>
        <Space h="xl" />
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
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
