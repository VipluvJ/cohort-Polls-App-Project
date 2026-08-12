import { Routes, Route } from "react-router-dom";

import CreatePoll from "./pages/CreatePoll";
// import PollDetails from "./pages/PollDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<CreatePoll />} />

      {/* <Route path="/poll/:pollId" element={<PollDetails />} /> */}
    </Routes>
  );
}

export default App;
