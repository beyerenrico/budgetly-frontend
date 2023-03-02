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
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";

import { Link, useLoaderData } from "react-router-dom";

import { useSnackbar } from "notistack";

import api from "../../api";

type Props = {};

export async function cardsLoader() {
  const cards = await api.cards.findAll();
  return { cards };
}

function Cards({}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { cards } = useLoaderData() as {
    cards: Card[];
  };

  const [data, setData] = useState<Card[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addHandler = async () => {
    await cardsLoader().then((data) => setData(data.cards));
    setDrawerOpen(false);
  };

  useEffect(() => {
    setData(cards);
  }, [cards]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Cards</Typography>

        <Button variant="contained" component={Link} to="/cards/new">
          Add account
        </Button>
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
            <Typography variant="h6">No cards found</Typography>
          </Paper>
        )}
        {data.map((card, index) => (
          <Card
            elevation={0}
            key={index}
            sx={{ border: "1px solid", borderColor: grey[300] }}
          >
            <CardContent>
              <Typography variant="h6">{card.name}</Typography>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
            >
              <Button
                variant="contained"
                component={Link}
                to={`/cards/${card.id}`}
              >
                View
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  try {
                    await api.cards.remove(card.id);
                  } catch (error) {
                    enqueueSnackbar("This card contains transactions", {
                      variant: "error",
                    });
                    return;
                  }

                  enqueueSnackbar("Card deleted", {
                    variant: "success",
                  });
                  setData(data.filter((c) => c.id !== card.id));
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

export default Cards;
