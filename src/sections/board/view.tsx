// @mui
import {
  Avatar,
  Box, Chip,
  Stack,
  Container,
  Typography,
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
import { useRouter } from 'src/routes/hooks';

// types
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function GameBoardView() {
  // const dispatch = useDispatch();
  const { t } = useLocales();
  const router = useRouter();
  const store = useSelector((e) => e.auth);
  // const { sendSocket, lastJsonMessage } = useSocket();
  const settings = useSettingsContext();
  const smDown = useResponsive('down', 'sm');

  const handleDetail = (id: number) => {
    router.push(`${id}`);
  }

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
        <Typography variant="h5">
          {!smDown ? t('button.board') : `${t('label.hello')} "${store.user?.name}"`}
        </Typography>

        <Stack
          flexGrow={1}
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={{ xs: 0, sm: 1 }}
        >
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

      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: { xs: 1, sm: 2 }, height: `calc(100% - 180px)` }}>
        <Scrollbar sx={{
          height: 1, [`& .simplebar-content`]: {
            height: 1,
          }
        }}>
          {smDown && (
            <Typography variant="h5">
              {t('button.board')}
            </Typography>
          )}
          <Stack gap={1}>
            <Stack flexDirection="row" width={1} textAlign="center" fontSize={13}>
              <Box width={0.05} minWidth={30}>
                {t('label.no')}
              </Box>
              <Box width={0.65}>
                {t('label.title')}
              </Box>
              <Box width={0.1} minWidth={50}>
                {t('label.writer')}
              </Box>
              <Box width={0.07} minWidth={50}>
                {t('label.view')}
              </Box >
              <Box width={0.13} minWidth={74}>
                {t('label.comments')}
              </Box>
            </Stack>
            {[...Array(4)].map((_, index) => (
              <Button key={index} sx={{
                p: 0, bgcolor: "#000",
                borderRadius: 1.9,
                border: "1px solid #575757",
                boxShadow: " 0px 4px 4px 0px rgba(0, 0, 0, 0.55)",
              }} onClick={() => handleDetail(index + 1)}>
                <Stack flexDirection="row" width={1} textAlign="center" sx={{
                  py: 1,
                  fontSize: 13,

                }}>
                  <Box width={0.05} minWidth={30}>
                    {index + 1}
                  </Box>
                  <Box width={0.65} sx={{
                    whiteSpace: 'nowrap',
                    width: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }} >
                    The poker project aims to develop a cutting-edge online platform for players
                  </Box>
                  <Box width={0.1} minWidth={50}>
                    NAME
                  </Box>
                  <Box width={0.07} minWidth={50}>
                    9999
                  </Box >
                  <Box width={0.13} minWidth={74}>
                    9999
                  </Box>
                </Stack>
              </Button>
            ))}
          </Stack>

        </Scrollbar>
      </Container >
    </>
  );
}
