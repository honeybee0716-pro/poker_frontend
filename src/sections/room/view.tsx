import { useEffect, useState } from 'react';

// @mui
import {
  Box,
  Stack,
  Typography,
  Chip,
  Avatar,
  Container,
  AppBar,
  IconButton,
  Button,
  Slider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// store
import { useSelector, useDispatch } from 'src/store';
// hooks
import useSocket from 'src/hooks/use-socket';
import useLocales from 'src/locales/use-locales';
import { useBoolean } from 'src/hooks/use-boolean';
import { useParams, useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import { GuidePopover } from 'src/layouts/_common';
// components
import Logo from 'src/components/logo';
import Iconify from 'src/components/iconify';
import { fCurrency } from 'src/utils/format-number';
import { useSettingsContext } from 'src/components/settings';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { getCardResource } from 'src/utils/card';

// types
import { SOCKET_KEY } from 'src/config-global';
import { IPlayerData } from 'src/types';

import Player from './player';
// ----------------------------------------------------------------------

const PrettoSlider = styled(Slider)({
  color: '#52af77',
  height: 8,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
      boxShadow: 'inherit',
    },
    '&::before': {
      display: 'none',
    },
  },
  '& .MuiSlider-valueLabel': {
    lineHeight: 1.2,
    fontSize: 12,
    background: 'unset',
    padding: 0,
    width: 32,
    height: 32,
    borderRadius: '50% 50% 50% 0',
    backgroundColor: '#52af77',
    transformOrigin: 'bottom left',
    transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    '&::before': { display: 'none' },
    '&.MuiSlider-valueLabelOpen': {
      transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
    },
    '& > *': {
      transform: 'rotate(45deg)',
    },
  },
});

const CHIP_STYLE = {
  background: 'transparent',
  position: 'absolute',
  gap: 1,
  m: 0,
  '& .MuiAvatar-root': {
    height: 31,
    width: 31,
  },
  '& .MuiChip-label': {
    background: '#00000061',
    borderRadius: '0 10px',
  },
};

const PLAYER_STYLE: any = [
  {
    top: 0,
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      bottom: -34,
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      bottom: -80,
      right: 0,
    },
  },
  {
    top: '20%',
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      left: -34,
      top: 0,
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      left: -100,
      bottom: 0,
    },
  },
  {
    bottom: '20%',
    right: 0,
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      left: -34,
      top: 0,
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      left: -100,
      bottom: 0,
    },
  },
  {
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      top: -34,
      right: 0,
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      top: -80,
      left: 0,
    },
  },
  {
    bottom: '20%',
    left: 0,
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      bottom: 0,
      right: -34,
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      right: -100,
      top: 0,
    },
  },
  {
    top: '20%',
    left: 0,
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      bottom: 0,
      right: -34,
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      right: -100,
      top: 0,
    },
  },
];

export default function ProfileView() {
  const dispatch = useDispatch();
  const { t } = useLocales();
  const router = useRouter();
  const params = useParams();
  const popover = usePopover();
  const { roomId } = params;
  const settings = useSettingsContext();
  const smDown = useResponsive('down', 'sm');
  const { user } = useSelector((store) => store.auth);

  const { sendSocket, lastJsonMessage, connectionId } = useSocket();

  const [totalPot, setTotalPot] = useState<number>(0);
  const [me, setMe] = useState<IPlayerData | null>(null);
  const [raiseCount, setRaiseCount] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [roomMinBet, setRoomMinBet] = useState<number>(0);
  const [middleCards, setMiddleCards] = useState<string[]>([]);
  const [playersData, setPlayersData] = useState<IPlayerData[]>([]);
  const [playerCards, setPlayerCards] = useState<IPlayerData[]>([]);
  const [allPlayerCards, setAllPlayerCards] = useState<IPlayerData[]>([]);
  const [winnerPlayerIds, setWinnerPlayerIds] = useState<number[]>([]);
  const [winnerPlayerCards, setWinnerPlayerCards] = useState<string[]>([]);

  const [dealerId, setDealerId] = useState<number>(-1);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(false);
  const [isCallSituation, setIsCallSituation] = useState<boolean>(false);
  const [actionButtonsEnabled, setActionButtonsEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) return;
    sendSocket({
      roomId: -1,
      key: SOCKET_KEY.GET_ROOMS,
      playerId: user?.id,
      roomSortParam: 'all',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!roomId) return;

    sendSocket({
      roomId,
      key: SOCKET_KEY.SELECT_ROOM,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    const { key, data } = lastJsonMessage;
    if (data && key === SOCKET_KEY.ROOM_PARAM) {
      setMiddleCards([]);
      setPlayerCards([]);
      setAllPlayerCards([]);
      setWinnerPlayerIds([]);
      setWinnerPlayerCards([]);
      const dealer = data.playersData.find((e: any) => e.isDealer === true);
      setDealerId(dealer?.playerId || -1);
      setRoomMinBet(data.roomMinBet);
    }

    if (data && key === SOCKET_KEY.HOLE_CARDS) {
      setPlayerCards(data.players);
    }

    if (data && key === SOCKET_KEY.ALL_PLAYERS_CARDS) {
      setAllPlayerCards(data.players);
    }

    if (data && key === SOCKET_KEY.STATUS_UPDATE) {
      setTotalPot(data.totalPot);
      setCurrentStatus(data.currentStatus);
      setRoomName(data.roomName);
      setPlayersData(data.playersData);
      setMiddleCards(data.middleCards);
      setIsCallSituation(data.isCallSituation);

      if (data.isResultsCall) {
        setWinnerPlayerIds(data.roundWinnerPlayerIds);
        setWinnerPlayerCards(data.roundWinnerPlayerCards);
      } else {
        setWinnerPlayerIds([]);
        setWinnerPlayerCards([]);
      }
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (!playersData.length) return;
    const player = playersData.find((e) => e.playerId === connectionId);
    if (!player) return;
    setMe(player);
    setIsPlayerTurn(player.isPlayerTurn ?? false);
    setActionButtonsEnabled(!player.isFold);
  }, [playersData, connectionId]);

  const goBack = () => {
    sendSocket({
      roomId,
      key: SOCKET_KEY.DISCONNECT_ROOM,
    });
    router.push('/');
  };

  const handleFold = () => {
    if (!actionButtonsEnabled || !isPlayerTurn) return;
    sendSocket({
      roomId,
      key: SOCKET_KEY.SET_FOLD,
    });
    setPlayerCards([]);
    setActionButtonsEnabled(false);
    setIsPlayerTurn(false);
  };

  const handleCheck = () => {
    if (!actionButtonsEnabled || !isPlayerTurn) return;
    sendSocket({
      roomId,
      key: SOCKET_KEY.SET_CHECK,
    });
    setActionButtonsEnabled(false);
  };

  const handleRaise = () => {
    if (!actionButtonsEnabled || !isPlayerTurn) return;
    // if (raiseCount == raiseMoney) {
    //   playingSound("assets/sounds/player_all_in.mp3");
    // }
    sendSocket({
      roomId,
      amount: raiseCount,
      key: SOCKET_KEY.SET_RAISE,
    });
    setRaiseCount(0);
    setActionButtonsEnabled(false);
    popover.onClose();
  };

  return (
    <Stack
      sx={{
        background: `url(/assets/pokerking/board.png)`,
        height: 1,
        backgroundPosition: 1,
        backgroundSize: 'cover',
      }}
    >
      <AppBar sx={{ p: 3, zIndex: 9999 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" gap={{ xs: 0.5, sm: 4 }}>
            <Logo />
            <IconButton
              sx={{ p: 0.5, border: '3px solid', borderColor: 'primary.main' }}
              onClick={goBack}
            >
              <Iconify icon="basil:logout-solid" sx={{ color: 'primary.main' }} />
            </IconButton>
          </Stack>
          <Stack direction="row" gap={{ xs: 0.5, sm: 4 }}>
            <GuidePopover sx={{ padding: '5px' }} />
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
              <Typography>{currentStatus}</Typography>
              <Stack direction="row" gap={1}>
                {middleCards.length
                  ? middleCards.map((card: string, index: number) => (
                      <Box
                        key={index}
                        component="img"
                        src={`/assets/pokerking/card/${getCardResource(card)}`}
                        sx={{
                          width: 50,
                        }}
                      />
                    ))
                  : [...Array(3)].map((_, index) => (
                      <Box
                        key={index}
                        component="img"
                        src="/assets/pokerking/card/card_back.png"
                        sx={{
                          width: 50,
                        }}
                      />
                    ))}
              </Stack>
              <Chip
                avatar={<Avatar alt="coin" src="/assets/pokerking/coin.png" />}
                label={totalPot ? fCurrency(totalPot) : 0}
                color="primary"
                sx={{ bgcolor: '#000000a6', mt: 2, color: '#FFF' }}
              />
            </Stack>
            {playersData.map((player: IPlayerData, index: number) => (
              <Player
                key={index}
                isLeft
                player={player}
                dealerId={dealerId}
                roomMinBet={roomMinBet}
                playerCards={playerCards}
                allPlayerCards={allPlayerCards}
                winnerPlayerIds={winnerPlayerIds}
                winnerPlayerCards={winnerPlayerCards}
                sx={PLAYER_STYLE[index]}
              />
            ))}
          </Stack>
        </Stack>
      </Container>
      <Container maxWidth={settings.themeStretch ? false : 'md'} sx={{ width: 1, zIndex: 9999 }}>
        <Stack
          direction="row"
          sx={{ p: 3, justifyContent: 'space-between', opacity: isPlayerTurn ? 1 : 0.7 }}
        >
          <Button
            variant="contained"
            color="error"
            sx={{
              py: 1,
              px: 3,
              width: 120,
              height: 50,
              borderRadius: 50,
              background: 'url(/assets/pokerking/button/fold_button.png)',
              backgroundSize: 'cover',
            }}
            onClick={handleFold}
          >
            {t(`button.FOLD`)}
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              py: 1,
              px: 3,
              width: 120,
              height: 50,
              borderRadius: 50,
              background: 'url(/assets/pokerking/button/call_button.png)',
              backgroundSize: 'cover',
            }}
            onClick={handleCheck}
          >
            {t(`button.${isCallSituation ? 'CALL' : 'CHECK'}`)}
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              py: 1,
              px: 3,
              width: 120,
              height: 50,
              borderRadius: 50,
              background: 'url(/assets/pokerking/button/raise_button.png)',
              backgroundSize: 'cover',
            }}
            onClick={(e) => {
              if (!actionButtonsEnabled || !isPlayerTurn) return;
              popover.onOpen(e);
            }}
          >
            {t('button.RAISE')}
          </Button>
        </Stack>
      </Container>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{
          mt: -1.25,
          zIndex: 99999,
        }}
        arrow="bottom-center"
      >
        <Stack direction="row" gap={1}>
          <Stack>
            <Stack direction="row" gap={0.5}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  setRaiseCount(raiseCount + 100);
                }}
              >
                +100
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  setRaiseCount(raiseCount * 2);
                }}
              >
                x2
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  setRaiseCount(me?.playerMoney || 0);
                }}
              >
                {t('button.ALL')}
              </Button>
            </Stack>
            <Stack direction="row" alignItems="center">
              <PrettoSlider
                valueLabelDisplay="auto"
                aria-label="pretto slider"
                value={raiseCount}
                onChange={(e, value) => {
                  setRaiseCount(value as number);
                }}
                max={me?.playerMoney || 0}
                sx={{ width: 0.7 }}
              />
              <Stack sx={{ textAlign: 'right', width: 0.3, pr: 1 }}>
                <Typography>{raiseCount}</Typography>
              </Stack>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            color="warning"
            size="small"
            sx={{ height: 60 }}
            disabled={!actionButtonsEnabled || !isPlayerTurn}
            onClick={handleRaise}
          >
            {t('button.RAISE')}
          </Button>
        </Stack>
      </CustomPopover>
    </Stack>
  );
}
