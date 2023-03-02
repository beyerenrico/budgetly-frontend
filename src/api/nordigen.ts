import axios from "axios";

const getTokens = async (): Promise<NordigenTokenResponse> => {
  const response = await axios.post(
    "/nord/api/v2/token/new/",
    {
      secret_id: "29f69149-2d19-4fc6-a629-32add379634c",
      secret_key:
        "c9a2af6bbf48cadb64e6ae4f1782d914aacd5faddaacc004a499eecd1bac54341ef5e44676b85c92fcdbcf1f2843793fcb109c65243b4c8e72ec234f3bea48bd",
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
