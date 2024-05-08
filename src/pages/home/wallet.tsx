import { Helmet } from 'react-helmet-async';
// sections
import WalletView from 'src/sections/wallet/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>PokerKing : Wallet</title>
      </Helmet>

      <WalletView />
    </>
  );
}
