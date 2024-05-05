import { useEffect, useState } from 'react';

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
import { PATH_AFTER_LOGIN, SOCKET_KEY } from 'src/config-global';
// hooks
import useSocket from 'src/hooks/use-socket';
import useLocales from 'src/locales/use-locales';
import { useBoolean } from 'src/hooks/use-boolean';

// auth
import { useDispatch } from 'src/store';
import { signin } from 'src/store/reducers/auth';

// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const router = useRouter();
  const { t } = useLocales();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { sendSocket, lastJsonMessage } = useSocket();

  const [errorMsg, setErrorMsg] = useState('');

  const confirmPassword = useBoolean();

  const LoginSchema = Yup.object().shape({
    name: Yup.string().min(4).required('Nick Name is required'),
    agent_code: Yup.number().min(0).required('Agent Code is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string()
      .min(6)
      .matches(/[A-z]/, 'Must contain at least one letter')
      .matches(/[0-9]/, 'Must contain at least one number')
      .required('Password is required'),
  });

  const defaultValues = {
    name: '',
    agent_code: 0,
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { name, email, agent_code, password } = data;
      sendSocket({
        key: SOCKET_KEY.REGISTER,
        name,
        email,
        agent_code,
        password,
      });
    } catch (error) {
      console.error(error);
      reset();
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  });

  useEffect(() => {
    if (!lastJsonMessage) return;
    const { key, data } = lastJsonMessage;
    if (key !== SOCKET_KEY.REGISTER_RES || !data) return;
    const { result, user, error, token } = data;
    if (error) {
      setErrorMsg(error);
      return;
    }
    if (!result || !user || !token) return;
    dispatch(signin({ user, token }));
    console.log('succss');

    enqueueSnackbar(t('message.welcome'));
    router.push(PATH_AFTER_LOGIN);
  }, [lastJsonMessage, router, dispatch, enqueueSnackbar, t]);

  useEffect(() => {
    setErrorMsg('');
  }, [watch]);

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 3, alignItems: 'center' }}>
      <Logo sx={{ width: 100 }} />
    </Stack>
  );

  const renderForm = (
    <Stack spacing={1} height={1} position="relative">
      {!!errorMsg && <Alert severity="error">{t(`message.${errorMsg}`)}</Alert>}

      <RHFTextField name="name" label={t('label.nick')} variant="standard" sx={{ fontSize: 26 }} />

      <RHFTextField
        name="email"
        label={t('label.email')}
        variant="standard"
        sx={{ fontSize: 26 }}
      />
      <RHFTextField
        type="number"
        inputProps={{ min: 0 }}
        name="agent_code"
        label={t('label.agent_code')}
        variant="standard"
        sx={{ fontSize: 26 }}
      />

      <RHFTextField
        name="password"
        label={t('label.password')}
        variant="standard"
        type={confirmPassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <Iconify
                  icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Stack sx={{ alignItems: 'center', gap: 3, position: 'absolute', width: 1, bottom: 50 }}>
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
          {t('label.register')}
        </LoadingButton>
        <Link component={RouterLink} href={paths.auth.login} variant="subtitle2">
          {t('label.signin')}
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
