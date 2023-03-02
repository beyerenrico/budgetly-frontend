import axios from "axios";

const getTokens = async (): Promise<NordigenTokenResponse> => {
  const response = await axios.post(
    "/nord/api/v2/token/new/",
    {
      secret_id: process.env.NORDIGEN_SECRET_ID,
      secret_key: process.env.NORDIGEN_SECRET_KEY,
    },
    {
      headers: {
        "Allow-Control-Allow-Origin": "*",
      },
    }
  );

  return response.data as unknown as NordigenTokenResponse;
};

const getInstitutions = async (
  accessToken: NordigenTokenResponse["access"]
): Promise<NordigenInstitution[]> => {
  const response = await axios.get("/nord/api/v2/institutions/", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data as unknown as NordigenInstitution[];
};

const NordigenService = {
  getInstitutions,
  getTokens,
};

export default NordigenService;
