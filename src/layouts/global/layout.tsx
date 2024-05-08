import { SyntheticEvent, useEffect, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Tab, Tabs } from '@mui/material';
// hooks
import Iconify from 'src/components/iconify';
import useLocales from 'src/locales/use-locales';
import { usePathname, useRouter } from 'src/routes/hooks';
import { useResponsive } from 'src/hooks/use-responsive';

//
import Main from './main';
import Header from './header';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

const NAVBAR = [
  {
    value: 'lobby',
    icon: 'material-symbols:data-table-rounded',
  },
  {
    value: 'profile',
    icon: 'iconamoon:profile-fill',
  },
  {
    value: 'wallet',
    icon: 'mingcute:wallet-line',
  },
  {
    value: 'shop',
    icon: 'majesticons:shopping-cart',
  },
];
export default function DashboardLayout({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocales();
  const smDown = useResponsive('down', 'sm');

  const [navbar, setNavbar] = useState<string>('lobby');

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    router.push(newValue);
    setNavbar(newValue);
  };

  useEffect(() => {
    const nav = NAVBAR.find((e) => pathname.includes(e.value));
    setNavbar(nav?.value || 'lobby');
  }, [pathname]);

  const renderBg = (
    <Stack
      sx={{
        minWidth: { xs: 1, sm: 0.3, md: 0.5 },
        background: {
          xs: `url(/assets/pokerking/board_bg.jpg) no-repeat center / cover`,
          sm: `url(/assets/pokerking/board_bg.jpg) no-repeat -395px / cover`,
        },
      }}
    >
      <Stack
        sx={{
          height: 1,
          bgcolor: '#00000078',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h1" sx={{ fontFamily: `'Yellowtail', sans-serif` }}>
          {t('label.casino_poker')}
        </Typography>
        <Typography>{t('message.Experience the biggest casino poker right now')}</Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      <Header />

      <Stack
        sx={{
          height: 1,
          width: 1,
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {!smDown && renderBg}
        <Stack sx={{ height: 1, width: 1, position: 'relative' }}>
          <Main
            sx={{
              background: `url(/assets/pokerking/board.png) no-repeat center / cover`,
            }}
          >
            {children}
          </Main>
          <Tabs
            value={navbar}
            onChange={handleChange}
            sx={{
              width: 1,
              bottom: 0,
              bgcolor: '#1603038a',
              position: 'absolute',
              '& .MuiTabs-flexContainer': {
                py: 2,
                px: { xs: 2, sm: 8 },
                justifyContent: 'space-between',
              },
              '& .MuiTab-root.Mui-selected': {
                color: '#cfb13a',
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#cfb13a',
              },
            }}
          >
            {NAVBAR.map((e) => (
              <Tab
                key={e.value}
                value={e.value}
                label={t(`button.${e.value}`)}
                iconPosition="top"
                icon={<Iconify icon={e.icon} width={24} height={24} />}
              />
            ))}
          </Tabs>
        </Stack>
      </Stack>
    </>
  );
}
