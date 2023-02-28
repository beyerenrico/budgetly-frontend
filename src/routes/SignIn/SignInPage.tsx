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
import { Link, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import api from "../../api";
import { useTokenStore } from "../../stores";
import { useSnackbar } from "notistack";

type Props = {};

function SignInPage({}: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const navigation = useNavigate();
  const [values, setValues] = useState<SignInData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { setTokens } = useTokenStore((state) => ({
    setTokens: state.setTokens,
  }));

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChange =
    (prop: keyof SignInData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleSubmit = async (event: React.MouseEvent) => {
    event.preventDefault();

    // TODO: Implement form validation via zod

    await api.authentication.signIn(values).then((res) => {
      setTokens(res);
      navigation("/");
      enqueueSnackbar("Successfully signed in", { variant: "success" });
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      bgcolor={grey[200]}
      sx={{ height: "100vh", width: "100vw" }}
    >
      <Box textAlign="center">
        <Typography variant="h4">Sign in to your account</Typography>
        <Typography paragraph>
          Or <Link to="/auth/sign-up">create a new one</Link>
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
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button
            onClick={handleSubmit}
            variant="contained"
            fullWidth
            size="large"
            sx={{ mb: 4, py: 2 }}
            type="submit"
          >
            Sign in
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default SignInPage;
