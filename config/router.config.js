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
        redirect: '/project',
      },
      {
        path:'/project',
        name: 'project',
        component: './Project',
      },
      {
        path: '/tasks',
        name: 'tasks',
        routes: [
          {
            path: '/tasks',
            redirect: '/tasks/list',
          },
          { 
            path: '/tasks/relationship',
            name: 'relationship',
            component: './Tasks/Relationship',
            extra: true,
          },
          {
            path: '/tasks/create',
            name: 'create',
            component: './Tasks/Create',
            extra: true,
          },
          {
            path: '/tasks/list',
            name: 'list',
            component: './Tasks/List',
            extra: true,
          },
          {
            path: '/tasks/edit',
            name: 'edit',
            component: './Tasks/Edit',
          },
          {
            path: '/tasks/data',
            name: 'data',
            component: './Tasks/Data',
            extra: true,
          }
        ]
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
