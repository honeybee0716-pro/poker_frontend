// @mui
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Dialog, DialogContent } from '@mui/material';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function GuuidePopover() {
  const dialog = useBoolean();

  return (
    <>
      <IconButton sx={{ border: '2px solid #cfb13a', p: 0.4 }} onClick={() => dialog.onTrue()}>
        <Iconify icon="pepicons-print:question" width={20} height={20} color="#cfb13a" />
      </IconButton>
      <Dialog
        open={dialog.value}
        onClose={() => dialog.onFalse()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box component="img" src="/assets/pokerking/poker_guide.png" sx={{ width: 300 }} />
      </Dialog>
    </>
  );
}
