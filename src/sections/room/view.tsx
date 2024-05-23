import { useEffect, useRef, useState } from 'react';

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
  Tooltip,
  AvatarGroup,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// store
import { useSelector, useDispatch } from 'src/store';
// hooks
import useSocket from 'src/hooks/use-socket';
import useLocales from 'src/locales/use-locales';
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
import playAudio from 'src/utils/audio';

// types
import { SOCKET_KEY } from 'src/config-global';
import { IPlayerData } from 'src/types';

import Player from './player';
import CashBuyPopup from './options/cash_buy';
import RoomInforPopup from './options/infor';
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
  gap: { xs: 0, sm: 1 },
  m: 0,
  '& .MuiAvatar-root': {
    height: 31,
    width: 31,
  },
  '& .MuiChip-label': {
    background: '#00000061',
    borderRadius: '0 10px',
    pr: { xs: 0.9 },
  },
};

const PLAYER_STYLE: any = [
  {
    top: { xs: -30, sm: 0 },
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      bottom: { xs: -24, sm: -34 },
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      bottom: { xs: -60, sm: -80 },
      right: 0,
    },
  },
  {
    top: '20%',
    right: { xs: -50, sm: 0 },
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      left: { xs: -24, sm: -34 },
      top: 0,
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      left: { xs: -60, sm: -100 },
      bottom: 0,
    },
  },
  {
    bottom: '20%',
    right: { xs: -50, sm: 0 },
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      left: { xs: -24, sm: -34 },
      top: 0,
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      left: { xs: -60, sm: -100 },
      bottom: 0,
    },
  },
  {
    bottom: { xs: -30, sm: 0 },
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      top: { xs: -24, sm: -34 },
      right: 0,
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      top: { xs: -60, sm: -80 },
      left: 0,
    },
  },
  {
    bottom: '20%',
    left: { xs: -50, sm: 0 },
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      bottom: 0,
      right: { xs: -24, sm: -34 },
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      right: { xs: -60, sm: -100 },
      top: 0,
    },
  },
  {
    top: '20%',
    left: { xs: -50, sm: 0 },
    position: 'absolute',
    alignItems: 'center',
    '& .dealer-icon': {
      position: 'absolute',
      bottom: 0,
      right: { xs: -24, sm: -34 },
    },
    '& .chip-icon': {
      ...CHIP_STYLE,
      right: { xs: -60, sm: -100 },
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

  const audioRef = useRef<any>(null);

  const [totalPot, setTotalPot] = useState<number>(0);
  const [me, setMe] = useState<IPlayerData | null>(null);
  const [myIndex, setMyIndex] = useState<number>(3);
  const [raiseCount, setRaiseCount] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<string>('');
  const [roomName, setRoomName] = useState<string>('');
  const [roomMinBet, setRoomMinBet] = useState<number>(0);
  const [playerCount, setPlayerCount] = useState<number>(0);
  const [middleCardNum, setMiddleCardNum] = useState<number>(3);
  const [middleCards, setMiddleCards] = useState<string[]>([]);
  const [playersData, setPlayersData] = useState<IPlayerData[]>([]);
  const [playerCards, setPlayerCards] = useState<IPlayerData[]>([]);
  const [spectators, setSpectators] = useState<IPlayerData[]>([]);
  const [appendPlayers, setAppendPlayers] = useState<IPlayerData[]>([]);
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
      key: SOCKET_KEY.GET_SPECTATE_ROOMS,
      playerId: user?.id,
      roomSortParam: 'all',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!roomId) return;

    sendSocket({
      roomId,
      key: SOCKET_KEY.SELECT_SPECTATE_ROOM,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  useEffect(() => {
    if (!lastJsonMessage) return;
    const { key, data } = lastJsonMessage;
    if (data && key === SOCKET_KEY.ROOM_PARAM) {
      setMiddleCardNum(2);
      setMiddleCards([]);
      setPlayerCards([]);
      setAllPlayerCards([]);
      setWinnerPlayerIds([]);
      setWinnerPlayerCards([]);
      const dealer = data.playersData.find((e: any) => e.isDealer === true);
      setDealerId(dealer?.playerId);
      setRoomMinBet(data.roomMinBet);
      setPlayerCount(data.playerCount);
    }

    if (data && key === SOCKET_KEY.HOLE_CARDS) {
      setMiddleCardNum(2);
      setPlayerCards(data.players);
    }

    if (data && key === SOCKET_KEY.ALL_PLAYERS_CARDS) {
      setMiddleCardNum(4);
      setAllPlayerCards(data.players);
    }

    if (data && key === SOCKET_KEY.STATUS_UPDATE) {
      setTotalPot(data.totalPot);
      setCurrentStatus(data.currentStatus);
      setRoomName(data.roomName);
      setPlayersData(data.playersData);
      setMiddleCards(data.middleCards);
      setIsCallSituation(data.isCallSituation);

      setSpectators(data.spectators);
      setAppendPlayers(data.appendPlayers);
      if (data.isResultsCall) {
        setWinnerPlayerIds(data.roundWinnerPlayerIds);
        setWinnerPlayerCards(data.roundWinnerPlayerCards);

        if (data.roundWinnerPlayerIds.includes(connectionId)) {
          playAudio('winner_player.wav');
        } else {
          playAudio('winner_got_a_chip.wav');
        }
      } else {
        setWinnerPlayerIds([]);
        setWinnerPlayerCards([]);
      }
    }

    if (key === SOCKET_KEY.FLOP) {
      setMiddleCardNum(2);
      playAudio('start_action.mp3');
    }
    if (key === SOCKET_KEY.TURN) {
      setMiddleCardNum(3);
      playAudio('card_drop.wav');
    }
    if (key === SOCKET_KEY.RIVER) {
      setMiddleCardNum(4);
      playAudio('end_flop_turn_river.wav');
    }

    if (data && key === SOCKET_KEY.LAST_USER_ACTION) {
      if (data.actionText === 'CHECK') {
        playAudio('player_check.wav');
      } else if (data.actionText === 'CALL') {
        playAudio('player_call_sound.wav');
      } else if (data.actionText === 'RAISE') {
        playAudio('player_raise_sound.wav');
      } else if (data.actionText === 'FOLD') {
        playAudio('player_fold.wav');
      }
    }
  }, [lastJsonMessage, connectionId]);

  useEffect(() => {
    if (!playersData.length) return;
    const player = playersData.find((e) => e.playerId === connectionId);
    const index = playersData.findIndex((e) => e.playerId === connectionId);
    if (!player || index === -1) return;
    setMe(player);
    setMyIndex(index);
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
    if (!actionButtonsEnabled || !isPlayerTurn || !me?.playerMoney) return;
    if (raiseCount === me.playerMoney) playAudio('player_all_in.mp3');
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
            <CashBuyPopup
              roomMinBet={roomMinBet}
              playerCount={playerCount}
              roomId={roomId}
              player={user}
            />
            <RoomInforPopup
              playerCount={playerCount + appendPlayers.length}
              roomMinBet={roomMinBet}
            />
          </Stack>
        </Stack>
      </AppBar>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ height: 1, width: 1 }}>
        {spectators.length > 0 && (
          <Stack sx={{ position: 'absolute', zIndex: 99999, top: 70 }}>
            <Typography color="info.main" sx={{ fontSize: 12 }}>
              {t('label.spectators')}
            </Typography>
            <AvatarGroup max={4}>
              {spectators.map((player, index) => (
                <Tooltip title={player.playerName} key={index}>
                  <Avatar
                    alt="spectator"
                    sx={{ cursor: 'pointer', bgcolor: 'black' }}
                    src="/assets/pokerking/spectator.png"
                  />
                </Tooltip>
              ))}
            </AvatarGroup>
          </Stack>
        )}

        {appendPlayers.length > 0 && (
          <Stack sx={{ position: 'absolute', zIndex: 99999, top: 70, right: 0 }}>
            <Typography color="success.main" sx={{ fontSize: 12 }}>
              {t('label.append_players')}
            </Typography>
            <AvatarGroup max={4}>
              {appendPlayers.map((player, index) => (
                <Tooltip title={player.playerName} key={index}>
                  <Avatar
                    alt="spectator"
                    sx={{ cursor: 'pointer' }}
                    src="/assets/pokerking/avatars/avatar0.jpg"
                  />
                </Tooltip>
              ))}
            </AvatarGroup>
          </Stack>
        )}

        <Stack
          sx={{
            mt: 5,
            width: 1,
            height: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Stack
            sx={{
              p: { xs: 0, sm: 3 },
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
                          width: { xs: 30, sm: 50 },
                          ...(user.player_role === 'super_player2' &&
                          middleCardNum < index  && { opacity: 0.7 }),
                        }}
                      />
                    ))
                  : [...Array(3)].map((_, index) => (
                      <Box
                        key={index}
                        component="img"
                        src="/assets/pokerking/card/card_back.png"
                        sx={{
                          width: { xs: 30, sm: 50 },
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
            {playersData.map((player: IPlayerData, index: number) => {
              const s_index =
                index < myIndex - 3
                  ? index + playersData.length - (myIndex - 3)
                  : index - (myIndex - 3);
              return (
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
                  audioRef={audioRef}
                  sx={PLAYER_STYLE[s_index]}
                />
              );
            })}
          </Stack>
        </Stack>
      </Container>
      <Container maxWidth={settings.themeStretch ? false : 'md'} sx={{ width: 1, zIndex: 9999 }}>
        <Stack
          direction="row"
          sx={{ p: 3, justifyContent: 'space-between', opacity: isPlayerTurn ? 1 : 0.7, gap: 1 }}
        >
          <Button
            variant="contained"
            color="error"
            sx={{
              py: 1,
              px: 3,
              fontSize: { xs: 14, sm: 16 },
              width: { xs: 120, sm: 150 },
              height: { xs: 50, sm: 70 },
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
              fontSize: { xs: 14, sm: 16 },
              width: { xs: 120, sm: 150 },
              height: { xs: 50, sm: 70 },
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
              borderRadius: 50,
              fontSize: { xs: 14, sm: 16 },
              width: { xs: 120, sm: 150 },
              height: { xs: 50, sm: 70 },
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
      <Box component="audio" ref={audioRef} hidden>
        <source src="/assets/pokerking/sounds/time_out.wav" type="audio/wav" />
        <track kind="captions" srcLang="en" src="" />
      </Box>
    </Stack>
  );
}
