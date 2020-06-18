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
        path: '/myTasks',
        name: 'tasks',
        routes: [
          {
            path: '/myTasks',
            redirect: '/myTasks/list',
          },
          { 
            path: '/myTasks/relationship',
            name: 'relationship',
            component: './myTasks/Relationship',
            extra: true,
          },
          {
            path: '/myTasks/create',
            name: 'create',
            component: './myTasks/Create',
          },
          {
            path: '/myTasks/list',
            name: 'list',
            component: './myTasks/List',
            extra: true,
          },
          {
            path: '/myTasks/edit',
            name: 'edit',
            component: './myTasks/Edit',
            hideInMenu: true,
          },
          {
            path: '/myTasks/data',
            name: 'data',
            component: './myTasks/Data',
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
