import React from 'react';
import BottomNav from '../components/BottomNav';
import CommunityPage from '../components/community/community-page';

const community = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <CommunityPage />
      <BottomNav />
    </div>
  );
}

export default community;
