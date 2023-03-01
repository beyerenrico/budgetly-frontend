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
import NewReport from "./NewReport";
import { grey } from "@mui/material/colors";
import { useSnackbar } from "notistack";
import DeleteIcon from "@mui/icons-material/Delete";

type Props = {};

export async function reportsLoader() {
  const reports = await api.reports.findAll();
  return { reports };
}

function Reports({}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { reports } = useLoaderData() as {
    reports: Report[];
  };

  const [data, setData] = useState<Report[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addHandler = async () => {
    await reportsLoader().then((data) => setData(data.reports));
    enqueueSnackbar("Report added", { variant: "success" });
    setDrawerOpen(false);
  };

  useEffect(() => {
    setData(reports);
  }, [reports]);

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
        <Typography variant="h4">Reports</Typography>

        <SwipeableTemporaryDrawer
          buttonLabel="Add"
          anchor="right"
          open={drawerOpen}
          onToggle={(open) => setDrawerOpen(open)}
        >
          <Box padding={3} width={350} display="flex" flexDirection="column">
            <NewReport onAdd={addHandler} />
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
            <Typography variant="h6">No reports found</Typography>
          </Paper>
        )}
        {data.map((report, index) => (
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
              <Typography variant="h6">{report.name}</Typography>
              <Typography paragraph>{report.description}</Typography>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
            >
              <Button
                variant="contained"
                component={Link}
                to={`/reports/${report.id}`}
              >
                View
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  try {
                    await api.reports.remove(report.id);
                  } catch (error) {
                    enqueueSnackbar("This report contains transactions", {
                      variant: "error",
                    });
                    return;
                  }

                  enqueueSnackbar("Report deleted", {
                    variant: "success",
                  });
                  setData(data.filter((c) => c.id !== report.id));
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

export default Reports;
