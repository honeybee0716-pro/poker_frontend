import { useState } from 'react';

// @mui
import { Box, Stack, Typography, Chip, Avatar, LinearProgress, StackProps } from '@mui/material';
// ----------------------------------------------------------------------

type Props = StackProps & {
  isLeft?: boolean;
};

export default function Player({ isLeft, ...other }: Props) {
  return (
    <Stack {...other}>
      <Stack
        sx={{
          zIndex: 1,
          borderRadius: 1,
          flexDirection: 'row',
          alignItems: 'center',
          bgcolor: '#000000cc',
        }}
      >
        {isLeft && (
          <Avatar
            src="/assets/pokerking/avatars/avatar0.jpg"
            sx={{
              width: 70,
              height: 70,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'primary.main',
            }}
          />
        )}

        <Stack sx={{ height: 1, p: 1, textAlign: 'center', position: 'relative' }}>
          <Box sx={{ borderBottom: '1px solid' }}>Alexander Nickol </Box>
          <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
            <Box
              component="img"
              src="/assets/pokerking/coin.png"
              sx={{
                width: 18,
                height: 18,
              }}
            />
            <Typography>13, 775</Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            color="info"
            value={50}
            sx={{ position: 'absolute', bottom: -1, width: 0.9 }}
          />
        </Stack>

        {!isLeft && (
          <Avatar
            src="/assets/pokerking/avatars/avatar0.jpg"
            sx={{
              width: 70,
              height: 70,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'primary.main',
            }}
          />
        )}
      </Stack>
      <Stack
        sx={{
          width: 1,
          top: -40,
          position: 'absolute',
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <Box
          component="img"
          src="/assets/pokerking/card/card_back.png"
          sx={{
            width: 50,
            borderRadius: 0.5,
            border: '2px solid',
            borderColor: 'primary.main',
          }}
        />
        <Box
          component="img"
          src="/assets/pokerking/card/card_back.png"
          sx={{
            mt: 1,
            ml: 5,
            width: 50,
            borderRadius: 0.5,
            border: '2px solid',
            position: 'absolute',
            borderColor: 'primary.main',
          }}
        />
      </Stack>
    </Stack>
  );
}
