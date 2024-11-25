  import {
    Home,
    Brands,
    Database,
    Builder,
    ProfilePage
  } from './assets/pages';

export const routes = [
    { path: '/', element: <Home />, title: '' },
    { path: '/brands', element: <Brands />, title: 'Manage Brands' },
    { path: '/database', element: <Database />, title: 'Recent Purchases' },
    { path: '/builder', element: <Builder />, title: 'Builder' },
    { path: '/profile/:customerID', element: <ProfilePage />, title: '' },
  ];