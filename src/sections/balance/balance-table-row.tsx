import moment from 'moment';
// @mui
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IBalance } from 'src/types';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: IBalance;
  onApproveRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function BalanceTableRow({ row, selected, onApproveRow, onDeleteRow }: Props) {
  const { user, status, amount, createdAt } = row;

  const confirmDel = useBoolean();
  const confirmAprove = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{user.id}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <ListItemText
            primary={user.name}
            secondary={user.email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{amount}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {moment(createdAt).format('MMM Do YY, h:mm:ss a')}
        </TableCell>

        <TableCell>
          <Label variant="soft" color={(!status && 'error') || (status && 'success') || 'default'}>
            {!status ? 'pending' : 'approved'}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Approve" placement="top" arrow>
            <IconButton color="success" onClick={confirmAprove.onTrue} disabled={status}>
              <Iconify icon="flowbite:badge-check-outline" />
            </IconButton>
          </Tooltip>

          <IconButton
            color="error"
            onClick={() => {
              confirmDel.onTrue();
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <ConfirmDialog
        open={confirmAprove.value}
        onClose={confirmAprove.onFalse}
        title="Approve"
        content={`Are you sure want to approve '${row.user.name}'? `}
        action={
          <Button
            disabled={status}
            variant="contained"
            color="success"
            onClick={() => {
              onApproveRow();
              confirmAprove.onFalse();
            }}
          >
            Approve
          </Button>
        }
      />

      <ConfirmDialog
        open={confirmDel.value}
        onClose={confirmDel.onFalse}
        title="Delete"
        content={`Are you sure want to delete '${row.user.name}'?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
