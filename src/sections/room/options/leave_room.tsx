import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import {
  Stack,
  Dialog,
  Button,
  Divider,
  Typography,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { useParams, useRouter } from 'src/routes/hooks';
import { dispatch, useSelector } from 'src/store';
import { setCashBuyIn } from 'src/store/reducers/auth';
import useSocket from 'src/hooks/use-socket';
import { useBoolean } from 'src/hooks/use-boolean';
import { fCurrency } from 'src/utils/format-number';
import { IPlayerData, IUser } from 'src/types';
import { SOCKET_KEY } from 'src/config-global';
import { useTranslation } from 'react-i18next';

// ----------------------------------------------------------------------

type Props = {
  player: IUser;
  roomId: string | undefined;
  dialog: any;
  table_money: number;
};

export default function LeaveRoomDialog({ roomId, player, dialog, table_money }: Props) {
  const { t } = useTranslation();
  const { sendSocket } = useSocket();
  const [firstRender, setFirstRender] = useState(true); // State to track first render
  const router = useRouter();

  const username = useSelector((state) => state.auth.user.name);

  const handleClose = () => dialog.onFalse();

  const handleLeaveRoom = () => {
    sendSocket({
      roomId,
      table_money,
      key: SOCKET_KEY.LEAVE_ROOM,
      username,
    });
    dialog.onFalse();
    router.push('/');

    dispatch(setCashBuyIn(0));
  };

  return (
    <>
      <Dialog
        open={dialog.value}
        onClose={handleClose}
        sx={{
          zIndex: 99999,
          '& .MuiPaper-root': {
            p: 3,
            width: 400,
            height: 300,
            letterSpacing: 2,
            bgcolor: '#0000009c',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
      >
        <DialogTitle>
          <Typography component="center">Leave Room</Typography>
          <Divider sx={{ width: 1, mx: 'auto', mt: 1 }} />
        </DialogTitle>
        <DialogContent sx={{ overflow: 'hidden' }}>
          <Stack spacing={10}>
            <Stack textAlign="center">
              <Typography color="text.disabled" fontSize={12}>
                Some Text...
              </Typography>
            </Stack>
            <Stack>
              <Button
                  size="large"
                  type="submit"
                  color="inherit"
                  variant="contained"
                  sx={{
                    height: 30,
                    width: 100,
                    backgroundSize: 'cover',
                    backgroundImage: 'url(../../assets/pokerking/button/button1.png)',
                  }}
                  onClick={handleLeaveRoom}
                >
                  {t('button.ok')}
                </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
