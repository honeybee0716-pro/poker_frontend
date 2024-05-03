import { Helmet } from 'react-helmet-async';
// sections
import AgentsView from 'src/sections/agents/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> Pokerking Admin: Agents</title>
      </Helmet>

      <AgentsView />
    </>
  );
}
