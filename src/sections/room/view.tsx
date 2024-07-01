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
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
// store
import { useSelector, useDispatch } from 'src/store';
// hooks
import useSocket from 'src/hooks/use-socket';
import useLocales from 'src/locales/use-locales';
import { useParams, useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';
import { useBoolean } from 'src/hooks/use-boolean';
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
import CashBuyDialog from './options/cash_buy';
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

const EMOJI_MESSAGES = ["😒", "😘", "😊", "😂", "😍", "😁", "🤦‍♂️", "😐", "😢", "😎", "🤷‍♂️", "🤑", "😤", "🤔", "👍", "🤩", "🥳", "🤯", "🤤", "😱", "🤨", "😋"];

const FREE_MESSAGE = ["hello", "nice_to_meet_you", "good", "nice_card"];
const PAID_MESSAGE = ["fuck_you_man", "sucks_my_card", "fucking_asshole"];

export default function ProfileView() {
  const dispatch = useDispatch();
  const { t } = useLocales();
  const router = useRouter();
  const params = useParams();
  const popover = usePopover();

  const emojPropover = usePopover();
  const messagePropover = usePopover();
  const cashBuyDialog = useBoolean();

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

  const [open, setOpen] = useState<boolean>(false);

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Stack
      sx={{
        background: `url(/assets/pokerking/background.png)`,
        height: 1,
        backgroundPosition: 1,
        backgroundSize: 'cover',
      }}
    >
      <AppBar sx={{ px: 3, pt: 1, zIndex: 9999 }}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="row" gap={{ xs: 0.5, sm: 4 }} alignItems="center">
            <Logo sx={{ width: { xs: 80, sm: 100 } }} />
            {/* {isPlay && !smDown && <Typography>#10202049506</Typography>} */}
          </Stack>
          <Stack direction="row" gap={{ xs: 0.5, sm: 4 }}>
            <Button sx={{
              width: { xs: 53, sm: 66 },
              height: { xs: 52, sm: 66 },
              minWidth: 40,
              minHeight: 40,
              background: "url(/assets/pokerking/non_click_menu.png)",
              backgroundSize: "cover",
              "&:hover": {
                background: "url(/assets/pokerking/mouse_over_menu.png)",
                backgroundSize: "cover",
              },
              "&:active": {
                background: "url(/assets/pokerking/click_menu.png)",
                backgroundSize: "cover",
              },
              zIndex: 99
            }} />
          </Stack>
        </Stack>
      </AppBar>
      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ height: { xs: 0.9, sm: 1 }, width: 1 }}>
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
        <Stack justifyContent="center" alignItems="center" width={1} height={1}>
          <Stack
            sx={{
              mt: 2.5,
              width: 1,
              height: 1,
              maxHeight: 641,
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack
              sx={{
                width: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                sx={{
                  width: { xs: 320, sm: 0.8 },
                  // minWidth: 252
                }}
                src={`/assets/pokerking/table_${smDown ? 'mobile' : 'desktop'}.png`}
              />
              <Box
                component="img"
                src="/logo/logo_watermark.png"
                sx={{ position: 'absolute', width: 150 }}
              />
              <Stack sx={{
                position: 'absolute',
                alignItems: 'center',
                ...(!smDown && {
                  justifyContent: 'center',
                })
              }}>
                <Stack textAlign="center" mt={-14}>
                  <Typography fontSize={{ xs: 10, sm: 18 }}>
                    0000G/0000G , 00people
                  </Typography>
                  <Typography>{currentStatus}</Typography>
                </Stack>

                <Stack direction="row" gap={1} justifyContent="center">
                  {middleCards.length
                    ? middleCards.map((card: string, index: number) => (
                      <Box
                        key={index}
                        component="img"
                        src={`/assets/pokerking/card/${getCardResource(card)}`}
                        sx={{
                          width: { xs: 30, sm: 50 },
                          ...(user.player_role === 'super_player2' &&
                            middleCardNum < index && { opacity: 0.7 }),
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
                  sx={{ bgcolor: '#000000a6', mt: 2, color: '#FFF', width: "fit-content" }}
                />

              </Stack>


              {!smDown ? (
                <>
                  <Stack sx={{
                    top: 0,
                    width: 0.85,
                    flexDirection: "row",
                    position: "absolute",
                    justifyContent: "space-between",
                    "& .player-0, & .player-3": {
                      mt: 8
                    }
                  }}>
                    {[...Array(4)].map((_, index) => (
                      <Player
                        key={index}
                        index={index}
                        player={playersData[index]}
                        dealerId={dealerId}
                        roomMinBet={roomMinBet}
                        playerCards={playerCards}
                        allPlayerCards={allPlayerCards}
                        winnerPlayerIds={winnerPlayerIds}
                        winnerPlayerCards={winnerPlayerCards}
                        audioRef={audioRef}
                        dialog={cashBuyDialog}
                      />
                    ))}
                  </Stack>
                  <Stack sx={{
                    width: 1,
                    flexDirection: "row",
                    position: "absolute",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}>
                    {[...Array(2)].map((_, index) => (
                      <Player
                        key={index}
                        index={8 / (index + 1)}
                        player={playersData[8 / (index + 1)]}
                        dealerId={dealerId}
                        roomMinBet={roomMinBet}
                        playerCards={playerCards}
                        allPlayerCards={allPlayerCards}
                        winnerPlayerIds={winnerPlayerIds}
                        winnerPlayerCards={winnerPlayerCards}
                        audioRef={audioRef}
                        dialog={cashBuyDialog}
                      />
                    ))}
                  </Stack>
                  <Stack sx={{
                    bottom: 0,
                    width: 0.85,
                    flexDirection: "row",
                    position: "absolute",
                    justifyContent: "space-between",
                    "& .player-7, & .player-5": {
                      mt: -8
                    }
                  }}>
                    {[...Array(3)].map((_, index) => (
                      <Player
                        key={index}
                        index={7 - index}
                        player={playersData[7 - index]}
                        dealerId={dealerId}
                        roomMinBet={roomMinBet}
                        playerCards={playerCards}
                        allPlayerCards={allPlayerCards}
                        winnerPlayerIds={winnerPlayerIds}
                        winnerPlayerCards={winnerPlayerCards}
                        audioRef={audioRef}
                        dialog={cashBuyDialog}
                      />
                    ))}
                  </Stack>
                </>
              ) : (
                <>
                  <Stack sx={{
                    top: -10,
                    width: 0.5,
                    flexDirection: "row",
                    position: "absolute",
                    justifyContent: "space-between",
                  }}>
                    {[...Array(2)].map((_, index) => (
                      <Player
                        key={index}
                        index={index}
                        player={playersData[index]}
                        dealerId={dealerId}
                        roomMinBet={roomMinBet}
                        playerCards={playerCards}
                        allPlayerCards={allPlayerCards}
                        winnerPlayerIds={winnerPlayerIds}
                        winnerPlayerCards={winnerPlayerCards}
                        audioRef={audioRef}
                        dialog={cashBuyDialog}
                      />
                    ))}
                  </Stack>
                  <Stack sx={{
                    top: 0,
                    width: 0.9,
                    height: 1,
                    flexDirection: "row",
                    position: "absolute",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}>
                    <Stack position="relative" left={0} justifyContent="space-between" height={0.75}>
                      {[...Array(4)].map((_, index) => (
                        <Player
                          key={index}
                          index={10 - index}
                          player={playersData[10 - index]}
                          dealerId={dealerId}
                          roomMinBet={roomMinBet}
                          playerCards={playerCards}
                          allPlayerCards={allPlayerCards}
                          winnerPlayerIds={winnerPlayerIds}
                          winnerPlayerCards={winnerPlayerCards}
                          audioRef={audioRef}
                          dialog={cashBuyDialog}
                        />
                      ))}
                    </Stack>
                    <Stack position="relative" right={0} justifyContent="space-between" height={0.75}>
                      {[...Array(4)].map((_, index) => (
                        <Player
                          key={index}
                          index={2 + index}
                          player={playersData[2 + index]}
                          dealerId={dealerId}
                          roomMinBet={roomMinBet}
                          playerCards={playerCards}
                          allPlayerCards={allPlayerCards}
                          winnerPlayerIds={winnerPlayerIds}
                          winnerPlayerCards={winnerPlayerCards}
                          audioRef={audioRef}
                          dialog={cashBuyDialog}
                        />
                      ))}
                    </Stack>
                  </Stack>
                  <Stack sx={{
                    bottom: -25,
                    width: 0.85,
                    flexDirection: "row",
                    position: "absolute",
                    justifyContent: "center",
                    zIndex: 99
                  }}>
                    <Player
                      index={6}
                      player={playersData[5]}
                      dealerId={dealerId}
                      roomMinBet={roomMinBet}
                      playerCards={playerCards}
                      allPlayerCards={allPlayerCards}
                      winnerPlayerIds={winnerPlayerIds}
                      winnerPlayerCards={winnerPlayerCards}
                      audioRef={audioRef}
                      dialog={cashBuyDialog}
                    />
                  </Stack>
                </>
              )}

            </Stack>
          </Stack>
        </Stack>

      </Container>
      <Stack direction="row" width={1} px={1} justifyContent="space-between" position="relative">
        <Stack
          direction="row"
          width={210}
          sx={{
            gap: { xs: 0.5, sm: 1 },
            alignItems: "center",
            ...(smDown && {
              top: -40,
              position: "absolute",
            })
          }}>
          <Button sx={{
            width: { xs: 53, sm: 86 },
            height: { xs: 52, sm: 71 },
            background: "url(/assets/pokerking/non_click_emoji.png)",
            backgroundSize: "cover",
            "&:hover": {
              background: "url(/assets/pokerking/mouse_over_emoji.png)",
              backgroundSize: "cover",
            },
            "&:active": {
              background: "url(/assets/pokerking/click_emoji.png)",
              backgroundSize: "cover",
            },
            zIndex: 99
          }}
            onClick={emojPropover.onOpen}
          />
          <Button sx={{
            width: { xs: 53, sm: 86 },
            height: { xs: 52, sm: 71 },
            background: "url(/assets/pokerking/non_click_text.png)",
            backgroundSize: "cover",
            "&:hover": {
              background: "url(/assets/pokerking/mouse_over_text.png)",
              backgroundSize: "cover",
            },
            "&:active": {
              background: "url(/assets/pokerking/click_text.png)",
              backgroundSize: "cover",
            },
            zIndex: 99
          }}
            onClick={messagePropover.onOpen}
          />
        </Stack>
        <Stack
          direction="row"
          width={{ xs: 1, sm: 1, md: 0.6 }}
          sx={{ p: 3, justifyContent: 'space-between', opacity: 1, gap: 1 }}
        >
          <Box
            sx={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: { xs: 14, sm: 16 },
              width: { xs: 125, sm: 319 },
              borderRadius: { xs: 1, sm: 50 },
              cursor: "pointer",
              background: `url(/assets/pokerking/button/non_click_folds${smDown ? "_mobile" : ""}.png)`,
              "&:hover": {
                background: "url(/assets/pokerking/button/mouse_over_folds.png)",
                backgroundSize: "contain",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat"
              },
              "&:active": {
                background: `url(/assets/pokerking/button/click_folds${smDown ? "_mobile" : ""}.png)`,
                backgroundSize: "contain",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat"
              },
              backgroundSize: "contain",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat"
            }}
            onClick={handleFold}
          />
          <Box
            // variant="contained"
            // color="error"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: { xs: 14, sm: 16 },
              width: { xs: 125, sm: 319 },
              height: { xs: 59, sm: 71 },
              borderRadius: { xs: 1, sm: 50 },
              cursor: "pointer",
              background: `url(/assets/pokerking/button/non_click_calls${smDown ? "_mobile" : ""}.png)`,
              "&:hover": {
                background: "url(/assets/pokerking/button/mouse_over_calls.png)",
                backgroundSize: "contain",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat"
              },
              "&:active": {
                background: `url(/assets/pokerking/button/click_calls${smDown ? "_mobile" : ""}.png)`,
                backgroundSize: "contain",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat"
              },
              backgroundSize: "contain",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat"
            }}
            onClick={handleCheck}
          />
          <Box
            // variant="contained"
            // color="error"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              borderRadius: { xs: 1, sm: 50 },
              fontSize: { xs: 14, sm: 16 },
              width: { xs: 125, sm: 319 },
              height: { xs: 59, sm: 71 },
              cursor: "pointer",
              background: `url(/assets/pokerking/button/non_click_raise${smDown ? "_mobile" : ""}.png)`,
              "&:hover": {
                background: "url(/assets/pokerking/button/mouse_over_raise.png)",
                backgroundSize: "contain",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat"
              },
              "&:active": {
                background: `url(/assets/pokerking/button/click_raise${smDown ? "_mobile" : ""}.png)`,
                backgroundSize: "contain",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat"
              },
              backgroundSize: "contain",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat"
            }}
            onClick={(e) => {
              if (!actionButtonsEnabled || !isPlayerTurn) return;
              popover.onOpen(e);
            }}
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-end" width={210}
          sx={{
            alignItems: "center",
            ...(smDown && {
              top: -40,
              right: 0,
              position: "absolute",
            })
          }}>
          <Button sx={{
            width: { xs: 53, sm: 86 },
            height: { xs: 52, sm: 71 },
            background: "url(/assets/pokerking/non_click_sidegame.png)",
            backgroundSize: "cover",
            "&:hover": {
              background: "url(/assets/pokerking/mouse_over_sidegame.png)",
              backgroundSize: "cover",
            },
            "&:active": {
              background: "url(/assets/pokerking/click_sidegame.png)",
              backgroundSize: "cover",
            },
            zIndex: 99
          }} onClick={handleClickOpen} />
        </Stack>
      </Stack>
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
      <CustomPopover
        open={emojPropover.open}
        onClose={emojPropover.onClose}
        sx={{
          mt: -1.25,
          zIndex: 99999,
        }}
        arrow="bottom-left"
      >
        <Stack p={2}>
          <Typography variant='h4'>
            {t("label.emoji_box")}
          </Typography>
          <Typography>
            {t("label.often_use")}
          </Typography>
          <Stack direction="row">
            <IconButton sx={{ fontSize: 24 }}>
              😊
            </IconButton>
            <IconButton sx={{ fontSize: 24 }}>
              😂
            </IconButton>
            <IconButton sx={{ fontSize: 24 }}>
              😊
            </IconButton>
          </Stack>
          <Typography>
            {t("label.free_message")}
          </Typography>

          <Box sx={{
            gap: 1,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)"
          }}>
            {EMOJI_MESSAGES.map((row, index) => (
              <IconButton key={index} sx={{
                p: 0.5,
                borderRadius: 2.5,
                border: "1px solid #FFF629",
                bgcolor: "rgba(0, 0, 0, 0.60)"
              }}>
                <Typography sx={{ fontSize: 24 }}>{row}</Typography>
              </IconButton>
            ))}
          </Box>

        </Stack>
      </CustomPopover>
      <CustomPopover
        open={messagePropover.open}
        onClose={messagePropover.onClose}
        sx={{
          mt: -1.25,
          zIndex: 99999,
          maxWidth: { xs: 0.9, sm: 402 },
        }}

        arrow={!smDown ? "bottom-left" : "bottom-center"}
      >
        <Stack p={2}>
          <Typography variant='h4'>
            {t("label.message_box")}
          </Typography>
          <Typography>
            {t("label.often_use")}
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap">
            <Button size='small' sx={{
              px: 2,
              py: 1,
              borderRadius: 2.5,
              border: "1px solid #FFF629",
              bgcolor: "rgba(0, 0, 0, 0.60)"
            }}>
              <Typography sx={{ fontSize: 18 }}> Hello~!</Typography>
            </Button>
            <Button size='small' sx={{
              px: 2,
              py: 1,
              borderRadius: 2.5,
              border: "1px solid #FFF629",
              bgcolor: "rgba(0, 0, 0, 0.60)"
            }}>
              <Avatar alt="coin" src="/assets/pokerking/coin.png" sx={{ width: 20, height: 20, mr: 0.5 }} />
              <Typography sx={{ fontSize: 18 }}>Fuck you man</Typography>
            </Button>
          </Stack>
          <Typography my={1}>
            {t("label.free_message")}
          </Typography>

          <Stack sx={{
            gap: 1,
            flexWrap: "wrap",
            flexDirection: "row"
          }}>
            {FREE_MESSAGE.map((text, index) => (
              <Button key={index} size='small' sx={{
                px: 2,
                py: 1,
                borderRadius: 2.5,
                border: "1px solid #FFF629",
                bgcolor: "rgba(0, 0, 0, 0.60)"
              }}>
                <Typography sx={{ fontSize: 18 }}>{t(`message.${text}`)}</Typography>
              </Button>
            ))}
          </Stack>

          <Typography my={1}>
            {t("label.paid_message")}
          </Typography>

          <Stack sx={{
            gap: 1,
            flexWrap: "wrap",
            flexDirection: "row"
          }}>
            {PAID_MESSAGE.map((text, index) => (
              <Button key={index} size='small' sx={{
                px: 2,
                py: 1,
                borderRadius: 2.5,
                border: "1px solid #FFF629",
                bgcolor: "rgba(0, 0, 0, 0.60)"
              }}>
                <Avatar alt="coin" src="/assets/pokerking/coin.png" sx={{ width: 20, height: 20, mr: 0.5 }} />
                <Typography sx={{ fontSize: 18 }}>{t(`message.${text}`)}</Typography>
              </Button>
            ))}
          </Stack>
        </Stack>

      </CustomPopover>
      <Box component="audio" ref={audioRef} hidden>
        <source src="/assets/pokerking/sounds/time_out.wav" type="audio/wav" />
        <track kind="captions" srcLang="en" src="" />
      </Box>
      <SideDialog
        open={open}
        onClose={handleClose}
      />
      <CashBuyDialog
        dialog={cashBuyDialog}
        roomMinBet={roomMinBet}
        playerCount={playerCount}
        roomId={roomId}
        player={user}
      />
    </Stack>
  );
}


export interface SideDialogProps {
  open: boolean;
  onClose: () => void;
}

function SideDialog(props: SideDialogProps) {
  const { t } = useLocales();
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{
      "& .MuiBackdrop-root": {
        bgcolor: "transparent"
      }
    }}>
      <DialogTitle textAlign="center">“Player name”  {t('label.requested_a_side_game')}</DialogTitle>
      <DialogContent sx={{ textAlign: "center", pb: 4 }}>
        <Typography variant='h4'>
          {t("label.side_option")} : <Box component="span" color="primary.main">{t("label.all_in_or_folds")}</Box>
          <Typography variant='h6' fontSize={15}>Time: 30 sec</Typography>
        </Typography>
        <LinearProgress variant="determinate" value={50} sx={{ mt: 1, width: { xs: 1, sm: 500 } }} />
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between", width: 0.7, m: "auto", mt: 1 }}>
          <Stack textAlign="center">
            <Typography fontSize={15}>{t('button.agree')}</Typography>
            <Typography variant='h6' fontSize={25}>3</Typography>
          </Stack>
          <Stack textAlign="center">
            <Typography fontSize={15}>{t('button.oppose')}</Typography>
            <Typography variant='h6' fontSize={25}>4</Typography>
          </Stack>
        </Stack>
        <Stack sx={{ flexDirection: "row", justifyContent: "space-between", width: { xs: 1, sm: 0.7 }, m: "auto", mt: 1, gap: 3 }}>
          <Button
            variant="contained"
            color="error"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: { xs: 14, sm: 16 },
              width: 150,
              height: 38,
              borderRadius: 50,
              background: 'url(/assets/pokerking/button/call_button.png)',
              backgroundSize: 'cover',
            }}
          >
            {t('button.agree')}
          </Button>
          <Button
            variant="contained"
            color="error"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              fontSize: { xs: 14, sm: 16 },
              width: 150,
              height: 38,
              borderRadius: 50,
              background: 'url(/assets/pokerking/button/fold_button.png)',
              backgroundSize: 'cover',
            }}
          >
            {t('button.oppose')}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
