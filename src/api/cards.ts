import { request } from "./common";

const findAll = async (): Promise<Card[]> => {
  const response = await request("GET", "/cards", "AUTHENTICATED");

  return response.data as Card[];
};

const findOne = async (id: string): Promise<Card> => {
  const response = await request("GET", `/cards/${id}`, "AUTHENTICATED");

  return response.data as Card;
};

const create = async (data: CardCreate): Promise<Card> => {
  const response = await request<CardCreate>(
    "POST",
    "/cards",
    "AUTHENTICATED",
    data
  );

  return response.data as Card;
};

const remove = async (id: string): Promise<DeleteResponse> => {
  const response = await request("DELETE", `/cards/${id}`, "AUTHENTICATED");

  return response as unknown as DeleteResponse;
};

const CardService = {
  findAll,
  findOne,
  create,
  remove,
};

export default CardService;
