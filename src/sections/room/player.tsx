import { useEffect, useRef, useState } from 'react';

// @mui
import { Box, Stack, Typography, Chip, Avatar, LinearProgress, StackProps } from '@mui/material';
import useSocket from 'src/hooks/use-socket';
import useLocales from 'src/locales/use-locales';
import { useBoolean } from 'src/hooks/use-boolean';
import { useSelector, useDispatch } from 'src/store';

import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { SOCKET_KEY } from 'src/config-global';
import { getCardResource } from 'src/utils/card';
import { fCurrency } from 'src/utils/format-number';
import playAudio from 'src/utils/audio';
import { IPlayerData, IUserAction } from 'src/types';
// ----------------------------------------------------------------------

type Props = StackProps & {
  isLeft?: boolean;
  dealerId: number;
  roomMinBet: number;
  player: IPlayerData;
  playerCards: IPlayerData[];
  winnerPlayerIds: number[];
  winnerPlayerCards: string[];
  allPlayerCards: IPlayerData[];
  audioRef: any;
};
let interval: any = 0;

export default function Player({
  isLeft,
  player,
  dealerId,
  roomMinBet,
  playerCards,
  allPlayerCards,
  winnerPlayerIds,
  winnerPlayerCards,
  audioRef,
  ...other
}: Props) {
  const { t } = useLocales();
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
    if (!player.timeLeft || player.timeLeft <= 0) {
      return setProgress(100);
    }
    clearInterval(interval);
    let index = 0;
    if (player.playerId === connectionId && audioRef.current) {
      playAudioTimeOut();
    }

    interval = setInterval(() => {
      index += 1;
      setProgress(100 - index);
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
    if (
      (player.playerId === connectionId || user.player_role === 'super_player1') &&
      playerCards.length
    ) {
      temp = playerCards.find((e) => e.playerId === player.playerId);
    }

    if (player.playerId !== connectionId && allPlayerCards.length) {
      temp = allPlayerCards.find((e) => e.playerId === player.playerId);
    }
    if (temp) setCards(temp?.cards || []);
    else setCards([]);
  }, [player.playerId, playerCards, allPlayerCards, connectionId, user.player_role]);

  return (
    <Stack sx={{ alignItems: 'center' }} {...other}>
      <Stack
        sx={{
          zIndex: 1,
          borderRadius: 1,
          flexDirection: 'row',
          alignItems: 'center',
          bgcolor: '#000000cc',
          opacity: player.isFold ? 0.5 : 1,
        }}
      >
        {isLeft && (
          <Avatar
            ref={avatarRef}
            src="/assets/pokerking/avatars/avatar0.jpg"
            sx={{
              width: 70,
              height: 70,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'primary.main',
            }}
          />
        )}

        <Stack sx={{ height: 1, p: 1, textAlign: 'center', position: 'relative' }}>
          <Box sx={{ borderBottom: '1px solid' }}>{player.playerName} </Box>
          <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
            <Box
              component="img"
              src="/assets/pokerking/coin.png"
              sx={{
                width: 18,
                height: 18,
              }}
            />
            <Typography>
              {player.playerMoney && fCurrency(Number(player.playerMoney.toFixed(1)))}
            </Typography>
          </Stack>
          {player.timeLeft !== undefined && player.timeLeft > 0 && (
            <LinearProgress
              variant="determinate"
              color={(progress > 80 && 'success') || (progress < 20 && 'error') || 'warning'}
              value={progress}
              sx={{ position: 'absolute', bottom: -1, width: 0.9 }}
            />
          )}
        </Stack>

        {!isLeft && (
          <Avatar
            ref={avatarRef}
            src="/assets/pokerking/avatars/avatar0.jpg"
            sx={{
              width: 70,
              height: 70,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'primary.main',
            }}
          />
        )}
      </Stack>
      {lastUserAction?.playerId === player.playerId && showActionText.value && (
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          sx={{
            color: 'black',
            bgcolor: 'rgb(255 255 255 / 80%)',
            '& span': {
              bgcolor: 'rgb(255 255 255 / 80%)',
            },
          }}
        >
          <Typography sx={{ px: 1 }}>{t(`button.${lastUserAction?.actionText}`)}</Typography>
        </CustomPopover>
      )}

      {!player.isFold && (
        <Stack
          sx={{
            width: 1,
            top: cards.length ? -60 : -40,
            position: 'absolute',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <Box
            component="img"
            src={`/assets/pokerking/card/${
              cards.length && cards[0] ? getCardResource(cards[0]) : 'card_back.png'
            }`}
            sx={{
              width: 50,
              borderRadius: 0.5,
              borderColor: 'primary.main',
              ...(cards.length
                ? {
                    transform: 'rotate(-9deg)',
                    position: 'absolute',
                    mr: 5,
                  }
                : {
                    border: '2px solid',
                  }),

              ...(player.playerId !== connectionId &&
                user.player_role === 'super_player1' &&
                cards.length && { opacity: 0.7 }),
            }}
          />
          <Box
            component="img"
            src={`/assets/pokerking/card/${
              cards.length > 1 && cards[1] ? getCardResource(cards[1]) : 'card_back.png'
            }`}
            sx={{
              width: 50,
              borderRadius: 0.5,
              position: 'absolute',
              borderColor: `primary.main`,
              ...(cards.length
                ? {
                    transform: 'rotate(9deg)',
                    ml: 6,
                  }
                : {
                    mt: 1,
                    ml: 5,
                    border: `2px solid`,
                  }),
              ...(player.playerId !== connectionId &&
                user.player_role === 'super_player1' &&
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
          sx={{ width: 30, height: 30 }}
        />
      )}
      {player?.totalBet && player.totalBet > 0 ? (
        <Chip
          avatar={
            <Avatar
              alt="coin"
              src={`/assets/pokerking/chip/${
                (player.totalBet < roomMinBet && '05') || (player.totalBet > roomMinBet && 2) || 1
              }.png`}
            />
          }
          label={player.totalBet}
          color="primary"
          className="chip-icon"
          sx={{ bgcolor: '#000000a6', mt: 2, color: '#FFF' }}
        />
      ) : (
        <></>
      )}

      {winnerPlayerIds.includes(player.playerId) && (
        <Box component="img" src="/assets/pokerking/winner.png" sx={{ mt: 0.5, width: 80 }} />
      )}
    </Stack>
  );
}
