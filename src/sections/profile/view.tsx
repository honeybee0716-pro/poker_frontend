import { useState } from 'react';
// @mui
import {
  Stack,
  Typography,
  Avatar,
  Button,
  TextField,
  Box,
  ListItemIcon,
  LinearProgress,
} from '@mui/material';
// store
import { useSelector, useDispatch } from 'src/store';
// hooks
import useLocales from 'src/locales/use-locales';
import { useBoolean } from 'src/hooks/use-boolean';
// components
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { useTranslation } from 'react-i18next';
import { UploadAvatarButton } from 'src/components/avatar';


// types

// ----------------------------------------------------------------------

const Description = [
  {
    withdraw:
      'Make sure to enter your account number in the box\n The name of the bank, the depositor, and the account number must all be written.\nIf you enter the amount at the bottom after writing it and press the application, the withdrawal will proceed,\nso please make sure there is no mistake in writing it',
  },
  {
    deposit:
      'Please enter the amount to deposit\nYou have to apply for the deposit amount before deposit and then deposit it into your bank account.',
  },
];

export default function ProfileView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const page_status = useBoolean();

  const { user } = useSelector((store) => store.auth);

  const settings = useSettingsContext();

  const [progress, setProgress] = useState(50);
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <>
      <Stack
        sx={{
          px: 8,
          py: 1,
          height: '17vh',
          bgcolor: '#0000008a',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5">{t('label.my_profile')}</Typography>

        <Stack
          width={1}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 1, sm: 3  }}
        >
          <Stack sx={{width:0.5}}>
            <UploadAvatarButton/>
          </Stack>
          <Stack sx={{ width: 1, gap:2 }}>
            <Typography variant="h6">Name: {user.name}</Typography>
            <Typography variant="h6">ID: {user.id}</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{
          px: 2,
          py: 2,
          height: '15vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack
          width={1}
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 1, sm: 1.5 }}
        >
          <Stack direction="row" justifyContent="space-between" sx={{ width: 1 }}>
            <Typography variant="h6">Balance</Typography>
            <Typography variant="h6">0G</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ width: 1}}>
            <Stack>
              <Typography variant="h6">Ticket</Typography>
            </Stack>
            <Stack direction="row" alignItems="center">
              <Typography variant="h6">0</Typography>
              <Avatar
                alt="telegram"
                src="/assets/pokerking/ticket.png"
                sx={{ width: { xs: 15, sm: 20 }, height: { xs: 15, sm: 20 } }}
              />
            </Stack>

          </Stack>
          <Stack direction="row" justifyContent="space-between" sx={{ width:1}}>
            <Stack>
              <Typography variant="h6">Rakeback</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography variant="h6">0</Typography>
              <Button color="primary" variant="contained" sx={{ borderRadius: 5 }}>
                <Typography fontSize={10} color="black" fontWeight="bold" noWrap>
                  Deposit a Ticket
                </Typography>
              </Button>
              <Button color="primary" variant="contained" sx={{ borderRadius: 5 }}>
                <Typography fontSize={10} color="black" fontWeight="bold" noWrap>
                  Deposit a Balance
                </Typography>
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Stack direction="row" sx={{ width: 1, px: 1 }}>
        <Stack
          onClick = {() => page_status.onFalse()}
          sx={{
            px: 1,
            bgcolor: page_status.value ? '#252525BD' : '#0000008a',
            cursor: 'pointer', 
          }}
        >
          <Typography variant="h6">Deposit</Typography>
        </Stack>
        <Stack
        onClick = {() => page_status.onTrue()}
          sx={{
            px: 1,
            bgcolor:  page_status.value ? '#0000008a' : '#252525BD',
            cursor: 'pointer', 
          }}
        >
          <Typography variant="h6">Withdraw</Typography>
        </Stack>
      </Stack>
      <Stack
        sx={{
          px: 2,
          py: 2,
          height: '65vh',
          bgcolor: '#000000BD',
        }}
      >
        <Stack
          width={1}
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 1, sm: 1.5 }}
        >
          <Stack sx={{ width: 1 }}>
            <Typography variant="h6">{page_status.value ? "Withdraw" : "Deposit"}</Typography>
          </Stack>
          <Stack sx={{ width: 1 }}>
            <Typography fontSize={14} style={{ whiteSpace: 'pre-line' }}>
              {page_status.value? Description[0].withdraw: Description[1].deposit}
            </Typography>
          </Stack>
          <Stack sx={{ width: 1 }}>
            <Typography variant="h6">{page_status.value? "1. Please enter your account number": "1. Request for purchase"}</Typography>
            <Stack direction="row" sx={{ width: 1, gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
              <TextField
                hiddenLabel
                dir="rtl"
                id="filled-hidden-label-small"
                variant="filled"
                size="small"
                sx={{width:0.7}}
              />{!page_status.value &&
                <Button color="primary" variant="contained" sx={{ borderRadius: 5,width:{xs:0.5, sm:0.2} }}>
                <Typography fontSize={12} color="black" fontWeight="bold" noWrap>
                  Deposit application
                </Typography>
              </Button>}

            </Stack>
          </Stack>
          <Stack sx={{ width: 1 }}>
            <Typography variant="h6">{page_status.value? "2. Enter the amount to withdraw": "2. Check bank account"}</Typography>
            <Stack
              direction="row"
              sx={{ width: 1, gap: 1, alignItems: 'center', justifyContent: 'space-between' }}
            >
              <TextField
                hiddenLabel
                dir="rtl"
                id="filled-hidden-label-small"
                variant="filled"
                size="small"
                sx={{width:0.7}}
              />
              {page_status.value ? (
                <Button color="primary" variant="contained" sx={{ borderRadius: 5,width:{xs:0.5, sm:0.2} }}>
                  <Typography fontSize={12} color="black" fontWeight="bold" noWrap>
                    Withdraw application
                  </Typography>
                </Button>
              ) : (
                <Button color="primary" variant="contained" sx={{ borderRadius: 5,width:{xs:0.5, sm:0.2} }}>
                  <Typography fontSize={12} color="black" fontWeight="bold" noWrap>
                  Check account number
                  </Typography>
                </Button>
              )}
            </Stack>
          </Stack>
          <Stack direction="row" sx={{ width: 1, gap: 1, alignItems: 'center' }}>
            <Avatar
              alt="telegram"
              src="/assets/icons/home/telegram.jpg"
              sx={{ width: { xs: 15, sm: 20 }, height: { xs: 15, sm: 20 } }}
            />
            <Typography fontSize={12}>Telegram help request</Typography>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
}
