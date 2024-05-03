// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

// hooks
import { useResponsive } from 'src/hooks/use-responsive';

// ----------------------------------------------------------------------

type Props = {
  title?: string;
  image?: string;
  children: React.ReactNode;
};

export default function AuthClassicLayout({ children, image, title }: Props) {
  const mdUp = useResponsive('up', 'md');

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        height: 1,
        opacity: 0.831,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
      }}
    >
      <Stack
        sx={{
          p: 5,
          width: 1,
          height: 1,
          maxWidth: 500,
          maxHeight: 550,
          borderRadius: 3,
          backgroundColor: '#000000',
        }}
      >
        {children}
      </Stack>
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      spacing={4}
      alignItems="center"
      justifyContent="center"
      sx={{
        // ...bgGradient({
        //   color: alpha(
        //     theme.palette.background.default,
        //     theme.palette.mode === 'light' ? 0.88 : 0.94
        //   ),
        //   imgUrl: '/assets/background/overlay_2.jpg',
        // }),
        opacity: 0.588,
        backgroundColor: '#000000',
      }}
    >
      <Box
        component="img"
        alt="auth"
        src={image || '/assets/pokerking/login_bg.jpg'}
        sx={{
          width: 1,
          height: 1,
        }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        height: '100vh',
      }}
    >
      {mdUp && renderSection}

      {renderContent}
    </Stack>
  );
}
