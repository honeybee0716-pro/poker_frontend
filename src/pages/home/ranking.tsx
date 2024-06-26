import { Helmet } from 'react-helmet-async';
// sections
import RankingView from 'src/sections/ranking/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>PokerKing</title>
      </Helmet>

      <RankingView />
    </>
  );
}
