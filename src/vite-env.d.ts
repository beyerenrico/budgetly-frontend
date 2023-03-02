/// <reference types="vite/client" />

interface Report {
  id: string;
  name: string;
  description: string;
  user: string;
  transactions?: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ReportCreate {
  name: string;
  description: string;
  user: string;
}

type ReportUpdate = ReportCreate;

interface Category {
  id: string;
  name: string;
  user: string;
  transactions?: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreate {
  id?: string;
  name: string;
  user: string;
}

type CategoryUpdate = CategoryCreate;

interface Contract {
  id: string;
  name: string;
  user: string;
  transactions?: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContractCreate {
  id?: string;
  name: string;
  user: string;
}

type ContractUpdate = ContractCreate;

interface Card {
  id: string;
  name: string;
  user: string;
  transactions?: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface CardCreate {
  id?: string;
  name: string;
  user: string;
}

interface Transaction {
  id?: string;
  name: string;
  sender: string;
  receiver: string;
  amount: number;
  date: string;
  user: string;
  category?: Category | string;
  report?: Report | string;
  contract?: Contract | string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TransactionCreate {
  name: string;
  sender: string;
  receiver: string;
  amount: number;
  date: string;
  user: string;
  category?: string;
  report?: string;
  contract?: string;
}

type TransactionUpdate = TransactionCreate;

interface UpdateResponse {
  raw: any;
  affected?: number;
  generatedMaps: Record<string, unknown>[];
}

interface DeleteResponse {
  raw: any;
  affected?: number;
}

interface SelectedReportStoreState {
  report: Report | null;
  setReport: (report: Report | null) => void;
}

interface TokenStoreState {
  tokens: SuccessfullSignInResponse;
  setTokens: (tokens: SuccessfullSignInResponse) => void;
}

interface ActiveUserStoreState {
  activeUser: ActiveUserData | null;
  setActiveUser: (activeUser: ActiveUserData | null) => void;
}

interface Service<T> {
  findAll: () => Promise<T[]>;
  findOne: (id: string) => Promise<T>;
  create: (data: T) => Promise<T>;
  update: (id: string) => Promise<UpdateResponse>;
  remove: (id: string) => Promise<DeleteResponse>;
}

interface SignUpData {
  email: string;
  password: string;
}

interface SignUpSchema {
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface SuccessfullSignInResponse {
  accessToken: string;
  refreshToken: string;
}

interface ActiveUserData {
  sub: string;
  email: string;
}

interface NordigenInstitution {
  bic: string;
  countries: string[];
  id: string;
  logo: string;
  name: string;
  transaction_total_days: string;
}

interface NordigenTokenResponse {
  access: string;
  access_expires: number;
  refresh: string;
  refresh_expires: number;
}
