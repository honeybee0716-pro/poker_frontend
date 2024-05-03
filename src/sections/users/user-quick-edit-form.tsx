import * as Yup from 'yup';
import { useMemo, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import MenuItem from '@mui/material/MenuItem';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { IconButton, InputAdornment } from '@mui/material';

import { useSelector } from 'src/store';

import useApi from 'src/hooks/use-api';
import { useBoolean } from 'src/hooks/use-boolean';
// types
import { IUpdateUser, IUser } from 'src/types';
// components
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const USER_STATUS_OPTIONS = [
  { value: 1, label: 'Active' },
  { value: 0, label: 'Blocked' },
];

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentUser?: IUser;
  getList: () => void;
};

export default function UserQuickEditForm({ currentUser, open, onClose, getList }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useSelector((state) => state.auth);
  const { roles } = useSelector((state) => state.role);

  const password = useBoolean();

  const { updateUser, createUser } = useApi();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string()
      .min(4)
      .test('no-special-characters', 'Special characters are not allowed', (value) => {
        if (!value) return true;
        return /^[a-zA-Z0-9]*$/.test(value);
      })
      .test('no-numbers-only', 'Numbers only are not allowed', (value) => {
        if (!value) return true;
        return !/^\d+$/.test(value);
      })
      .required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    money: Yup.number().min(0).required('Money Id is required'),
    agent_code: Yup.number().min(0).required('Money Id is required'),
    role_id: Yup.number().required('Role Id is required'),
    win_count: Yup.number().min(0).required('Win count Id is required'),
    lose_count: Yup.number().min(0).required('Lose count is required'),
    status: Yup.number().min(0).required('Status is required'),
    password: currentUser?.id
      ? Yup.string()
      : Yup.string()
          .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
          .matches(/[a-z]/, 'Must contain at least one lowercase letter')
          .matches(/[0-9]/, 'Must contain at least one number')
          .required('Password is required'),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      money: Number(currentUser?.money || 0),
      agent_code: currentUser?.agent_code || user.id,
      role_id: currentUser?.role_id || user.role_id + 1,
      win_count: currentUser?.win_count || 0,
      lose_count: currentUser?.lose_count || 0,
      status: currentUser?.status ? 1 : 0,
      password: '',
    }),
    [currentUser, user]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = currentUser?.id
        ? await updateUser({
            ...data,
            id: currentUser?.id,
            status: !!data.status,
          } as any)
        : await createUser({
            ...data,
            status: !!data.status,
          } as any);
      if (!res?.data) return;
      getList();
      reset();
      onClose();
      enqueueSnackbar('Update success!');
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>{currentUser ? 'Update' : 'Create'} </DialogTitle>

        <DialogContent>
          <Box
            mt={3}
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="name" label="Full Name" />
            <RHFTextField name="email" label="Email Address" />
            <RHFTextField
              name="agent_code"
              label="Agent Code"
              type="number"
              inputProps={{ readOnly: true }}
            />
            <RHFSelect name="role_id" label="Role" inputProps={{ readOnly: true }}>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.label}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField name="money" label="Money" type="number" />
            <RHFTextField name="win_count" label="Win count" type="number" />
            <RHFTextField name="lose_count" label="Lose count" type="number" />
            <RHFSelect name="status" label="Status">
              {USER_STATUS_OPTIONS.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </RHFSelect>

            {(!currentUser || user.role_id === 1) && (
              <RHFTextField
                name="password"
                label="Password"
                type={password.value ? 'text' : 'password'}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={password.onToggle} edge="end">
                        <Iconify
                          icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                        />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {currentUser?.id ? `Update` : 'Create'}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
