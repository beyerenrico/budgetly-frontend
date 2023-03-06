import { useState } from "react";

import { useLoaderData } from "react-router-dom";

import api from "../../api";
import { Container, Flex, Grid, Space, Title } from "@mantine/core";
import SingleCategory from "./SingleCategory";
import CreateCategory from "./CreateCategory";

type Props = {};

export async function categoriesLoader() {
  const categories = await api.categories.findAll();
  return { categories };
}

function Categories({}: Props) {
  const { categories } = useLoaderData() as {
    categories: Category[];
  };

  const [data, setData] = useState<Category[]>(categories);

  const crudHandler = async () => {
    await categoriesLoader().then((data) => setData(data.categories));
  };

  return (
    <Container size="xl">
      <Flex justify="space-between">
        <Title order={1}>Categories</Title>
        <CreateCategory onCreate={crudHandler} />
      </Flex>
      <Space h="xl" />
      <Grid>
        {data.length === 0 && (
          <Grid.Col span={12}>
            <Title order={2}>No categories found</Title>
          </Grid.Col>
        )}
        {data.map((category, index) => (
          <Grid.Col md={6} lg={4} key={index}>
            <SingleCategory {...category} onDelete={crudHandler} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default Categories;
