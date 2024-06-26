import { Helmet } from 'react-helmet-async';
// sections
import GameLobbyView from 'src/sections/lobby/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>PokerKing</title>
      </Helmet>

      <GameLobbyView />
    </>
  );
}
