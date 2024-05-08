import { useState } from 'react';

// @mui
import { Box, Stack, Typography, Chip, Avatar, Container, AppBar, IconButton } from '@mui/material';
// store
import { useSelector, useDispatch } from 'src/store';
// hooks
import { useParams, useRouter } from 'src/routes/hooks';
import useLocales from 'src/locales/use-locales';
import { useResponsive } from 'src/hooks/use-responsive';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';

import Player from './player';

// types

// ----------------------------------------------------------------------

export default function ProfileView() {
  const dispatch = useDispatch();
  const { t } = useLocales();
  const router = useRouter();
  const params = useParams();
  const { roomId } = params;
  console.log('🚀 ~ ProfileView ~ roomId:', roomId);

  const { user } = useSelector((store) => store.auth);
  const smDown = useResponsive('down', 'sm');
  const settings = useSettingsContext();
  return (
    <Stack
      sx={{
        background: `url(/assets/pokerking/board.png)`,
        height: 1,
        backgroundPosition: 1,
        backgroundSize: 'cover',
      }}
    >
      <AppBar sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" gap={{ xs: 0.5, sm: 4 }}>
            <Logo />
            <IconButton
              sx={{ p: 0.5, border: '3px solid', borderColor: 'primary.main' }}
              onClick={() => router.push('/')}
            >
              <Iconify icon="basil:logout-solid" sx={{ color: 'primary.main' }} />
            </IconButton>
          </Stack>
          <Stack direction="row" gap={{ xs: 0.5, sm: 4 }}>
            <IconButton sx={{ p: 0.5, border: '3px solid', borderColor: 'primary.main' }}>
              <Iconify icon="bi:question-lg" sx={{ color: 'primary.main' }} />
            </IconButton>
            <IconButton sx={{ p: 0.5, border: '3px solid', borderColor: 'primary.main' }}>
              <Iconify icon="fa6-solid:info" sx={{ color: 'primary.main' }} />
            </IconButton>
            <IconButton sx={{ p: 0.5, border: '3px solid', borderColor: 'primary.main' }}>
              <Iconify icon="lets-icons:setting-fill" sx={{ color: 'primary.main' }} />
            </IconButton>
          </Stack>
        </Stack>
      </AppBar>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ height: 1, width: 1 }}>
        <Stack
          sx={{
            width: 1,
            height: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack
            sx={{
              p: 3,
              width: { xs: 0.7, sm: 1 },
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              component="img"
              sx={{ width: 1 }}
              src={`/assets/pokerking/table_${smDown ? 'mobile' : 'desktop'}.png`}
            />
            <Box
              component="img"
              src="/logo/logo_watermark.png"
              sx={{ position: 'absolute', width: 150 }}
            />
            <Stack sx={{ position: 'absolute', justifyContent: 'center', alignItems: 'center' }}>
              <Typography>Show Down</Typography>
              <Stack direction="row" gap={1}>
                <Box
                  component="img"
                  src="/assets/pokerking/card/card_spades_fourteen.png"
                  sx={{
                    width: 50,
                  }}
                />
                <Box
                  component="img"
                  src="/assets/pokerking/card/card_spades_fourteen.png"
                  sx={{
                    width: 50,
                  }}
                />
                <Box
                  component="img"
                  src="/assets/pokerking/card/card_spades_fourteen.png"
                  sx={{
                    width: 50,
                  }}
                />
                <Box
                  component="img"
                  src="/assets/pokerking/card/card_spades_fourteen.png"
                  sx={{
                    width: 50,
                  }}
                />
                <Box
                  component="img"
                  src="/assets/pokerking/card/card_spades_fourteen.png"
                  sx={{
                    width: 50,
                  }}
                />
              </Stack>
              <Chip
                avatar={<Avatar alt="coin" src="/assets/pokerking/coin.png" />}
                label="230,000"
                color="primary"
                sx={{ bgcolor: '#000000a6', mt: 2, color: '#FFF' }}
              />
            </Stack>
            <Player
              isLeft
              sx={{
                top: '20%',
                left: 0,
                position: 'absolute',
              }}
            />
            <Player
              isLeft
              sx={{
                bottom: '20%',
                left: 0,
                position: 'absolute',
              }}
            />
            <Player
              isLeft
              sx={{
                bottom: 0,
                position: 'absolute',
              }}
            />
            <Player
              sx={{
                top: '20%',
                right: 0,
                position: 'absolute',
              }}
            />
            <Player
              sx={{
                bottom: '20%',
                right: 0,
                position: 'absolute',
              }}
            />
            <Player
              sx={{
                top: 0,
                position: 'absolute',
              }}
            />
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
}
