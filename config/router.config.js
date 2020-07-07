export default [
  {
    path: '/user',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  {
    path: '/account',
    routes: [
      { path: '/account', component: './User/Setting' },
    ],
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // {
      //   path: '/',
      //   redirect: '/project',
      // },
      {
        path:'/dataset',
        name: 'dataset',
        routes: [
          {
            path: '/dataset/Manage',
            name: 'manage',
            component: './Dataset/Manage',
          },{
            path: '/dataset/Mysql',
            name: 'mysql',
            component: './Dataset/AllDataset',
          },{
            path: '/dataset/Mongodb',
            name: 'mongodb',
            component: './Dataset/AllDataset',
          },{
            path: '/dataset/Hbase',
            name: 'hbase',
            component: './Dataset/AllDataset',
          },{
            path: '/dataset/ES',
            name: 'elasticSearch',
            component: './Dataset/AllDataset',
          },{
            path: '/dataset/Hive',
            name: 'hive',
            component: './Dataset/AllDataset',
          },{
            path: '/dataset/Arango',
            name: 'arangoDB',
            component: './Dataset/AllDataset',
          },
        ]
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
            path: '/myTasks/list',
            name: 'list',
            component: './myTasks/List',
            extra: true,
          },
          {
            path: '/myTasks/create',
            name: 'create',
            component: './myTasks/Create',
          },
          { 
            path: '/myTasks/relationship',
            name: 'relationship',
            component: './myTasks/Relationship',
            extra: true,
          },
          {
            path: '/myTasks/edit',
            name: 'edit',
            component: './myTasks/Edit',
            hideInMenu: true,
          }
        ]
      },
      {
        path: '/dataOperation',
        name: 'dataOperation',
        routes: [
          // {
          //   path: '/dataOperation',
          //   redirect: '/dataOperation',
          // },
          {
            path: '/dataOperation/onlineList',
            name: 'onlineList',
            component: './DataOperation/OnlineList',
            extra: true,
          },
        ]
      },
      {
        path: '/report',
        name: 'report',
        routes: [
          {
            path: '/report/overview',
            name: 'overview',
            component: './Report/Form',
            extra: true,
          },
          {
            path: '/report/news',
            name: 'news',
            component: './Report/Form',
            extra: true,
          },
          {
            path: '/report/company',
            name: 'company',
            component: './Report/Form',
            extra: true,
          },
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
