import * as React from "react";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import {
  AppBar,
  Box,
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
import { Link, Outlet } from "react-router-dom";
import { grey } from "@mui/material/colors";

const drawerWidth = 240;

interface Props {}

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
  },
  {
    title: "Transactions",
    icon: <AccountBalanceIcon />,
    href: "/transactions",
  },
];

export default function Layout({}: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();

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
        {drawerMenu.map(({ title, icon, href }, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton component={Link} to={href}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
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
