import { Helmet } from 'react-helmet-async';
// sections
import GameBoardView from 'src/sections/board/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>PokerKing</title>
      </Helmet>

      <GameBoardView />
    </>
  );
}
