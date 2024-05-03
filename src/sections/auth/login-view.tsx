import { useState } from 'react';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
// routes
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
// config
import { PATH_AFTER_LOGIN } from 'src/config-global';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';

// auth
import useApi from 'src/hooks/use-api';
import { useDispatch } from 'src/store';
import { signin } from 'src/store/reducers/auth';

// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function LoginView() {
  const router = useRouter();
  const dispatch = useDispatch();

  const { login } = useApi();
  const [errorMsg, setErrorMsg] = useState('');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await login(data.email, data.password);
      if (!res?.data) return;
      dispatch(signin(res.data));
      router.push(PATH_AFTER_LOGIN);
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, alignItems: 'center' }}>
      <Logo sx={{ width: 100 }} />
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5} height={1} position="relative">
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField name="email" label="Nick name" variant="standard" sx={{ fontSize: 26 }} />

      <RHFTextField
        name="password"
        label="Password"
        variant="standard"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Stack sx={{ alignItems: 'center', gap: 3, position: 'absolute', width: 1, bottom: 80 }}>
        <LoadingButton
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          sx={{
            height: 50,
            maxWidth: 300,
            backgroundSize: 'cover',
            backgroundImage: 'url(../../assets/pokerking/button/button1.png)',
          }}
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
        <Link component={RouterLink} href={paths.auth.register} variant="subtitle2">
          Create an account
        </Link>
      </Stack>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit} style={{ height: '100%' }}>
      {renderHead}
      {renderForm}
    </FormProvider>
  );
}
