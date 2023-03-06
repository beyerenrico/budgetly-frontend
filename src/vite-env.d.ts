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
  transactions: Transaction[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface ContractCreate {
  id?: string;
  name: string;
  transactions: Transaction[];
  user: string;
}

type ContractUpdate = ContractCreate;

interface Account {
  id: string;
  iban: string;
  institution: string;
  user: string;
  requisition: Requisition["id"];
  createdAt: Date;
  transactions?: Transaction[];
  balances?: Balance[];
}

interface AccountCreate {
  id: string;
  iban: string;
  institution: string;
  user: string;
  requisition: Requisition["id"];
  createdAt: Date;
}

interface Transaction {
  id?: string;
  transactionId: string;
  status: "booked" | "pending";
  bankTransactionCode: string;
  bookingDate: Date;
  valueDate: Date;
  creditorAccountIban: string;
  creditorAccountCurrency: string;
  debtorAccountIban: string;
  debtorAccountName: string;
  remittanceInformationUnstructured: string;
  transactionAmount: string;
  transactionCurrency: string;
  user: User["id"];
  account: Account["id"];
  report?: Report["id"];
  contract?: Contract["id"];
  category?: Category["id"];
}

type TransactionCreate = Transaction;
type TransactionUpdate = TransactionCreate;

interface Balance {
  id?: string;
  balanceAmount: string;
  balanceCurrency: string;
  balanceType: "closingBooked" | "interimAvailable";
  creditLimitIncluded: boolean;
  user: User["id"];
  account: Account["id"];
}

type BalanceCreate = Balance;
type BalanceUpdate = BalanceCreate;

interface Requisition {
  id: NordigenRequisition["id"];
  institution: NordigenRequisition["institution_id"];
  link: NordigenRequisition["link"];
  user: User["id"];
}

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

interface NordigenAgreement {
  accepted: null;
  access_scope: string[];
  access_valid_for_days: number;
  created: Date;
  id: string;
  institution_id: string;
  max_historical_days: number;
}

interface NordigenRequisition {
  account_selection: boolean;
  accounts: never[];
  agreement: NordigenAgreement["id"];
  created: Date;
  id: string;
  institution_id: NordigenInstitution["id"];
  link: string;
  redirect: string;
  redirect_immediate: boolean;
  reference: string;
  ssn: null | string;
  status: string;
}

interface NordigenAccount {
  id: string;
  iban: string;
  institution_id: NordigenInstitution["id"];
  last_accessed: Date;
  created: Date;
  owner_name: string;
  status: string;
}

interface NordigenTransactionsResponse {
  transactions: {
    booked: NordigenTransaction[];
    pending: NordigenTransaction[];
  };
}

interface NordigenTransaction {
  bankTransactionCode: string;
  bookingDate: Date;
  creditorAccount: {
    iban: string;
    currency: string;
  };
  debtorAccount: {
    iban: string;
  };
  debtorName: string;
  endToEndId: string;
  internalTransactionId: string;
  purposeCode: string;
  remittanceInformationUnstructured: string;
  transactionAmount: {
    amount: string;
    currency: string;
  };
  transactionId: string;
  valueDate: Date;
}

interface NordigenBalanceResponse {
  balances: {
    balanceAmount: {
      amount: string;
      currency: string;
    };
    balanceType: "closingBooked" | "interimAvailable";
    creditLimitIncluded: boolean;
  }[];
}

interface NordigenDetailsResponse {
  cashAccountType: string;
  currency: string;
  iban: string;
  product: string;
  resourceId: string;
  status: string;
}
