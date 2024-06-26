import { SyntheticEvent, useEffect, useState } from 'react';
// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Box, Tab, Tabs } from '@mui/material';
// hooks
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
    icon: 'ic_lobby.png',
    sx: {
      width: {
        xs: 24, sm: 39
      },
      height: {
        xs: 20, sm: 34
      }
    }
  },
  {
    value: 'board',
    icon: 'ic_task.png',
    sx: {
      width: {
        xs: 17, sm: 25
      },
      height: {
        xs: 19, sm: 24
      }
    }
  },
  {
    value: 'ranking',
    icon: 'ic_level.png',
    sx: {
      width: {
        xs: 17, sm: 21
      },
      height: {
        xs: 23, sm: 28
      }
    }
  },
  {
    value: 'myaccount',
    icon: 'ic_wallet.png',
    sx: {
      width: {
        xs: 29, sm: 39
      },
      height: {
        xs: 27, sm: 39
      }
    }
  },
  {
    value: 'more',
    icon: 'ic_more.png',
    sx: {
      width: { sm: 38, md: 48 },
      height: {
        xs: 25, sm: 28
      }
    }
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

  const VideoPlayer = (
    <div>
      <video height="100%" autoPlay controls>
        <source src="/assets/pokerking/video/40510-360.mp4" type="video/mp4" />
        <track kind="captions" src="path_toyour_caption_file.vtt" label="English" />
        Your browser does not support the video tag.
      </video>
    </div>
  );

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
      {/* {VideoPlayer} */}
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
            scrollButtons={false}
            sx={{
              width: 1,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.55)',
              position: 'absolute',
              '& .MuiTabs-flexContainer': {
                py: { xs: 1.5, sm: 2 },
                px: { xs: 1, sm: "5%" },
                justifyContent: 'space-between',
              },
            }}
          >
            {NAVBAR.map((e) => (
              <Tab
                key={e.value}
                value={e.value}
                iconPosition="top"
                label={t(`button.${e.value}`)}
                sx={{ fontSize: { xs: 12, sm: 14 }, mr: { xs: `0px !important` } }}
                icon={<Box component="img" src={`/assets/pokerking/menu/${e.icon}`} sx={e.sx} />}
              />
            ))}
          </Tabs>
        </Stack>
      </Stack>
    </>
  );
}
