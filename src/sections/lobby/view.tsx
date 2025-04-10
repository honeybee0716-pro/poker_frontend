import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Container,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
// store
import { useDispatch, useSelector } from 'src/store';
import { edit, signout } from 'src/store/reducers/auth';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import useSocket from 'src/hooks/use-socket';
import useLocales from 'src/locales/use-locales';

// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

// types
import { SOCKET_KEY } from 'src/config-global';
import { IRoom } from 'src/types';
import { fCurrency } from 'src/utils/format-number';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

export default function GameUsersView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const router = useRouter();
  const store = useSelector((e) => e.auth);
  const { sendSocket, lastJsonMessage } = useSocket();
  const settings = useSettingsContext();
  const smDown = useResponsive('down', 'sm');

  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [disabledButtons, setDisabledButtons] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (!store.user?.id) return;
    sendSocket({
      roomId: -1,
      key: SOCKET_KEY.GET_SPECTATE_ROOMS,
      playerId: store.user?.id,
      roomSortParam: 'all',
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.user?.id]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    const { key, data, user } = lastJsonMessage;
    if (key !== SOCKET_KEY.GET_SPECTATE_ROOMS || !data) {
      sendSocket({
        roomId: -1,
        key: SOCKET_KEY.GET_SPECTATE_ROOMS,
        playerId: store.user?.id,
        roomSortParam: 'all',
      });
      return; // Add return here to prevent further execution if the condition is met
    }
    setRooms(data);
    dispatch(edit(user));
  }, [lastJsonMessage, dispatch, sendSocket,store.user?.id]);
  

  const selectRoom = (roomId: number) => {
    router.push(paths.room.view(roomId));
  };

  const handleClick = (roomId: number) => {
    // Disable the button when it's clicked
    setDisabledButtons((prevState) => ({
      ...prevState,
      [roomId]: true,
    }));

    // Call your selectRoom function
    selectRoom(roomId);
  };
  const handleLogout = () => {
    dispatch(signout());
    // const name = store.user?.name;
    // sendSocket({
    //   key: SOCKET_KEY.LOGOUT,
    //   name,
    // });
  };
  return (
    <>
      <Stack
        sx={{
          flexDirection: 'row',
          alignItems: 'center',
          bgcolor: '#0000008a',
          justifyContent: 'space-between',
        }}
      >
        <Stack>
          <Typography variant="h5" px={2} pt={1}>
            {`${t('label.hello')} "${store.user?.name}"`}
          </Typography>
          <Tabs value={0} sx={{ minHeight: 40 }}>
            <Tab label={t('label.cash_table')} sx={{ minHeight: 40, px: 1.6 }} />
          </Tabs>
        </Stack>

        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0, sm: 1 }}
        >
          <Chip
            avatar={<Avatar alt="Natacha" src="/assets/pokerking/ticket.png" />}
            label="16"
            variant="outlined"
            sx={{
              px: 1,
              py: 0.5,
              height: 'auto',
              borderRadius: 50,
              border: '2px solid #cfb13a',
              '& .MuiChip-label': {
                minWidth: 50,
                textAlign: 'center',
              },
            }}
          />

          <Chip
            avatar={<Avatar alt="Natacha" src="/assets/pokerking/coin.png" />}
            label={`${fCurrency(Number(store.user?.money || 0).toFixed(2))} G`}
            variant="outlined"
            sx={{
              height: 'auto',
              px: 1,
              py: 0.5,
              borderRadius: 50,
              border: '2px solid #cfb13a',
              mr: 1,
            }}
          />

          <Chip
            avatar={<Iconify icon="mdi:power" sx={{ m: `0px !important` }} />}
            variant="outlined"
            onClick={handleLogout}
            sx={{
              height: 'auto',
              p: 0.5,
              borderRadius: 50,
              border: '2px solid #cfb13a',
              mr: 1,
              '& .MuiChip-label': {
                display: 'none',
              },
            }}
          />

          {/* <LanguagePopover />

          <AccountPopover /> */}
        </Stack>
      </Stack>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: 2 }}>
        <Scrollbar>
          {rooms.map((room) => (
            <Card key={room.roomId} sx={{ bgcolor: 'rgba(0, 0, 0, 0.67)', mt: 1 }}>
              <Stack
                sx={{
                  fontWeight: 'bold',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexDirection: { xs: 'column', sm: 'row' },
                }}
              >
                <Box
                  sx={{
                    height: { xs: 15, sm: 70 },
                    width: { xs: 1, sm: 15 },
                    backgroundColor: '#ffcc00',
                  }}
                />
                <Stack direction="row" alignItems="center" width={1} py={1}>
                  <Stack justifyContent="center" ml={{ xs: 1.5, sm: 3 }} width={1}>
                    <Stack direction="row" alignItems="flex-end" gap={1}>
                      <Typography
                        sx={{
                          color: '#e1c021',
                        }}
                      >
                        {`${t('label.max')} ${room.maxSeats}/ ${room.playerCount} ${t(
                          'label.rooms_active'
                        )}`}
                      </Typography>
                      {!smDown && (
                        <Typography
                          sx={{
                            fontSize: 12,
                          }}
                        >
                          {t('label.minimum_buy_in')} 100,000
                        </Typography>
                      )}
                    </Stack>
                    <Typography>
                      {t('label.small_blind')} {room.roomMinBet / 2}G /{t('label.big_blind')}{' '}
                      {room.roomMinBet}G
                    </Typography>
                  </Stack>
                  <Button
                    disabled={!!disabledButtons[room.roomId]}
                    sx={{
                      px: 0,
                      mr: 2,
                      width: 130,
                      height: 30,
                      color: 'black',
                      borderRadius: 1.5,
                      background: 'url(/assets/pokerking/button/default.png)',
                      backgroundSize: 'cover',
                    }}
                    onClick={() =>  handleClick(room.roomId)}
                  >
                    {t('button.go_to_table')}
                  </Button>
                </Stack>
              </Stack>
            </Card>
          ))}
        </Scrollbar>
      </Container>
    </>
  );
}
