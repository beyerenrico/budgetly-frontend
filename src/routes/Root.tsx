import * as React from "react";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CategoryIcon from "@mui/icons-material/Category";
import FolderIcon from "@mui/icons-material/Folder";

import {
  AppBar,
  Box,
  Button,
  Chip,
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
import { useSelectedPlannerStore, useTokenStore } from "../stores";
import { useSnackbar } from "notistack";

const drawerWidth = 240;

interface Props {}

export default function Root({}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigation = useNavigate();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { setTokens } = useTokenStore((state) => ({
    setTokens: state.setTokens,
  }));

  const { selectedPlanner } = useSelectedPlannerStore((state) => ({
    selectedPlanner: state.planner,
  }));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    setTokens({
      accessToken: "",
      refreshToken: "",
    });
    navigation("/auth/sign-in");
    enqueueSnackbar("Successfully signed out", { variant: "success" });
  };

  const drawer = RootDrawer(createDrawerMenu(selectedPlanner), location);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        elevation={0}
        position="fixed"
        sx={{
          backgroundColor: grey[900],
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
          <Typography sx={{ display: { sm: "none" } }}>Budgetly</Typography>
          <Chip
            component={Link}
            to="/planners"
            label={selectedPlanner?.name ?? "Select a planner"}
            color="secondary"
            sx={{ ml: "auto", mr: 2, cursor: "pointer" }}
          />
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
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
function RootDrawer(
  drawerMenu: (
    | {
        title: string;
        active: boolean;
        icon: JSX.Element;
        href: string;
        children?: undefined;
      }
    | {
        title: string;
        active: boolean;
        icon: JSX.Element;
        href: string;
        children: { title: string; href: string }[];
      }
  )[],
  location: Location
) {
  return (
    <div>
      <Toolbar
        variant="dense"
        sx={{ backgroundColor: grey[900], color: grey[50] }}
      >
        Budgetly
      </Toolbar>
      <Divider />
      <List>
        {drawerMenu.map(
          ({ title, active, icon, href, children }, parentIndex) => {
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
                      <ListItemText primary={title} />
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
                            <ListItemText primary={child.title} />
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

function createDrawerMenu(selectedPlanner: Planner | null) {
  return [
    {
      title: "Dashboard",
      active: true,
      icon: <HomeIcon />,
      href: "/",
    },
    {
      title: "Planners",
      active: true,
      icon: <CalendarTodayIcon />,
      href: "/planners",
    },
    {
      title: "Categories",
      active: true,
      icon: <CategoryIcon />,
      href: "/categories",
    },
    {
      title: "Transactions",
      active: !!selectedPlanner,
      icon: <AccountBalanceIcon />,
      href: "/transactions",
      children: [
        {
          title: "Overview",
          href: "/transactions",
        },
        {
          title: "Monthly",
          href: "/transactions/monthly",
        },
      ],
    },
    {
      title: "Contracts",
      active: !!selectedPlanner,
      icon: <FolderIcon />,
      href: "/contracts",
    },
  ];
}
