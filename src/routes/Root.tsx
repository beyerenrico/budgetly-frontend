import * as React from "react";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";

import {
  AppBar,
  Box,
  Collapse,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
} from "@mui/material";
import { Link, Outlet, useLoaderData, useLocation } from "react-router-dom";
import { grey } from "@mui/material/colors";
import api from "../api";

const drawerWidth = 240;

interface Props {}

export async function rootLoader() {
  const planners = await api.planners.findAll();
  const transactions = await api.transactions.findAll();
  const categories = await api.categories.findAll();
  return { planners, transactions, categories };
}

export default function Layout({}: Props) {
  const { planners, transactions, categories } = useLoaderData() as {
    planners: Planner[];
    transactions: Transaction[];
    categories: Category[];
  };

  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();

  const drawerMenu = [
    {
      title: "Dashboard",
      icon: <HomeIcon />,
      href: "/",
    },
    {
      title: "Planners",
      icon: <CalendarTodayIcon />,
      href: "/planners",
      children: planners.map((planner) => {
        return {
          title: planner.name,
          href: `/planners/${planner.id}`,
        };
      }),
    },
    {
      title: "Transactions",
      icon: <AccountBalanceIcon />,
      href: "/transactions",
      children: transactions.map((transaction) => {
        return {
          title: transaction.title,
          href: `/transactions/${transaction.id}`,
        };
      }),
    },
    {
      title: "Categories",
      icon: <CategoryIcon />,
      href: "/categories",
      children: categories.map((category) => {
        return {
          title: category.name,
          href: `/categories/${category.id}`,
        };
      }),
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar
        variant="dense"
        sx={{ backgroundColor: grey[100], color: theme.palette.primary.main }}
      >
        Budgetly
      </Toolbar>
      <Divider />
      <List>
        {drawerMenu.map(({ title, icon, href, children }, parentIndex) => (
          <Box key={parentIndex}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={href}
                selected={location.pathname === href}
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} />
              </ListItemButton>
            </ListItem>
            <Collapse in={location.pathname.startsWith(href)} unmountOnExit>
              {children &&
                children.map((child, childIndex) => (
                  <ListItem key={`${parentIndex}_${childIndex}`} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={child.href}
                      selected={location.pathname === child.href}
                      sx={{ pl: 9, color: grey[700] }}
                      dense
                    >
                      <ListItemText primary={child.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
              <Divider />
            </Collapse>
          </Box>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          backgroundColor: grey[100],
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderBottom: "1px solid",
          borderColor: grey[300],
        }}
      >
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          height: "100vh",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          pl: {
            xs: 1,
            sm: 3,
          },
          pr: {
            xs: 1,
            sm: 3,
          },
          pb: {
            xs: 1,
            sm: 3,
          },
          pt: {
            xs: 7,
            sm: 9,
          },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
