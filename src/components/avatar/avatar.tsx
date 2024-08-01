import React, { useRef, useState } from 'react';
import { Button, Avatar, Stack, Typography } from '@mui/material';

const UploadAvatarButton: React.FC = () => {
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Stack alignItems="center" spacing={1}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Avatar
        src={avatar as string}
        alt="Avatar"
        // sx={{ width: 70, height: 70, cursor: 'pointer' }}
        sx={{ cursor: 'pointer', width: { xs: 50, sm: 70 }, height: { xs: 50, sm: 70 } }}
        onClick={handleButtonClick}
      />
      <Button
        color="primary"
        variant="contained"
        sx={{ borderRadius: 1}}
        onClick={handleButtonClick}
      >
        <Typography fontSize={10} color="black" fontWeight="bold" noWrap>
          Change avatar
        </Typography>
      </Button>
    </Stack>
  );
};

export default UploadAvatarButton;
