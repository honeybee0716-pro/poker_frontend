import { useEffect, useMemo, useState } from 'react';
// @mui
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
import { edit } from 'src/store/reducers/auth';
// hooks
import useSocket from 'src/hooks/use-socket';
import useLocales from 'src/locales/use-locales';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

// components
import { useRouter } from 'src/routes/hooks';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { GuidePopover, AccountPopover, LanguagePopover } from 'src/layouts/_common';
import { paths } from 'src/routes/paths';

// types
import { fCurrency } from 'src/utils/format-number';
import { SOCKET_KEY } from 'src/config-global';
import { IRoom } from 'src/types';

// ----------------------------------------------------------------------

export default function UsersView() {
  const dispatch = useDispatch();
  const { t } = useLocales();
  const router = useRouter();
  const store = useSelector((e) => e.auth);
  const { sendSocket, lastJsonMessage } = useSocket();
  const settings = useSettingsContext();
  const smDown = useResponsive('down', 'sm');

  const [rooms, setRooms] = useState<IRoom[]>([]);

  useEffect(() => {
    if (!store.user?.id) return;
    sendSocket({
      roomId: -1,
      key: SOCKET_KEY.GET_ROOMS,
      playerId: store.user?.id,
      roomSortParam: 'all',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.user?.id]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    const { key, data, user } = lastJsonMessage;
    if (key !== SOCKET_KEY.GET_ROOMS || !data) return;
    setRooms(data);
    dispatch(edit(user));
  }, [lastJsonMessage, dispatch]);

  const selectRoom = (roomId: number) => {
    router.push(paths.room.view(roomId));
  };

  return (
    <>
      <Stack
        sx={{
          px: { xs: 1, sm: 4 },
          height: 64,
          bgcolor: '#0000008a',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!smDown && (
          <Typography variant="h5">
            {t('label.welcome_to')} {store.user?.name}!
          </Typography>
        )}

        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0, sm: 1 }}
        >
          {!smDown && <GuidePopover />}
          <Chip
            avatar={<Avatar alt="Natacha" src="/assets/pokerking/coin.png" />}
            label={`${fCurrency(Number(store.user.money).toFixed(2))} G`}
            variant="outlined"
            sx={{ px: 1, py: 0.5, borderRadius: 50, border: '2px solid #cfb13a' }}
          />

          <LanguagePopover />

          <AccountPopover />
        </Stack>
      </Stack>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: 2 }}>
        <Scrollbar>
          {rooms.map((room) => (
            <Card key={room.roomId} sx={{ bgcolor: '#000000cc', mt: 1 }}>
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
                      {`${room.maxSeats} ${t('label.seat')} / ${room.playerCount}`}
                    </Typography>
                    <Typography>{`${room.roomMinBet} G`}</Typography>
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
                  onClick={() => selectRoom(room.roomId)}
                >
                  {`${room.roomMinBet} G`}
                </Button>
              </Stack>
            </Card>
          ))}
        </Scrollbar>
      </Container>
    </>
  );
}
