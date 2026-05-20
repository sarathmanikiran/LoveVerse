/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreatorDashboard from './pages/CreatorDashboard';
import ProposalViewer from './pages/ProposalViewer';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreatorDashboard />} />
      <Route path="/:proposalId" element={<ProposalViewer />} />
    </Routes>
  );
}

