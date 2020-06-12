
export default [
  {
    path: '/user',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      {
        path: '/',
        redirect: '/welcome',
      },
      {
        path:'/welcome',
        name: 'welcome',
        component: './Welcome',
      },
      {
        path: '/account',
        name: 'account',
        hideInMenu: true,
        component: './User/Setting',
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
