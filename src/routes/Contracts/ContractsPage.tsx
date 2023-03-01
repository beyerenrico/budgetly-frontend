import { useEffect, useState } from "react";
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
import { grey } from "@mui/material/colors";

import api from "../../api";
import SwipeableTemporaryDrawer from "../../components/Drawer";
import NewContract from "./NewContract";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";

type Props = {};

export async function contractsLoader() {
  const contracts = await api.contracts.findAll();
  return { contracts };
}

function Contracts({}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { contracts } = useLoaderData() as {
    contracts: Category[];
  };

  const [data, setData] = useState<Contract[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addHandler = async () => {
    await contractsLoader().then((data) => setData(data.contracts));
    setDrawerOpen(false);
  };

  useEffect(() => {
    setData(contracts);
  }, [contracts]);
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Contracts</Typography>

        <SwipeableTemporaryDrawer
          buttonLabel="Add"
          anchor="right"
          open={drawerOpen}
          onToggle={(open) => setDrawerOpen(open)}
        >
          <Box padding={3} width={350} display="flex" flexDirection="column">
            <NewContract onAdd={addHandler} />
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
            lg: "repeat(4, 1fr)",
            xl: "repeat(5, 1fr)",
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
              gridColumn: "1 / 5",
            }}
          >
            <Typography variant="h6">No contracts found</Typography>
          </Paper>
        )}
        {data.map((contract, index) => (
          <Card
            elevation={0}
            key={index}
            sx={{ border: "1px solid", borderColor: grey[300] }}
          >
            <CardContent>
              <Typography variant="h6">{contract.name}</Typography>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
            >
              <Button
                variant="contained"
                component={Link}
                to={`/contracts/${contract.id}`}
              >
                View
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  try {
                    await api.contracts.remove(contract.id);
                  } catch (error) {
                    enqueueSnackbar("This contract contains transactions", {
                      variant: "error",
                    });
                    return;
                  }

                  enqueueSnackbar("Contract deleted", {
                    variant: "success",
                  });
                  setData(data.filter((c) => c.id !== contract.id));
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

export default Contracts;
