import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import {
  Box,
  Card,
  Container,
  CardHeader,
  Stack,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
} from '@mui/material';
// store
import { useSelector, useDispatch } from 'src/store';
import { setRoles } from 'src/store/reducers/role';
// hooks
import useLocales from 'src/locales/use-locales';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { AccountPopover, LanguagePopover } from 'src/layouts/_common';

// types

// ----------------------------------------------------------------------

export default function ProfileView() {
  const dispatch = useDispatch();
  const { t } = useLocales();

  const { user } = useSelector((store) => store.auth);

  const settings = useSettingsContext();

  return (
    <>
      <Stack
        sx={{
          px: 4,
          height: 64,
          bgcolor: '#0000008a',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5">
          {t('label.welcome_to')} {user?.name}!
        </Typography>

        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0.5, sm: 1 }}
        >
          <IconButton sx={{ border: '2px solid #cfb13a', p: 0.4 }}>
            <Iconify icon="pepicons-print:question" width={20} height={20} color="#cfb13a" />
          </IconButton>

          <Chip
            avatar={<Avatar alt="Natacha" src="/assets/pokerking/coin.png" />}
            label="230 G"
            variant="outlined"
            sx={{ px: 1, py: 0.5, borderRadius: 50, border: '2px solid #cfb13a' }}
          />

          <LanguagePopover />

          <AccountPopover />
        </Stack>
      </Stack>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: 4 }}>
        <Scrollbar>
          <Card sx={{ bgcolor: '#000000cc' }}>
            <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
              <Stack
                sx={{
                  flexDirection: 'row',
                  letterSpacing: 2,
                  fontWeight: 'bold',
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 70,
                    backgroundColor: '#ffcc00',
                  }}
                />
                <Stack justifyContent="center" ml={3}>
                  <Typography
                    sx={{
                      color: '#e1c021',
                    }}
                  >
                    {`6 ${t('label.seat')} / 5`}
                  </Typography>
                  <Typography>10 G</Typography>
                </Stack>
              </Stack>
              <Button
                sx={{
                  px: 4,
                  mr: 2,
                  width: 113,
                  height: 30,
                  color: 'black',
                  background: 'url(/assets/pokerking/button/button2.png)',
                  backgroundSize: 'contain',
                }}
              >
                10 G
              </Button>
            </Stack>
          </Card>
        </Scrollbar>
      </Container>
    </>
  );
}
