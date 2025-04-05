import React from 'react';
import { Outlet } from 'react-router';
import Navigation from '../components/Dashboard/Navigation/Navigation';
import DashboardSectionLayout from './DashboardSectionLayout';
import ScrollToTop from '../components/components/ui/ScrollToTop';

export default function DashboardLayout(): React.ReactElement {
  return (
    <main className="grid grid-cols-[14rem_1fr] min-h-screen">
      <ScrollToTop />
      <Navigation />
      <DashboardSectionLayout>
        <Outlet />
      </DashboardSectionLayout>
    </main>
  );
}
