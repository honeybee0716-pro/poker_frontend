// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  LOBBY: '/lobby',
  PROFILE: '/profile',
  WALLET: '/wallet',
  ROOM: '/room',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
  },
  users: { root: ROOTS.LOBBY },
  profile: { root: ROOTS.PROFILE },
  wallet: { root: ROOTS.WALLET },
  room: { root: ROOTS.ROOM, view: (id: number) => `${ROOTS.ROOM}/${id}` },
};
