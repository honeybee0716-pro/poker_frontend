import { Helmet } from 'react-helmet-async';
// sections
import BalanceView from 'src/sections/balance/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> PokerKing Admin: Balance</title>
      </Helmet>

      <BalanceView />
    </>
  );
}
