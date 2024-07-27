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
import { dispatch, useSelector } from 'src/store';
import { signout } from 'src/store/reducers/auth';
// hooks
import { useResponsive } from 'src/hooks/use-responsive';
import useLocales from 'src/locales/use-locales';

// components
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';

// types
import { fCurrency } from 'src/utils/format-number';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

export default function GameBoardView() {
  // const dispatch = useDispatch();
  const { t } = useTranslation();
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
        <Typography variant="h5">
          {!smDown ? t('button.ranking') : `${t('label.hello')} "${store.user?.name}"`}
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

          <Chip
            avatar={<Iconify icon="mdi:power" sx={{ m: `0px !important` }} />}
            variant="outlined"
            onClick={() => dispatch(signout())}
            sx={{
              height: "auto",
              p: 0.5, borderRadius: 50, border: '2px solid #cfb13a', mr: 1,
              "& .MuiChip-label": {
                display: "none"
              }
            }}
          />

          {/* <LanguagePopover />

          <AccountPopover /> */}
        </Stack>
      </Stack>

      <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mt: { xs: 1, sm: 2 }, height: `calc(100% - 180px)` }}>
        <Scrollbar sx={{
          height: 1,
          width: 1,
          [`& .simplebar-content`]: {
            height: 1,
            width: 1,
          }
        }}>
          {smDown && (
            <Typography variant="h5">
              {t('button.ranking')}
            </Typography>
          )}
          <Stack gap={5} height={1}>
            <Stack sx={{
              py: 1,
              px: "2%",
              width: 1,
              bgcolor: "#000",
              borderRadius: 1.9,
              position: "relative",
              border: "1px solid #585858",
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack >
                  <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
                    <Typography variant='h6' fontSize={{ xs: 13, sm: 18 }} sx={{ color: "primary.main" }}>
                      {`[${t('label.gold_crown')}]`}
                    </Typography>
                    <Typography variant='h6' fontSize={{ xs: 13, sm: 18 }}>
                      {t('label.real_time_first_served_products')}
                    </Typography>
                  </Stack>
                  <Typography variant='h6' color="primary.main">
                    <Box component="span" sx={{ color: "#FFF", fontSize: { xs: 22, sm: 30 } }}>
                      7,000,000,000
                    </Box> {t('label.betting')}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Stack>
                    <Box component="img" src="/assets/pokerking/car.png" sx={{ width: { xs: 75, sm: 147 }, height: { xs: 36, sm: 75 } }} />
                    {!smDown && (
                      <Typography mt={-1} mb={1.5}>Mercedes Benz S-Class</Typography>
                    )}
                  </Stack>
                  <Typography variant='h6' fontSize={20}>
                    {t("label.or")}
                  </Typography>
                  <Stack sx={{
                    py: { xs: 0, sm: 1 },
                    px: { xs: 0, sm: 4 },
                    alignItems: "center",
                    ...(!smDown && {
                      borderRadius: 1.9,
                      border: "1px solid #585858"
                    })
                  }}>
                    <Box component="img" src="/assets/pokerking/ticket.png" sx={{ width: { xs: 16, sm: 27 }, height: { xs: 16, sm: 26 } }} />
                    <Typography fontSize={{ xs: 13, sm: 16 }}>{t("label.ticket")}</Typography>
                    <Typography fontSize={{ xs: 12, sm: 14 }} >140,000</Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="row" sx={{
                py: 0.5,
                gap: 1,
                px: 1.5,
                alignItems: "center",
                justifyContent: "flex-end",
                ...(!smDown && {
                  right: 15,
                  bottom: -30,
                  bgcolor: "#000",
                  borderRadius: 1.9,
                  position: "absolute",
                  border: "1px solid #585858",
                }),
              }} >
                <Typography component="span" sx={{ color: "primary.main", fontSize: 13 }}>{t("label.remaining_time")}</Typography>
                <Typography variant='h4'> 00:00:00:00</Typography>
              </Stack>
            </Stack>

            <Stack sx={{
              py: 1,
              px: "2%",
              width: 1,
              bgcolor: "#000",
              borderRadius: 1.9,
              position: "relative",
              border: "1px solid #585858",
            }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack >
                  <Stack direction={{ xs: "column", sm: "row" }} gap={1}>
                    <Typography variant='h6' fontSize={{ xs: 13, sm: 18 }} sx={{ color: "text.disabled" }}>
                      {`[${t('label.gold_crown')}]`}
                    </Typography>
                    <Typography variant='h6' fontSize={{ xs: 13, sm: 18 }}>
                      {t('label.real_time_first_served_products')}
                    </Typography>
                  </Stack>
                  <Typography variant='h6' color="primary.main">
                    <Box component="span" sx={{ color: "#FFF", fontSize: { xs: 22, sm: 30 } }}>
                      3,000,000,000
                    </Box> {t('label.betting')}
                  </Typography>

                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Stack sx={{
                    py: { xs: 0, sm: 1 },
                    px: { xs: 0, sm: 4 },
                    alignItems: "center",
                    ...(!smDown && {
                      mb: 2,
                      borderRadius: 1.9,
                      border: "1px solid #585858"
                    })
                  }}>
                    <Box component="img" src="/assets/pokerking/ticket.png" sx={{ width: { xs: 16, sm: 27 }, height: { xs: 16, sm: 26 } }} />
                    <Typography fontSize={{ xs: 13, sm: 16 }}>Ticket</Typography>
                    <Typography fontSize={{ xs: 12, sm: 14 }} >30,000</Typography>
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="row" sx={{
                py: 0.5,
                gap: 1,
                px: 1.5,
                alignItems: "center",
                justifyContent: "flex-end",
                ...(!smDown && {
                  right: 15,
                  bottom: -30,
                  bgcolor: "#000",
                  borderRadius: 1.9,
                  position: "absolute",
                  border: "1px solid #585858",
                }),
              }}>
                <Typography component="span" sx={{ color: "primary.main", fontSize: 13 }}>{t("label.remaining_time")}</Typography>
                <Typography variant='h4'> 00:00:00:00</Typography>
              </Stack>
            </Stack>


            <Stack gap={0.5}>
              {[...Array(4)].map((_, index) => (
                <Button key={index} sx={{
                  p: 0,
                  px: 1,
                  width: 1,
                  borderRadius: 1.9,
                  border: " 1px solid #585858",
                  bgcolor: "rgba(0, 0, 0, 0.50)",
                }} >
                  <Stack flexDirection="row" width={1} textAlign="center" sx={{
                    py: 1,
                    fontSize: 14,
                    alignItems: "center"
                  }}>
                    <Box width={0.05} minWidth={35} fontSize={{ xs: 12 }}>
                      {index + 1}st.
                    </Box>
                    <Box component="img" src="/assets/pokerking/ranking.png" sx={{ width: 34, height: 31 }} />
                    <Box width={0.65} fontSize={{ xs: 13, sm: 16 }} sx={{
                      whiteSpace: 'nowrap',
                      width: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }} >
                      Player name
                    </Box>
                    {!smDown && (
                      <Box mr={1} color="text.disabled" fontSize={12}>
                        {t("label.betting")}
                      </Box>
                    )}
                    <Box mr={0.5} textAlign="left" fontSize={{ xs: 14, sm: 16 }}>
                      150,246,000
                    </Box >
                    <Box component="img" src="/assets/pokerking/ticket.png" sx={{ width: 20, height: 20 }} />
                    <Box ml={1} textAlign="right">
                      1,502
                    </Box>
                  </Stack>
                </Button>
              ))}
            </Stack>
          </Stack>
        </Scrollbar>
      </Container >
    </>
  );
}
