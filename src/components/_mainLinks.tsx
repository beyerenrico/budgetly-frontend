import React from "react";
import {
  IconGitPullRequest,
  IconAlertCircle,
  IconMessages,
  IconDatabase,
  IconCalendar,
  IconCategory,
  IconCreditCard,
  IconFolder,
  IconHome,
  IconMoneybag,
} from "@tabler/icons-react";
import { ThemeIcon, UnstyledButton, Group, Text } from "@mantine/core";
import { Link } from "react-router-dom";

interface MainLinkProps {
  icon: React.ReactNode;
  color: string;
  label: string;
  href: string;
}

function MainLink({ icon, color, label, href }: MainLinkProps) {
  return (
    <UnstyledButton
      sx={(theme) => ({
        display: "block",
        width: "100%",
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color:
          theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

        "&:hover": {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
        },
      })}
    >
      <Link to={href} style={{ textDecoration: "none", color: "#9a9a9a" }}>
        <Group>
          <ThemeIcon color={color} variant="light">
            {icon}
          </ThemeIcon>

          <Text size="sm">{label}</Text>
        </Group>
      </Link>
    </UnstyledButton>
  );
}

const data: MainLinkProps[] = [
  {
    icon: <IconHome size="1rem" />,
    color: "blue",
    label: "Dashboard",
    href: "/",
  },
  {
    icon: <IconCreditCard size="1rem" />,
    color: "teal",
    label: "Cards",
    href: "/cards",
  },
  {
    icon: <IconMoneybag size="1rem" />,
    color: "violet",
    label: "Transactions",
    href: "/transactions",
  },
  {
    icon: <IconFolder size="1rem" />,
    color: "grape",
    label: "Contracts",
    href: "/contracts",
  },
  {
    icon: <IconCalendar size="1rem" />,
    color: "orange",
    label: "Reports",
    href: "/reports",
  },
  {
    icon: <IconCategory size="1rem" />,
    color: "red",
    label: "Categories",
    href: "/categories",
  },
];

export function MainLinks() {
  const links = data.map((link) => <MainLink {...link} key={link.label} />);
  return <div>{links}</div>;
}
