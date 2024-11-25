  import {
    Home,
    Brands,
    Database,
    Builder,
    ProfilePage
  } from './assets/pages';

export const routes = [
    { path: '/', element: <Home />, title: '' },
    { path: '/brands', element: <Brands />, title: 'Registered Brands' },
    { path: '/database', element: <Database />, title: 'Recent Purchases' },
    { path: '/builder', element: <Builder />, title: 'Builder' },
  ];