import { request } from "./common";

const signUp = async ({ email, password }: SignUpData): Promise<void> => {
  const response = await request<SignUpData>(
    "POST",
    "/authentication/sign-up",
    "PUBLIC",
    { email, password }
  );

  return response.data;
};

const signIn = async ({
  email,
  password,
}: SignInData): Promise<SuccessfullSignInResponse> => {
  const response = await request<SignInData>(
    "POST",
    "/authentication/sign-in",
    "PUBLIC",
    { email, password }
  );

  return response.data as SuccessfullSignInResponse;
};

const AuthenticationService = { signUp, signIn };

export default AuthenticationService;
