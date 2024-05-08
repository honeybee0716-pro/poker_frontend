import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import * as Yup from 'yup';
// @mui
import { Box, Stack, Typography, Avatar, IconButton, Button, Container } from '@mui/material';
// store
import { useSelector, useDispatch } from 'src/store';
// hooks
import useLocales from 'src/locales/use-locales';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

// types

// ----------------------------------------------------------------------

export default function MyProfileView({ onBack }: { onBack: () => void }) {
  const dispatch = useDispatch();
  const { t } = useLocales();

  const { user } = useSelector((store) => store.auth);

  const settings = useSettingsContext();

  const ProfileSchema = Yup.object().shape({
    id: Yup.number().required('ID is required'),
    nick_name: Yup.string().required('Nick name is required'),
  });

  const defaultValues = {
    id: user?.id || -1,
    nick_name: user?.name || '',
    email: user?.email || '',
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const { id, nick_name } = data;
    } catch (error) {
      console.error(error);
      reset();
    }
  });

  return (
    <>
      <Stack
        sx={{
          px: 4,
          py: 2,
          height: 133,
          bgcolor: '#0000008a',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5">{t('label.my_profile')}</Typography>

        <Stack
          width={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 0.5, sm: 3 }}
        >
          <IconButton onClick={onBack}>
            <Iconify icon="uiw:left" />
          </IconButton>

          <Stack sx={{ width: 1 }}>
            <Typography variant="h6">ID: {user.id}</Typography>
            <Typography variant="h6">NAME: {user.name}</Typography>
          </Stack>

          <Avatar src="/assets/pokerking/avatars/avatar0.jpg" sx={{ width: 70, height: 70 }} />
        </Stack>
      </Stack>

      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: 4 }}>
        <FormProvider methods={methods} onSubmit={onSubmit} style={{ height: '100%' }}>
          <Stack gap={3}>
            <RHFTextField
              name="id"
              label={t('label.id')}
              variant="standard"
              sx={{ fontSize: 26 }}
            />
            <RHFTextField
              name="nick_name"
              label={t('label.nick')}
              variant="standard"
              sx={{ fontSize: 26 }}
            />
            <RHFTextField
              name="email"
              label={t('label.email')}
              variant="standard"
              sx={{ fontSize: 26 }}
            />
          </Stack>
          <Button type="button" color="primary" variant="outlined" sx={{ mt: 3 }}>
            Logout
          </Button>
        </FormProvider>
      </Container>
    </>
  );
}
