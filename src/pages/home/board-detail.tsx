import { Helmet } from 'react-helmet-async';
// sections
import BoardDetail from 'src/sections/board/detail';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>PokerKing</title>
      </Helmet>

      <BoardDetail />
    </>
  );
}
