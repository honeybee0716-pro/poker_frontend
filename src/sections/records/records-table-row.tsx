import moment from 'moment';
// @mui
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ListItemText from '@mui/material/ListItemText';
import Label from 'src/components/label';
// types
import { IRecord } from 'src/types';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: IRecord;
};

export default function BalanceTableRow({ row, selected }: Props) {
  const { user, current_money, player_cards, action, amount, createdAt } = row;

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

        <TableCell sx={{ whiteSpace: 'nowrap' }}>{current_money}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{player_cards.replaceAll('"', ' ')}</TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Label
            variant="soft"
            color={
              (action === 'CALL' && 'info') ||
              (action === 'CHECK' && 'secondary') ||
              (action === 'WIN' && 'success') ||
              (action === 'RAISE' && 'warning') ||
              (action === 'LOSE' && 'error') ||
              'default'
            }
          >
            {action}
          </Label>
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{amount}</TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {moment(createdAt).format('MMM Do YY, h:mm:ss a')}
        </TableCell>
      </TableRow>
    </>
  );
}
