import { Helmet } from 'react-helmet-async';
// sections
import RoomView from 'src/sections/room/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>PokerKing</title>
      </Helmet>

      <RoomView />
    </>
  );
}
