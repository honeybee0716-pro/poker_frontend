import * as Yup from 'yup';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import useApi from 'src/hooks/use-api';
// types
import { IRole } from 'src/types';
// components
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentRow: IRole;
  getList: () => void;
};

export default function UserQuickEditForm({ currentRow, open, onClose, getList }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { updateRoles } = useApi();

  const NewUserSchema = Yup.object().shape({
    id: Yup.number().required('Id is required'),
    label: Yup.string().required('Label is required'),
    fee: Yup.number().min(0).required('Money is required'),
    type: Yup.string().oneOf(['player', 'agent', 'super_admin']).required('Type is required'),
  });

  const defaultValues = useMemo(
    () => ({
      id: currentRow.id,
      label: currentRow.label,
      fee: Number(currentRow.fee),
      type: currentRow.type,
    }),
    [currentRow]
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
      const res = await updateRoles(data as any);
      if (!res?.data) return;
      getList();
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
        <DialogTitle>Update </DialogTitle>

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
            <RHFTextField name="id" label="Role Id" inputProps={{ readOnly: true }} />
            <RHFTextField name="type" label="Type" inputProps={{ readOnly: true }} />
            <RHFTextField name="label" label="Label" />
            <RHFTextField name="fee" label="Fee" type="number" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Update
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
