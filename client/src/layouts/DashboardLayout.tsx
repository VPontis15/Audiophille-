import React from 'react';
import { Outlet } from 'react-router';
import Navigation from '../components/Dashboard/Navigation/Navigation';
import DashboardSectionLayout from './DashboardSectionLayout';

export default function DashboardLayout(): React.ReactElement {
  return (
    <main className="grid grid-cols-[14rem_1fr] min-h-screen">
      <Navigation />
      <DashboardSectionLayout>
        <Outlet />
      </DashboardSectionLayout>
    </main>
  );
}
