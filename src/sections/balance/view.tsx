import isEqual from 'lodash/isEqual';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
// hooks
import useApi from 'src/hooks/use-api';
import { setRoles } from 'src/store/reducers/role';
import { useSelector, useDispatch } from 'src/store';
// components
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import {
  useTable,
  getComparator,
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';
// types
import { IBalance, IRole } from 'src/types';
import { IUserTableFilters, IUserTableFilterValue } from 'src/types/user';
//
import BalanceTableRow from './balance-table-row';
import BalanceTableToolbar from './balance-table-toolbar';
import BalanceTableFiltersResult from './balance-table-filters-result';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
];

const TABLE_HEAD = [
  { id: 'id', label: 'User Id', width: 100 },
  { id: 'name', label: 'Name' },
  { id: 'amount', label: 'Amount', width: 200 },
  { id: 'createdAt', label: 'Date', width: 200 },
  { id: 'status', label: 'Status', width: 100 },
  { id: '', width: 88 },
];

const defaultFilters: IUserTableFilters = {
  name: '',
  role: [],
  status: 'all',
};

// ----------------------------------------------------------------------

export default function BalanceView() {
  const table = useTable();
  const dispatch = useDispatch();

  const settings = useSettingsContext();

  const { roles } = useSelector((state) => state.role);

  const { getCharging, getRoles, approveCharging, deleteCharging } = useApi();

  const [userRoles, setUserRoles] = useState<IRole[]>([]);

  const [tableData, setTableData] = useState<IBalance[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const canReset = !isEqual(defaultFilters, filters);

  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

  const handleFilters = useCallback(
    (name: string, value: IUserTableFilterValue) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleApproveRow = useCallback(
    async (id: number) => {
      const res = await approveCharging(id);
      if (!res?.data) return;
      const updatedRow = tableData.map((row) => ({
        ...row,
        status: row.id === id ? true : row.status,
      }));
      setTableData(updatedRow);
    },
    [tableData, approveCharging]
  );

  const handleDeleteRow = useCallback(
    async (id: number) => {
      const res = await deleteCharging(id);
      if (!res?.data) return;
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataInPage.length);
    },
    [dataInPage.length, table, tableData, deleteCharging]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const getList = useCallback(async () => {
    const res = await getCharging();
    if (!res?.data) return;
    setTableData(res.data);
    const _roles: IRole[] = [];
    res.data.forEach((row: any) => {
      const flag = _roles.some((t) => t.id === row.user.role_id);
      const _role = roles.find((role) => role.id === row.user.role_id);
      if (!flag && _role) _roles.push(_role);
    });
    setUserRoles(_roles);
  }, [getCharging, roles]);

  const getRoleList = useCallback(async () => {
    const res = await getRoles();
    if (!res?.data) return;
    dispatch(setRoles(res.data));
  }, [getRoles, dispatch]);

  useEffect(() => {
    getList();
  }, [getList]);

  useEffect(() => {
    getRoleList();
  }, [getRoleList]);
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'lg'}>
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'pending' && 'error') ||
                      (tab.value === 'approved' && 'success') ||
                      'default'
                    }
                  >
                    {tab.value === 'all' && tableData.length}
                    {tab.value === 'pending' && tableData.filter((user) => !user.status).length}

                    {tab.value === 'approved' && tableData.filter((user) => user.status).length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          <BalanceTableToolbar
            filters={filters}
            onFilters={handleFilters}
            //
            roleOptions={userRoles}
          />

          {canReset && (
            <BalanceTableFiltersResult
              roleOptions={userRoles}
              filters={filters}
              onFilters={handleFilters}
              //
              onResetFilters={handleResetFilters}
              //
              results={dataFiltered.length}
              sx={{ p: 2.5, pt: 0 }}
            />
          )}

          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
                {!notFound && (
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                      )
                    }
                  />
                )}

                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <BalanceTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onApproveRow={() => handleApproveRow(row.id)}
                        onDeleteRow={() => handleDeleteRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                  />

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>

          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
            //
            dense={table.dense}
            onChangeDense={table.onChangeDense}
          />
        </Card>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
  filters,
}: {
  inputData: IBalance[];
  comparator: (a: any, b: any) => number;
  filters: IUserTableFilters;
}) {
  const { name, status, role } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (row) =>
        row.user.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 ||
        row.user.email.toLowerCase().indexOf(name.toLowerCase()) !== -1
    );
  }
  if (status === 'pending') {
    inputData = inputData.filter((user) => !user.status);
  }

  if (status === 'approved') {
    inputData = inputData.filter((user) => user.status);
  }

  if (role.length) {
    inputData = inputData.filter((row) => role.includes(row.user.role_id.toString()));
  }

  return inputData;
}
