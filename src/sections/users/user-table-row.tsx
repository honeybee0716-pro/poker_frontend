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
import { IUser } from 'src/types';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
//
import UserQuickEditForm from './user-quick-edit-form';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: IUser;
  getList: () => void;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({ row, selected, getList, onSelectRow, onDeleteRow }: Props) {
  const { id, agent_code, name, role, status, email, money, win_count, lose_count, createdAt } =
    row;

  const confirm = useBoolean();

  const quickEdit = useBoolean();

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{id}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{agent_code}</TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Avatar alt={name} src={avatarUrl} sx={{ mr: 2 }} /> */}

          <ListItemText
            primary={name}
            secondary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{
              component: 'span',
              color: 'text.disabled',
            }}
          />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{money}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{role?.label || 'null'}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{win_count}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{lose_count}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {moment(createdAt).format('MMM Do YY, h:mm:ss a')}
        </TableCell>

        <TableCell>
          <Label variant="soft" color={(status && 'success') || (!status && 'error') || 'default'}>
            {status ? 'active' : 'blocked'}
          </Label>
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="Edit" placement="top" arrow>
            <IconButton color="info" onClick={quickEdit.onTrue}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>

          <IconButton
            color="error"
            onClick={() => {
              confirm.onTrue();
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <UserQuickEditForm
        currentUser={row}
        getList={getList}
        open={quickEdit.value}
        onClose={quickEdit.onFalse}
      />

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
