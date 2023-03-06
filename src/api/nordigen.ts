import axios from "axios";

const endpointBase = `${import.meta.env.VITE_NORDIGEN_PROXY_ENDPOINT}/api/v2`;

const getTokens = async (): Promise<NordigenTokenResponse> => {
  const response = await axios.post(
    `${endpointBase}/token/new/`,
    {
      secret_id: import.meta.env.VITE_NORDIGEN_SECRET_ID,
      secret_key: import.meta.env.VITE_NORDIGEN_SECRET_KEY,
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
  const response = await axios.get(`${endpointBase}/institutions/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data as unknown as NordigenInstitution[];
};

const createAgreement = async (
  accessToken: NordigenTokenResponse["access"],
  id: NordigenInstitution["id"]
): Promise<NordigenAgreement> => {
  const response = await axios.post(
    `${endpointBase}/agreements/enduser/`,
    {
      institution_id: id,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data as unknown as NordigenAgreement;
};

const createRequisition = async (
  accessToken: NordigenTokenResponse["access"],
  agreementId: NordigenAgreement["id"],
  institutionId: NordigenInstitution["id"]
): Promise<NordigenRequisition> => {
  const response = await axios.post(
    `${endpointBase}/requisitions/`,
    {
      redirect: `${import.meta.env.VITE_HOST}/accounts/add/requisitions`,
      institution_id: institutionId,
      reference: crypto.randomUUID(),
      agreement: agreementId,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data as unknown as NordigenRequisition;
};

const getRequisitions = async (
  accessToken: NordigenTokenResponse["access"],
  requisitionId: NordigenRequisition["id"]
): Promise<NordigenRequisition> => {
  const response = await axios.get(
    `${endpointBase}/requisitions/${requisitionId}/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data as unknown as NordigenRequisition;
};

const getAccounts = async (
  accessToken: NordigenTokenResponse["access"],
  accountId: NordigenRequisition["id"]
): Promise<NordigenAccount> => {
  const response = await axios.get(`${endpointBase}/accounts/${accountId}/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  return response.data as unknown as NordigenAccount;
};

const getTransactions = async (
  accessToken: NordigenTokenResponse["access"],
  accountId: NordigenRequisition["id"]
): Promise<NordigenTransactionsResponse> => {
  const response = await axios.get(
    `${endpointBase}/accounts/${accountId}/transactions/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data as unknown as NordigenTransactionsResponse;
};

const getBalances = async (
  accessToken: NordigenTokenResponse["access"],
  accountId: NordigenRequisition["id"]
): Promise<NordigenBalanceResponse> => {
  const response = await axios.get(
    `${endpointBase}/accounts/${accountId}/balances/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data as unknown as NordigenBalanceResponse;
};

const getDetails = async (
  accessToken: NordigenTokenResponse["access"],
  accountId: NordigenRequisition["id"]
): Promise<NordigenDetailsResponse> => {
  const response = await axios.get(
    `${endpointBase}/accounts/${accountId}/details/`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data as unknown as NordigenDetailsResponse;
};

const NordigenService = {
  getInstitutions,
  getTokens,
  createAgreement,
  createRequisition,
  getRequisitions,
  getAccounts,
  getTransactions,
  getBalances,
  getDetails,
};

export default NordigenService;
