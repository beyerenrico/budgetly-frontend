import { useCallback, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import {
  Button,
  Container,
  Flex,
  Grid,
  Group,
  Image,
  Space,
  Stepper,
  TextInput,
  Title,
  Text,
  Card,
  Box,
} from "@mantine/core";
import { countries } from "@aerapass/country-data";
import Flag from "react-world-flags";
import api from "../../api";
import "./styles.css";
import { useActiveUserStore } from "../../stores";

type Props = {};

export async function addAccountsLoader() {
  const tokens = await api.nordigen.getTokens();
  const institutions = await api.nordigen.getInstitutions(tokens.access);
  return { tokens, institutions };
}

function AddAccount({}: Props) {
  const { tokens, institutions } = useLoaderData() as {
    institutions: NordigenInstitution[];
    tokens: NordigenTokenResponse;
  };

  const { activeUser } = useActiveUserStore((state) => ({
    activeUser: state.activeUser,
  }));

  const [requisition, setRequisition] = useState<NordigenRequisition>();
  const [selectedBank, setSelectedBank] = useState<NordigenInstitution>();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [institutionsByCountry, setInstitutionsByCountry] = useState<
    NordigenInstitution[]
  >([]);
  const [active, setActive] = useState(0);

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const countriesFromApi = extractCountries(institutions);

  const handleBankSelect = useCallback(
    async (institution: NordigenInstitution) => {
      const referenceId = crypto.randomUUID();
      const agreement = await api.nordigen.createAgreement(
        tokens.access,
        institution.id
      );

      const requisition = await api.nordigen.createRequisition(
        tokens.access,
        agreement.id,
        institution.id,
        referenceId
      );

      setRequisition(requisition);

      api.requisitions.create({
        id: referenceId,
        requisition: requisition.id,
        institution: institution.id,
        link: requisition.link,
        user: activeUser?.sub,
      });

      setSelectedBank(institution);
      nextStep();
    },
    []
  );

  const handleCountrySelect = useCallback((country: string) => {
    setSelectedCountry(country);
    setInstitutionsByCountry(
      institutions.filter((institution) =>
        institution.countries.includes(country)
      )
    );
    nextStep();
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setInstitutionsByCountry(
        institutionsByCountry.filter((institution) =>
          institution.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    },
    [selectedCountry]
  );

  return (
    <Container size="xl" sx={{ position: "relative" }}>
      <Flex justify="space-between">
        <Title order={1}>Add a new Account</Title>
      </Flex>
      <Space h={60} />
      <Stepper active={active}>
        <Stepper.Step label="Select your country">
          <Space h="xl" />
          <Grid>
            {countriesFromApi.map((country, index) => (
              <Grid.Col md={6} lg={4} key={index}>
                <Button
                  leftIcon={<Flag code={country} height="16" />}
                  fullWidth
                  size="xl"
                  color="dark"
                  onClick={() => handleCountrySelect(country)}
                >
                  {countries[country].name}
                </Button>
              </Grid.Col>
            ))}
          </Grid>
        </Stepper.Step>
        <Stepper.Step label="Select your bank">
          <Space h="xl" />
          <Group sx={{ flexWrap: "nowrap", alignItems: "flex-end" }}>
            <Button color="dark" onClick={prevStep} size="lg">
              Back
            </Button>
            <TextInput
              placeholder="Search"
              variant="filled"
              w="100%"
              size="lg"
              onChange={(event) => handleSearch(event.currentTarget.value)}
            />
          </Group>
          <Space h="xl" />
          <Grid>
            {institutionsByCountry.map((institution, index) => (
              <Grid.Col md={6} lg={6} key={index}>
                <Button
                  leftIcon={
                    <Image
                      src={institution.logo}
                      height={32}
                      width={32}
                      sx={{ objectFit: "cover" }}
                    />
                  }
                  fullWidth
                  color="dark"
                  size="xl"
                  onClick={() => handleBankSelect(institution)}
                >
                  {institution.name}
                </Button>
              </Grid.Col>
            ))}
          </Grid>
        </Stepper.Step>
        <Stepper.Step label="Connect your account">
          <Space h="xl" />
          <Group sx={{ flexWrap: "nowrap", alignItems: "flex-end" }}>
            <Button color="dark" onClick={prevStep} size="lg">
              Back
            </Button>
          </Group>
          <Space h="xl" />
          {requisition && (
            <Card shadow="md" color="dark">
              <Flex justify="space-between">
                <Box>
                  <Title order={3}>
                    Connect your account by clicking on the link below
                  </Title>
                  <Text color="dimmed">
                    You will be redirected to another page, to finalize the
                    process
                  </Text>
                  <Space h="xl" />
                  <Button
                    size="lg"
                    component={Link}
                    to={requisition?.link}
                    target="_self"
                  >
                    Connect to {selectedBank?.name}
                  </Button>
                </Box>
                <Box>
                  <Image
                    src={selectedBank?.logo}
                    height={128}
                    sx={{ objectFit: "cover" }}
                  />
                </Box>
              </Flex>
            </Card>
          )}
        </Stepper.Step>
      </Stepper>
      <Space h={60} />
    </Container>
  );
}

export default AddAccount;

function extractCountries(institutions: NordigenInstitution[]) {
  const countries = institutions.map((institution) => institution.countries);
  const countriesFlat = countries.reduce((acc, val) => acc.concat(val), []);
  const countriesFlatUnique = countriesFlat.filter(
    (country, index) => countriesFlat.indexOf(country) === index
  );

  return countriesFlatUnique;
}
