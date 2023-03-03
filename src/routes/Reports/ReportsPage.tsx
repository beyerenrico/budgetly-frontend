import { useState } from "react";

import { useLoaderData } from "react-router-dom";

import api from "../../api";
import { Container, Flex, Grid, Space, Title } from "@mantine/core";
import SingleReport from "./SingleReport";
import CreateReport from "./CreateReport";

type Props = {};

export async function reportsLoader() {
  const reports = await api.reports.findAll();
  return { reports };
}

function Reports({}: Props) {
  const { reports } = useLoaderData() as {
    reports: Report[];
  };

  const [data, setData] = useState<Report[]>(reports);

  const crudHandler = async () => {
    await reportsLoader().then((data) => setData(data.reports));
  };

  return (
    <Container size="md">
      <Flex justify="space-between">
        <Title order={1}>Reports</Title>
        <CreateReport onCreate={crudHandler} />
      </Flex>
      <Space h="xl" />
      <Grid>
        {data.length === 0 && (
          <Grid.Col span={12}>
            <Title order={2}>No reports found</Title>
          </Grid.Col>
        )}
        {data.map((report, index) => (
          <Grid.Col md={6} lg={4} key={index}>
            <SingleReport {...report} onDelete={crudHandler} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
}

export default Reports;
