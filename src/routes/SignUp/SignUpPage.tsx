import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useState } from "react";
import { Link, redirect, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../../api";
import { useTokenStore } from "../../stores";
import { useSnackbar } from "notistack";

type Props = {};

export async function signInLoader() {
  const { accessToken } = useTokenStore.getState().tokens;

  if (accessToken) {
    return redirect("/");
  }

  return null;
}

function SignInPage({}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigation = useNavigate();
  const [values, setValues] = useState<SignUpSchema>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChange =
    (prop: keyof SignUpSchema) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();

    // TODO: Implement form validation via zod

    await api.authentication
      .signUp({
        email: values.email,
        password: values.password,
      })
      .then(() => {
        navigation("/auth/sign-in");
        enqueueSnackbar("Account created", { variant: "success" });
      });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      bgcolor={grey[50]}
      sx={{ height: "100vh", width: "100vw" }}
    >
      <Box textAlign="center" mb={2}>
        <Typography variant="h1">Sign up for a new account</Typography>
        <Typography variant="h6">
          Or <Link to="/auth/sign-in">login to an existing one</Link>
        </Typography>
      </Box>
      <Box component={Paper} width={350} paddingX={4}>
        <form>
          <FormControl fullWidth sx={{ mt: 4 }}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              value={values.email}
              onChange={handleChange("email")}
              id="email"
              label="email"
              type="email"
            />
          </FormControl>
          <FormControl fullWidth sx={{ my: 4 }}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={values.password}
              onChange={handleChange("password")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <FormControl fullWidth sx={{ mb: 4 }}>
            <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
            <OutlinedInput
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={values.confirmPassword}
              onChange={handleChange("confirmPassword")}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowConfirmPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
              label="Confirm Password"
            />
          </FormControl>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            size="large"
            sx={{ mb: 4 }}
            type="submit"
          >
            Sign up
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default SignInPage;
