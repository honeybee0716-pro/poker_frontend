import { useState } from 'react';
// @mui
import {
  Stack,
  Typography,
  Avatar,
  IconButton,
  List,
  ListItemButton,
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
import MyProfileView from './my_profile';

// types

// ----------------------------------------------------------------------

const LIST = [
  {
    title: 'bonus',
    description: 'Get extra money by participating in various events',
    icon: 'solar:ticker-star-bold',
  },
  {
    title: 'support',
    description: 'Connect us for issue',
    icon: 'tabler:mail-filled',
  },
  {
    title: 'privacy_policy',
    description: 'Know our privacy policies',
    icon: 'formkit:filedoc',
  },
];

export default function ProfileView() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const myprofile = useBoolean();

  const { user } = useSelector((store) => store.auth);

  const settings = useSettingsContext();

  const [progress, setProgress] = useState(50);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (myprofile.value) return <MyProfileView onBack={() => myprofile.onFalse()} />;

  return (
    <>
      <Stack
        sx={{
          px: 4,
          py: 2,
          height: 133,
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
          spacing={{ xs: 0.5, sm: 3 }}
        >
          <Avatar src="/assets/pokerking/avatars/avatar0.jpg" sx={{ width: 70, height: 70 }} />

          <Stack sx={{ width: 1 }}>
            <Typography variant="h6">ID: {user.id}</Typography>
            <Typography variant="h6">NAME: {user.name}</Typography>
          </Stack>

          <IconButton onClick={() => myprofile.onTrue()}>
            <Iconify icon="uiw:right" />
          </IconButton>
        </Stack>
      </Stack>
      <List component="nav" sx={{ py: 0 }}>
        <ListItemButton sx={{ px: 5 }} selected={selectedIndex === 0}>
          <ListItemIcon>
            <Iconify icon="mdi:fire" sx={{ width: 26, height: 26, color: 'primary.main' }} />
          </ListItemIcon>
          <Stack width={1} gap={0.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography letterSpacing={2} fontWeight="bold">
                {t('label.level')} 89
              </Typography>
              <Typography letterSpacing={2} fontWeight="bold">
                8,871 {t('label.point')}
              </Typography>
            </Stack>
            <LinearProgress variant="determinate" value={progress} />
            <Typography color="text.disabled" fontSize="small" letterSpacing={2}>
              Earn129 more points to reach level 90
            </Typography>
          </Stack>
        </ListItemButton>

        {LIST.map((row) => (
          <ListItemButton key={row.title} sx={{ px: 5 }}>
            <ListItemIcon>
              <Iconify icon={row.icon} sx={{ width: 26, height: 26, color: 'primary.main' }} />
            </ListItemIcon>
            <Stack width={1} gap={0.5}>
              <Typography letterSpacing={2} fontWeight="bold">
                {t(`label.${row.title}`)}
              </Typography>

              <Typography color="text.disabled" fontSize="small" letterSpacing={2}>
                {t(`message.${row.description}`)}
              </Typography>
            </Stack>
          </ListItemButton>
        ))}
      </List>
    </>
  );
}
