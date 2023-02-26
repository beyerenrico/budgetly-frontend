import { Link, useLoaderData } from "react-router-dom";
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

type Props = {};

export async function plannersLoader() {
  const planners = await api.planners.findAll();
  return { planners };
}

function Planners({}: Props) {
  const { planners } = useLoaderData() as {
    planners: Planner[];
  };

  const [data, setData] = useState<Planner[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addHandler = async () => {
    await plannersLoader().then((data) => setData(data.planners));
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
        sx={{ mb: 2 }}
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
      <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2}>
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
            sx={{ border: "1px solid", borderColor: grey[300] }}
          >
            <CardContent>
              <Typography variant="h6">{planner.name}</Typography>
              <Typography paragraph>{planner.description}</Typography>
            </CardContent>
            <CardActions sx={{ p: 2 }}>
              <Button
                variant="contained"
                component={Link}
                to={`/planners/${planner.id}`}
              >
                View
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </>
  );
}

export default Planners;
