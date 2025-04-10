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
import { useBoolean } from 'src/hooks/use-boolean';
import useLocales from 'src/locales/use-locales';

import { useDispatch } from 'src/store';
import { signin } from 'src/store/reducers/auth';

// components
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useSnackbar } from 'src/components/snackbar';
import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import Logo from 'src/components/logo';

import useSocket from 'src/hooks/use-socket';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

export default function LoginView() {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { sendSocket, lastJsonMessage } = useSocket();

  const [errorMsg, setErrorMsg] = useState('');

  const confirmPassword = useBoolean();

  const LoginSchema = Yup.object().shape({
    name: Yup.string().required('Nick Name / Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    name: '',
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
      const { name, password } = data;
      sendSocket({
        key: SOCKET_KEY.LOGIN,
        name,
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
    if (key !== SOCKET_KEY.LOGIN_RES || !data) return;
    const { result, user, error } = data;
    if (error) {
      setErrorMsg(error);
      return;
    }
    if (!result || !user) return;
    dispatch(signin({ user, token: 'token' }));
    enqueueSnackbar(t('message.welcome'));
    console.log('🚀 ~ useEffect ~ lastJsonMessage:', lastJsonMessage);
    router.push(PATH_AFTER_LOGIN);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastJsonMessage]);

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, alignItems: 'center' }}>
      <Logo sx={{ width: 100 }} />
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5} height={1} position="relative">
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      <RHFTextField
        name="name"
        label={t('label.nick_email')}
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
          {t('button.login')}
        </LoadingButton>
        <Link component={RouterLink} href={paths.auth.register} variant="subtitle2">
          {t('label.create_an_account')}
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
