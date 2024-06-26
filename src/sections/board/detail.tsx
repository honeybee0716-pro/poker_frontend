// @mui
import {
  Avatar,
  Box, Chip,
  Stack,
  Container,
  Typography,
  IconButton,
  Divider,
  TextField,
  Button
} from '@mui/material';
// store
import { useSelector } from 'src/store';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import useLocales from 'src/locales/use-locales';

// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { useParams, useRouter } from 'src/routes/hooks';

// types
import { fCurrency } from 'src/utils/format-number';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------


export default function BoardDetail() {
  // const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id, "==>id");

  const { t } = useLocales();
  const router = useRouter();
  const store = useSelector((e) => e.auth);
  // const { sendSocket, lastJsonMessage } = useSocket();
  const settings = useSettingsContext();
  const smDown = useResponsive('down', 'sm');


  return (
    <>
      <Stack
        sx={{
          px: { xs: 1, sm: 4 },
          height: 64,
          bgcolor: '#0000008a',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {!smDown && (
          <Typography variant="h5">
            {t('button.board')}
          </Typography>
        )}

        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0, sm: 1 }}
        >
          {/* {!smDown && <GuidePopover />} */}
          <Chip
            avatar={<Avatar alt="Natacha" src="/assets/pokerking/ticket.png" />}
            label="16"
            variant="outlined"
            sx={{
              px: 1,
              py: 0.5,
              borderRadius: 50,
              border: '2px solid #cfb13a',
              "& .MuiChip-label": {
                minWidth: 50,
                textAlign: 'center'
              }
            }}
          />

          <Chip
            avatar={<Avatar alt="Natacha" src="/assets/pokerking/coin.png" />}
            label={`${fCurrency(Number(store.user?.money || 0).toFixed(2))} G`}
            variant="outlined"
            sx={{
              px: 1, py: 0.5, borderRadius: 50, border: '2px solid #cfb13a'
            }}
          />

          {/* <LanguagePopover />

          <AccountPopover /> */}
        </Stack>
      </Stack>

      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: 1, height: `calc(100% - 180px)` }}>
        <Scrollbar sx={{
          height: 1, [`& .simplebar-content`]: {
            height: 1,
          }
        }}>
          <Stack gap={2} height={1} >
            <Stack direction="row" alignItems="center" gap={1}>
              <Box height={1}>
                <IconButton sx={{ p: 0.5, color: "#FFF" }} onClick={router.back}>
                  <Iconify icon="ph:caret-left-bold" width={{ xs: 25, sm: 33 }} height={{ xs: 25, sm: 33 }} />
                </IconButton>
              </Box>
              <Typography variant='h5'>
                The poker project aims to develop a cutting-edge online platform for players
              </Typography>
            </Stack>
            <Typography fontSize={15} height={1} >
              The poker project aims to develop a cutting-edge online platform for players to enjoy a realistic and engaging poker experience. Through innovative features such as live tournaments, customizable avatars, and interactive chat options, this project seeks to bring the excitement of poker to players from around the world. Stay tuned for updates on our progress!
            </Typography>
            <Stack gap={1}>
              <Typography fontSize={15}>Comments(999)</Typography>
              <Divider />
              <Stack direction="row" gap={0.5} >
                <TextField
                  multiline
                  minRows={2}
                  maxRows={999}
                  sx={{ width: 1, [`& .MuiOutlinedInput-root`]: { p: 1, bgcolor: "#252525", } }}
                />
                <Button color='primary' variant='contained' sx={{ color: "#000" }}>
                  Write
                </Button>
              </Stack>
              <Typography>Player Name</Typography>
            </Stack>
          </Stack>
        </Scrollbar>
      </Container >
    </>
  );
}
