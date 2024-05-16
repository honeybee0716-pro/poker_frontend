import { useState } from 'react';
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
import { IPlayerData } from 'src/types';
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
  player: IPlayerData | null;
  roomMinBet: number;
};

export default function CashBuyInPopup({ roomMinBet, player }: Props) {
  const { t } = useLocales();
  const dialog = useBoolean();
  const { sendSocket } = useSocket();

  const marks = [
    {
      value: 10,
      label: '10 G',
    },
    {
      value: player?.playerMoney || 100,
      label: `${player?.playerMoney}G`,
    },
  ];

  const [amount, setAmount] = useState<number>(roomMinBet);

  return (
    <>
      <IconButton
        sx={{ p: 0.5, border: '3px solid', borderColor: 'primary.main' }}
        onClick={dialog.onTrue}
      >
        <Avatar alt="coin" src="/assets/pokerking/coin.png" sx={{ width: 20, height: 20 }} />
      </IconButton>
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
        <DialogContent>
          <Stack flexDirection="row" justifyContent="space-between">
            <Stack>
              <Typography color="text.disabled">{t('label.holdem')}</Typography>
              <Typography>{fCurrency(roomMinBet)}G</Typography>
            </Stack>
            <Stack>
              <Typography color="text.disabled">{t('label.availble_balance')}</Typography>
              <Typography>{fCurrency(player?.playerMoney || 0)}G</Typography>
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
              max={player?.playerMoney}
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
            >
              {t('button.ok')}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
