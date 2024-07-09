import { useEffect, useRef, useState } from 'react';

// @mui
import { Box, Stack, Typography, Chip, Avatar, LinearProgress, StackProps, Button } from '@mui/material';
import useSocket from 'src/hooks/use-socket';
import useLocales from 'src/locales/use-locales';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';
import { useSelector, useDispatch } from 'src/store';

import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { SOCKET_KEY } from 'src/config-global';
import { getCardResource } from 'src/utils/card';
import { fCurrency } from 'src/utils/format-number';
import playAudio from 'src/utils/audio';
import { IPlayerData, IUserAction } from 'src/types';
// ----------------------------------------------------------------------

type Props = StackProps & {
  index: number;
  dealerId: number;
  roomMinBet: number;
  player: IPlayerData;
  playerCards: IPlayerData[];
  winnerPlayerIds: number[];
  winnerPlayerCards: string[];
  allPlayerCards: IPlayerData[];
  audioRef: any;
  dialog: any;
};


let interval: any = 0;

export default function Player({
  index,
  player,
  dealerId,
  roomMinBet,
  playerCards,
  allPlayerCards,
  winnerPlayerIds,
  winnerPlayerCards,
  audioRef,
  dialog,
  ...other
}: Props) {
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');
  const { user } = useSelector((store) => store.auth);

  const popover = usePopover();
  const avatarRef = useRef(null);
  const { connectionId, lastJsonMessage } = useSocket();

  const showActionText = useBoolean(false);
  const [progress, setProgress] = useState<number>(100);
  const [lastUserAction, setLastUserAction] = useState<IUserAction | null>(null);
  const [cards, setCards] = useState<string[]>([]);

  function playAudioTimeOut() {
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.currentTime = 0;
      audio.play();
    }
  }

  useEffect(() => {
    if (!player || !player.timeLeft || player.timeLeft <= 0) {
      return setProgress(100);
    }
    clearInterval(interval);
    let temp = 0;
    if (player.playerId === connectionId && audioRef.current) {
      playAudioTimeOut();
    }

    interval = setInterval(() => {
      temp += 1;
      setProgress(100 - temp);
    }, player.timeLeft / 100);
    return () => {
      setProgress(100);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player, audioRef]);

  useEffect(() => {
    if (!lastJsonMessage) return;

    const { key, data } = lastJsonMessage;
    if (data && key === SOCKET_KEY.LAST_USER_ACTION) {
      if (audioRef.current && !audioRef.current.paused) audioRef.current.pause();
      setLastUserAction(data);
      showActionText.onTrue();

      setTimeout(() => {
        showActionText.onFalse();
      }, 2000);
    }
  }, [lastJsonMessage, showActionText, audioRef]);

  useEffect(() => {
    if (!avatarRef.current || !lastUserAction) return;
    popover.onOpenRef(avatarRef);
  }, [lastUserAction, avatarRef, popover]);

  useEffect(() => {
    let temp;
    if (!player) return;
    if (
      (player.playerId === connectionId ||
        user.player_role === 'super_player1' ||
        user.player_role === 'super_player2') &&
      playerCards.length
    ) {
      temp = playerCards.find((e) => e.playerId === player.playerId);
    }

    if (player.playerId !== connectionId && allPlayerCards.length) {
      temp = allPlayerCards.find((e) => e.playerId === player.playerId);
    }
    if (temp) setCards(temp?.cards || []);
    else setCards([]);
  }, [player, playerCards, allPlayerCards, connectionId, user.player_role]);

  return (
    <Stack {...other} className={`player-${index}`}>
      {!player ? (
        <Stack sx={{
          p: 0,
          width: { xs: 77, sm: 140 },
          height: { xs: 81, sm: 142 },
          borderRadius: 50,
          cursor: "pointer",
          alignItems: "center",
          userSelect: "none",
          justifyContent: "center",
          background: "url(/assets/pokerking/non_click_seat.png)",
          backgroundSize: "cover",
          "&:active": {
            background: "url(/assets/pokerking/click_seat.png)",
            backgroundPosition: { xs: "-5px 0", sm: "-5px -5px" },
            backgroundSize: "cover",
          },
        }} onClick={dialog.onTrue}>
          <Box sx={{ mt: { xs: 0.9, sm: 3 }, width: { xs: 60, sm: 90 }, textAlign: "center" }}>
            <Typography fontSize={{ xs: 10, sm: 15 }} fontWeight={700} >
              {t("label.click_to_sit_at_the_table")}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Stack sx={{ alignItems: "center", position: "relative" }}>
          <Typography fontSize={{ xs: 13, sm: 16 }}>{player.playerName}</Typography>
          <Avatar ref={avatarRef} src="/assets/pokerking/avatars/avatar3.png" sx={{ width: { xs: 75, sm: 120 }, height: { xs: 75, sm: 120 }, border: player.isPlayerTurn ? "5px solid #00FF00" : "1px solid #FAFF1B" }} />
          <Chip
            avatar={
              <Avatar alt="coin" src="/assets/pokerking/coin.png"
                sx={{
                  width: { xs: `14px !important`, sm: 27 },
                  height: { xs: `14px !important`, sm: 27 }
                }} />
            }
            label={player.playerMoney && fCurrency(Number(player.playerMoney.toFixed(1)))}
            color="primary"
            sx={{
              mt: -2,
              zIndex: 1,
              color: '#FFF',
              borderRadius: 50,
              fontSize: { xs: 12, sm: 16 },
              border: "2px solid #FBFF3D",
              bgcolor: 'rgba(0, 0, 0, 0.93)',
              ...(smDown && {
                height: 23
              })
            }}
          />
          {player.timeLeft !== undefined && player.timeLeft > 0 && (
            <LinearProgress
              variant="determinate"
              color={(progress > 80 && 'success') || (progress < 20 && 'error') || 'warning'}
              value={progress}
              sx={{
                mt: 0.5,
                width: { xs: 0.5, sm: 0.8 },
                ...(smDown && { position: "absolute", bottom: -25, }),
              }}
            />
          )}
          {lastUserAction?.playerId === player.playerId && showActionText.value && (
            <CustomPopover
              open={popover.open}
              onClose={popover.onClose}
              arrow='top-center'
              sx={{
                color: 'black',
                bgcolor: 'rgb(255 255 255 / 80%)',
                '& span': {
                  bgcolor: 'rgb(255 255 255 / 80%)',
                },
              }}
            >
              <Typography sx={{ px: 1, fontSize: { xs: 12, sm: 16 } }}>
                {t(`button.${lastUserAction?.actionText}`)}
              </Typography>
            </CustomPopover>
          )}


          {!player.isFold && (
            <Stack
              sx={{
                width: 1,
                mt: { xs: -7, sm: -11 },
                mr: -5,
                position: 'relative',
                justifyContent: 'center',
                flexDirection: 'row',
              }}
            >
              <Box
                component="img"
                src={`/assets/pokerking/card/${cards.length && cards[0] ? getCardResource(cards[0]) : 'card_back.png'
                  }`}
                sx={{
                  width: { xs: 30, sm: 50 },
                  borderRadius: 0.5,
                  borderColor: 'primary.main',
                  ...(cards.length
                    ? {
                      transform: 'rotate(-9deg)',
                      position: 'absolute',
                      mr: { xs: 3, sm: 5 },
                    }
                    : {
                      border: '2px solid',
                    }),

                  ...(player.playerId !== connectionId &&
                    (user.player_role === 'super_player1' || user.player_role === 'super_player2') &&
                    cards.length && { opacity: 0.7 }),
                }}
              />
              <Box
                component="img"
                src={`/assets/pokerking/card/${cards.length > 1 && cards[1] ? getCardResource(cards[1]) : 'card_back.png'
                  }`}
                sx={{
                  width: { xs: 30, sm: 50 },
                  borderRadius: 0.5,
                  position: 'absolute',
                  borderColor: `primary.main`,
                  ...(cards.length
                    ? {
                      transform: 'rotate(9deg)',
                      ml: { xs: 3, sm: 6 },
                    }
                    : {
                      mt: 1,
                      ml: 5,
                      border: `2px solid`,
                    }),
                  ...(player.playerId !== connectionId &&
                    (user.player_role === 'super_player1' || user.player_role === 'super_player2') &&
                    cards.length && { opacity: 0.7 }),
                }}
              />
            </Stack>
          )}
          {dealerId === player.playerId && (
            <Box
              component="img"
              className="dealer-icon"
              src="/assets/pokerking/dealer.png"
              sx={{ width: { xs: 20, sm: 30 }, height: { xs: 20, sm: 30 }, mt: { xs: 2, sm: 3 }, ml: 5, position: "absolute" }}
            />
          )}
          {player?.totalBet && player.totalBet > 0 ? (
            <Stack sx={{
              justifyContent: 'center',
              alignItems: 'center',
              ...(smDown && {
                position: 'absolute',
                ...(index !== 6 && {
                  top: 95,
                }),
                ...(index === 6 && {
                  top: -50,
                }),
                ...(index > 1 && index < 6 && {
                  left: -20
                }),
                ...(index > 6 && {
                  right: -10
                }),
                "& .MuiChip-label": {
                  px: 0.8
                }
              })
            }}>
              {smDown && <Avatar
                alt="coin"
                src={`/assets/pokerking/chip/${(player.totalBet < roomMinBet && '05') || (player.totalBet > roomMinBet && 2) || 1
                  }.png`}
                // src="/assets/pokerking/chip/05.png"
                sx={{
                  width: `18px !important`,
                  height: `20px !important`,
                }}
              />}
              <Chip
                avatar={
                  !smDown ? <Avatar
                    alt="coin"
                    src={`/assets/pokerking/chip/${(player.totalBet < roomMinBet && '05') || (player.totalBet > roomMinBet && 2) || 1
                      }.png`}
                  // src="/assets/pokerking/chip/05.png"
                  /> : undefined
                }
                label={player.totalBet}
                // label={1000}
                color="primary"
                className="chip-icon"
                sx={{
                  bgcolor: '#000000a6', color: '#FFF',
                  ...(!smDown && {
                    position: "absolute",
                    top: 150,
                  })
                }}
              />
            </Stack>
          ) : (
            <></>
          )}

          {winnerPlayerIds.includes(player.playerId) && (
            <Box
              component="img"
              src="/assets/pokerking/winner.png"
              sx={{ position: 'absolute', width: 120, top: 10, zIndex: 2 }}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
}
