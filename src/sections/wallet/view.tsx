import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';

// @mui
import {
  Box,
  Stack,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Container,
} from '@mui/material';
// store
import { useSelector, useDispatch } from 'src/store';
// hooks
import useLocales from 'src/locales/use-locales';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useTranslation } from 'react-i18next';
// types

// ----------------------------------------------------------------------

export default function ProfileView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { user } = useSelector((store) => store.auth);

  const settings = useSettingsContext();

  const ProfileSchema = Yup.object().shape({
    amount: Yup.number().min(0).required('ID is required'),
  });

  const defaultValues = {
    amount: 0,
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const {
    setValue,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data);
    } catch (error) {
      console.error(error);
      reset();
    }
  });

  const handleAddAmount = (value: number) => {
    setValue('amount', value);
  };

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
        <Typography variant="h5">{t('label.wallet')}</Typography>

        <Stack
          width={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 0.5, sm: 3 }}
        >
          <Avatar src="/assets/pokerking/avatars/avatar0.jpg" sx={{ width: 70, height: 70 }} />

          <Stack sx={{ width: 1 }}>
            <Typography color="text.disabled">{t('label.wallet_balance')}</Typography>
            <Typography variant="h6">G {user?.money || 0}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: 4 }}>
        <FormProvider methods={methods} onSubmit={onSubmit} style={{ height: '100%' }}>
          <Stack>
            <center>
              <Typography>{t('label.top_up_your_wallet_balance')}</Typography>
            </center>
            <Stack gap={3}>
              <RHFTextField
                name="amount"
                label={t('label.enter_amount_to_add')}
                variant="standard"
                sx={{ fontSize: 26 }}
              />
            </Stack>
          </Stack>
          <Stack gap={3} mt={3}>
            <Typography fontSize="small" color="text.disabled">
              {t('label.add_a_quick_amount')}
            </Typography>
            <Stack direction="row" gap={3}>
              <Button
                color="primary"
                variant="outlined"
                sx={{ width: 100, height: 50 }}
                onClick={() => handleAddAmount(5000)}
              >
                +5000
              </Button>
              <Button
                color="primary"
                variant="outlined"
                sx={{ width: 100, height: 50 }}
                onClick={() => handleAddAmount(10000)}
              >
                +10000
              </Button>
              <Button
                color="primary"
                variant="outlined"
                sx={{ width: 100, height: 50 }}
                onClick={() => handleAddAmount(20000)}
              >
                +20000
              </Button>
            </Stack>
          </Stack>
          <Stack mt={3} gap={3}>
            <Button color="primary" variant="contained" sx={{ width: 150, height: 40 }}>
              {t('label.add_cash')}
            </Button>
            <Box>
              <Chip
                icon={<Iconify icon="logos:telegram" />}
                label="Connect to Agent"
                color="secondary"
                sx={{ px: 3 }}
                component="a"
                href="https://t.me/pontrue"
                variant="outlined"
                target="_blank"
                clickable
              />
            </Box>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
}
