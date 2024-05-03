import { Helmet } from 'react-helmet-async';
// sections
import RecordsView from 'src/sections/records/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Pokerking Admin: Records</title>
      </Helmet>

      <RecordsView />
    </>
  );
}
