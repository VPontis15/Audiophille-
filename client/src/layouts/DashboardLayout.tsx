import React from 'react';
import { Outlet } from 'react-router';
import Navigation from '../components/Dashboard/Navigation/Navigation';

export default function DashboardLayout(): React.ReactElement {
  return (
    <>
      <main className="grid dashboard grid-cols-[13rem_1fr] gap-8 min-h-screen]">
        <Navigation />
        <Outlet />
      </main>
    </>
  );
}
