import * as React from "react";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import FolderIcon from "@mui/icons-material/Folder";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { IconCheck } from "@tabler/icons-react";

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
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Link,
  Location,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { grey } from "@mui/material/colors";
import { useActiveUserStore, useTokenStore } from "../stores";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

const drawerWidth = 240;

interface Props {}

export default function Root({}: Props) {
  const location = useLocation();
  const navigation = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const { setTokens } = useTokenStore((state) => ({
    setTokens: state.setTokens,
  }));

  const { setActiveUser } = useActiveUserStore((state) => ({
    setActiveUser: state.setActiveUser,
  }));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    setTokens({
      accessToken: "",
      refreshToken: "",
    });
    setActiveUser(null);
    navigation("/auth/sign-in");
    notifications.show({
      title: "Success",
      message: "You have been signed out",
      color: "green",
      icon: <IconCheck />,
    });
  };

  const drawer = RootDrawer(createDrawerMenu(), location);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          backgroundColor: grey[300],
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          borderBottom: "1px solid",
          borderColor: grey[300],
          borderRadius: 0,
          boxShadow: "none",
          color: grey[900],
        }}
      >
        <Toolbar variant="dense" sx={{ borderRadius: 0 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={{ display: { sm: "none" } }}>Budgetly</Typography>
          <Box sx={{ flexGrow: 0, ml: "auto" }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleLogout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
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
            borderRadius: 0,
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
            borderRadius: 0,
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
function RootDrawer(
  drawerMenu: (
    | {
        name: string;
        active: boolean;
        icon: JSX.Element;
        href: string;
        children?: undefined;
      }
    | {
        name: string;
        active: boolean;
        icon: JSX.Element;
        href: string;
        children: { name: string; href: string }[];
      }
  )[],
  location: Location
) {
  return (
    <div>
      <Toolbar
        variant="dense"
        sx={{ backgroundColor: grey[300], borderRadius: 0 }}
      >
        Budgetly
      </Toolbar>
      <Divider />
      <List>
        {drawerMenu.map(
          ({ name, active, icon, href, children }, parentIndex) => {
            if (active) {
              return (
                <Box key={parentIndex}>
                  <ListItem disablePadding>
                    <ListItemButton
                      component={Link}
                      to={href}
                      selected={location.pathname === href}
                    >
                      <ListItemIcon>{icon}</ListItemIcon>
                      <ListItemText primary={name} />
                    </ListItemButton>
                  </ListItem>
                  <Collapse
                    in={location.pathname.startsWith(href)}
                    unmountOnExit
                  >
                    {children &&
                      children.map((child, childIndex) => (
                        <ListItem
                          key={`${parentIndex}_${childIndex}`}
                          disablePadding
                        >
                          <ListItemButton
                            component={Link}
                            to={child.href}
                            selected={location.pathname === child.href}
                            sx={{ pl: 9, color: grey[700] }}
                            dense
                          >
                            <ListItemText primary={child.name} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    <Divider />
                  </Collapse>
                </Box>
              );
            }
          }
        )}
      </List>
    </div>
  );
}

function createDrawerMenu() {
  return [
    {
      name: "Dashboard",
      active: true,
      icon: <HomeIcon />,
      href: "/",
    },
    {
      name: "Cards",
      active: true,
      icon: <CreditCardIcon />,
      href: "/cards",
    },
    {
      name: "Transactions",
      active: true,
      icon: <AccountBalanceIcon />,
      href: "/transactions",
    },
    {
      name: "Contracts",
      active: true,
      icon: <FolderIcon />,
      href: "/contracts",
    },
    {
      name: "Reports",
      active: true,
      icon: <CalendarTodayIcon />,
      href: "/reports",
    },
    {
      name: "Categories",
      active: true,
      icon: <CategoryIcon />,
      href: "/categories",
    },
  ];
}
