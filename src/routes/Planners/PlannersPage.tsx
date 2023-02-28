import React from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Paper,
  Typography,
} from "@mui/material";
import api from "../../api";
import SwipeableTemporaryDrawer from "../../components/Drawer";
import { useEffect, useState } from "react";
import NewPlanner from "./NewPlanner";
import { grey } from "@mui/material/colors";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelectedPlannerStore } from "../../stores";

type Props = {};

export async function plannersLoader() {
  const planners = await api.planners.findAll();
  return { planners };
}

function Planners({}: Props) {
  const { selectedPlanner, setSelectedPlanner } = useSelectedPlannerStore(
    (state) => ({
      selectedPlanner: state.planner,
      setSelectedPlanner: state.setPlanner,
    })
  );
  const { enqueueSnackbar } = useSnackbar();
  const { planners } = useLoaderData() as {
    planners: Planner[];
  };

  const [data, setData] = useState<Planner[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addHandler = async () => {
    await plannersLoader().then((data) => setData(data.planners));
    enqueueSnackbar("Planner added", { variant: "success" });
    setDrawerOpen(false);
  };

  useEffect(() => {
    setData(planners);
  }, [planners]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          mb: 2,
        }}
      >
        <Typography variant="h4">Planners</Typography>

        <SwipeableTemporaryDrawer
          buttonLabel="Add"
          anchor="right"
          open={drawerOpen}
          onToggle={(open) => setDrawerOpen(open)}
        >
          <Box padding={3} width={350} display="flex" flexDirection="column">
            <NewPlanner onAdd={addHandler} />
          </Box>
        </SwipeableTemporaryDrawer>
      </Box>
      <Box
        display="grid"
        gap={2}
        sx={{
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
          },
        }}
      >
        {data.length === 0 && (
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 400,
              border: "1px solid",
              borderColor: grey[300],
              gridColumn: "1 / 4",
            }}
          >
            <Typography variant="h6">No planners found</Typography>
          </Paper>
        )}
        {data.map((planner, index) => (
          <Card
            elevation={0}
            key={index}
            sx={{
              border: "1px solid",
              borderColor: grey[300],
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <CardContent>
              <Typography variant="h6">{planner.name}</Typography>
              <Typography paragraph>{planner.description}</Typography>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
            >
              <Button
                variant={
                  selectedPlanner?.id === planner?.id ? "contained" : "outlined"
                }
                onClick={() => {
                  if (selectedPlanner?.id === planner?.id) {
                    setSelectedPlanner(null);
                    return;
                  }
                  setSelectedPlanner(planner);
                }}
              >
                {selectedPlanner?.id === planner?.id ? "Selected" : "Select"}
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  try {
                    await api.planners.remove(planner.id);
                  } catch (error) {
                    enqueueSnackbar("This planner contains transactions", {
                      variant: "error",
                    });
                    return;
                  }

                  enqueueSnackbar("Planner deleted", {
                    variant: "success",
                  });
                  setData(data.filter((c) => c.id !== planner.id));
                }}
              >
                <DeleteIcon />
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  );
}

export default Planners;
