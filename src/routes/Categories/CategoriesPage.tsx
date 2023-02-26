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
import NewCategory from "./NewCategory";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";

type Props = {};

export async function categoriesLoader() {
  const categories = await api.categories.findAll();
  return { categories };
}

function Categories({}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { categories } = useLoaderData() as {
    categories: Category[];
  };

  const [data, setData] = useState<Category[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const addHandler = async () => {
    await categoriesLoader().then((data) => setData(data.categories));
    setDrawerOpen(false);
  };

  useEffect(() => {
    setData(categories);
  }, [categories]);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography variant="h4">Categories</Typography>

        <SwipeableTemporaryDrawer
          buttonLabel="Add"
          anchor="right"
          open={drawerOpen}
          onToggle={(open) => setDrawerOpen(open)}
        >
          <Box padding={3} width={350} display="flex" flexDirection="column">
            <NewCategory onAdd={addHandler} />
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
            <Typography variant="h6">No categories found</Typography>
          </Paper>
        )}
        {data.map((category, index) => (
          <Card
            elevation={0}
            key={index}
            sx={{ border: "1px solid", borderColor: grey[300] }}
          >
            <CardContent>
              <Typography variant="h6">{category.name}</Typography>
            </CardContent>
            <CardActions
              sx={{ display: "flex", justifyContent: "space-between", p: 2 }}
            >
              <Button
                variant="contained"
                component={Link}
                to={`/categories/${category.id}`}
              >
                View
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={async () => {
                  try {
                    await api.categories.remove(category.id);
                  } catch (error) {
                    enqueueSnackbar("This category contains transactions", {
                      variant: "error",
                    });
                    return;
                  }

                  enqueueSnackbar("Category deleted", {
                    variant: "success",
                  });
                  setData(data.filter((c) => c.id !== category.id));
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

export default Categories;
