import { isAxiosError } from 'axios';
import { useState, ChangeEventHandler, FormEventHandler } from 'react';
import { Link as routerLink, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Container,
  Grid2 as Grid,
  Link,
  TextField,
  Typography,
} from '@mui/material';

import {
  AuthenticationError,
  GenericError,
  ValidationError,
} from '../../../types';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectError, selectLoading } from '../usersSlice';
import { login, loginWithGoogle } from '../usersThunk';
import { GoogleLogin } from '@react-oauth/google';
import {
  isAuthenticationError,
  isGenericError,
  isValidationError,
} from '../../../helpers/error-helpers';

interface FormData {
  email: string;
  password: string;
}

const initialData: FormData = {
  email: '',
  password: '',
};

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState<FormData>(initialData);
  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);

  const getError = () => {
    if (isAuthenticationError(error)) {
      return error.error.message;
    }
    return undefined;
  };

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  };

  const handleSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(data)).unwrap();
      navigate('/');
    } catch (e) {
      if (isAuthenticationError(e) || isValidationError(error)) {
        return;
      }

      if (isGenericError(e)) {
        enqueueSnackbar(e.error, { variant: 'error' });
      } else if (isAxiosError(e) && e.response?.data.error) {
        return void enqueueSnackbar(`${e.message}: ${e.response.data.error}`, {
          variant: 'error',
        });
      } else if (e instanceof Error) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      } else if (
        typeof e === 'object' &&
        !!e &&
        'message' in e &&
        typeof e.message === 'string'
      ) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      }

      setData((data) => ({ ...data, password: '' }));
    }
  };

  const handleGoogleLogin = async (credential: string) => {
    try {
      await dispatch(loginWithGoogle(credential)).unwrap();
      navigate('/');
    } catch (e) {
      if (isAxiosError(e) && e.response?.data.error) {
        return void enqueueSnackbar(`${e.message}: ${e.response.data.error}`, {
          variant: 'error',
        });
      } else if (e instanceof Error) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      } else if (
        ((e): e is { message: string } =>
          'message' in (e as { message: string }))(e)
      ) {
        return void enqueueSnackbar(e.message, { variant: 'error' });
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                autoComplete="email"
                value={data.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={data.password}
                onChange={handleChange}
                error={!!getError()}
                helperText={getError()}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            loading={loading}
          >
            Sign In
          </Button>
        </Box>
        <Grid container justifyContent="flex-end">
          <Grid>
            <Link component={routerLink} variant="body2" to="/register">
              Not registered yet? Sign up
            </Link>
          </Grid>
        </Grid>
        <Box py={3}>
          <Typography gutterBottom>
            Or login with a third-party provider
          </Typography>
          <Grid container justifyContent="center" direction="column">
            <Grid>
              <GoogleLogin
                onSuccess={(res) => {
                  if (res.credential) void handleGoogleLogin(res.credential);
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignIn;
