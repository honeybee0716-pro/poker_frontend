import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Theme,
  Stack,
  Dialog,
  Slider,
  Avatar,
  Button,
  Divider,
  SxProps,
  Typography,
  IconButton,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import useLocales from 'src/locales/use-locales';
import useSocket from 'src/hooks/use-socket';
import { useBoolean } from 'src/hooks/use-boolean';
import { fCurrency } from 'src/utils/format-number';
import { IPlayerData, IUser } from 'src/types';
import { SOCKET_KEY } from 'src/config-global';
// ----------------------------------------------------------------------

const iOSBoxShadow =
  '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';

const IOSSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.mode === 'dark' ? '#0a84ff' : '#007bff',
  height: 5,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    boxShadow: '0 0 2px 0px rgba(0, 0, 0, 0.1)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.1)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: iOSBoxShadow,
      },
    },
    '&:before': {
      boxShadow:
        '0px 0px 1px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 1px 0px rgba(0,0,0,0.12)',
    },
  },
  '& .MuiSlider-valueLabel': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&::before': {
      display: 'none',
    },
    '& *': {
      background: 'transparent',
      color: theme.palette.mode === 'dark' ? '#fff' : '#000',
    },
  },
  '& .MuiSlider-track': {
    border: 'none',
    height: 5,
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    boxShadow: 'inset 0px 0px 4px -2px #000',
    backgroundColor: '#d0d0d0',
  },
}));
type Props = {
  player: IUser;
  roomMinBet: number;
  playerCount: number;
  roomId: string | undefined;
  dialog: any;
};

export default function CashBuyDialog({ roomMinBet, playerCount, roomId, player, dialog }: Props) {
  const { t } = useLocales();
  const { sendSocket } = useSocket();

  const marks = [
    {
      value: roomMinBet + roomMinBet / 2,
      label: `${roomMinBet + roomMinBet / 2} G`,
    },
    {
      value: Number(player?.money) || 100,
      label: `${fCurrency(player?.money)}G`,
    },
  ];

  const [amount, setAmount] = useState<number>(10);

  useEffect(() => {
    setAmount(roomMinBet + roomMinBet / 2);
  }, [roomMinBet]);

  const handleJoinRoom = () => {
    if (!roomId || playerCount >= 6) return;
    sendSocket({
      roomId,
      amount,
      key: SOCKET_KEY.SELECT_ROOM,
    });
    dialog.onFalse();
  };

  return (
    <>
      {/* <IconButton
        sx={{ p: 0.5, border: '3px solid', borderColor: 'primary.main' }}
        onClick={dialog.onTrue}
        disabled={playerCount >= 6}
      >
        <Avatar
          alt="coin"
          src="/assets/pokerking/coin.png"
          sx={{ width: 20, height: 20, opacity: playerCount >= 6 ? 0.7 : 1 }}
        />
      </IconButton> */}
      <Dialog
        open={dialog.value}
        onClose={dialog.onFalse}
        sx={{
          zIndex: 99999,
          '& .MuiPaper-root': {
            p: 3,
            width: 480,
            height: 400,
            letterSpacing: 2,
            bgcolor: '#0000009c',
          },
        }}
      >
        <DialogTitle>
          <Typography component="center">{t('label.cash_buy_in')}</Typography>
          <Divider sx={{ width: 0.7, mx: 'auto', mt: 1 }} />
        </DialogTitle>
        <DialogContent sx={{ overflow: 'hidden' }}>
          <Stack flexDirection="row" justifyContent="space-between">
            <Stack>
              <Typography color="text.disabled">{t('label.holdem')}</Typography>
              <Typography>{fCurrency(roomMinBet)}G</Typography>
            </Stack>
            <Stack>
              <Typography color="text.disabled">{t('label.availble_balance')}</Typography>
              <Typography>{fCurrency(player?.money || 0)}G</Typography>
            </Stack>
          </Stack>
          <Divider sx={{ width: 0.7, mx: 'auto', my: 2 }} />
          <Stack textAlign="center">
            <Typography sx={{ fontWeight: 'bold' }}>{fCurrency(amount)}G</Typography>
            <Typography>{t('label.buy_in_amount')}</Typography>
          </Stack>

          <Stack px={2}>
            <IOSSlider
              min={10}
              marks={marks}
              value={amount}
              valueLabelDisplay="auto"
              max={Number(player.money)}
              onChange={(e, value) => {
                setAmount(value as number);
              }}
            />
          </Stack>

          <Stack
            sx={{
              alignItems: 'center',
            }}
          >
            <Button
              size="large"
              type="submit"
              color="inherit"
              variant="contained"
              sx={{
                height: 50,
                width: 180,
                backgroundSize: 'cover',
                backgroundImage: 'url(../../assets/pokerking/button/button1.png)',
              }}
              onClick={handleJoinRoom}
            >
              {t('button.ok')}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
