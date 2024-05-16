// @mui
import {
  Theme,
  Stack,
  Dialog,
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
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------
type Props = {
  roomMinBet: number;
  playerCount: number;
};

export default function RoomInforPopup({ playerCount, roomMinBet }: Props) {
  const { t } = useLocales();
  const dialog = useBoolean();

  return (
    <>
      <IconButton
        sx={{ p: 0.5, border: '3px solid', borderColor: 'primary.main' }}
        onClick={dialog.onTrue}
      >
        <Iconify icon="fa6-solid:info" sx={{ color: 'primary.main' }} />
      </IconButton>
      <Dialog
        open={dialog.value}
        onClose={dialog.onFalse}
        sx={{
          zIndex: 99999,
          '& .MuiPaper-root': {
            p: 3,
            width: 480,
            height: 300,
            letterSpacing: 2,
            bgcolor: '#0000009c',
          },
        }}
      >
        <DialogTitle>
          <Typography component="center">{t('label.table_information')}</Typography>
          <Divider sx={{ width: 0.7, mx: 'auto', mt: 1 }} />
        </DialogTitle>
        <DialogContent>
          <Stack gap={2}>
            <Stack>
              <Typography color="text.disabled">{t('label.number_of_players')}</Typography>
              <Typography>{playerCount}</Typography>
            </Stack>
            <Stack>
              <Typography color="text.disabled">{t('label.min_buy_in')}</Typography>
              <Typography>{roomMinBet}</Typography>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
