let authRoutes = null;
function filterRoute(menuList, routes) {
  for (let i = 0; i < routes.length; i++) {
    const { path, redirect } = routes[i];
    if (!path) {
    } else if (path === '/user') {
    } else if (path === '/') {
      if (routes[i].routes) {
        filterRoute(menuList, routes[i].routes);
      }
    } else if (menuList.indexOf(path) > -1) {
      // 遍历子节点
      if (routes[i].routes) {
        filterRoute(menuList, routes[i].routes);
      }
    } else {
      // delete
      routes.splice(i, 1);
      i--;
    }
  }
}
export function patchRoutes(routes) {
  // if (authRoutes) {
  //   const { role } = authRoutes;
  //   if (role === 1) {
  //     const menuList = ['/project', '/manager', '/account'];
  //     filterRoute(menuList, routes);
  //   } else if (role === 2) {
  //     const menuList = ['/projectSub', '/managerSub', '/account'];
  //     filterRoute(menuList, routes);
  //   } else {
  //     const menuList = ['/projectSub', '/account'];
  //     filterRoute(menuList, routes);
  //   }
  //   const master = routes.find(v=>v.path==='/');
  //   master.routes[0].redirect = master.routes[1].path;
  // }
}

export function render(oldRender) {
  let url = '/api/project/assignPermission';
  if (process.env.NODE_ENV === 'production') {
    url = process.env.API_HOST + url;
  }
  const token = localStorage.getItem('dqkkToken');
  if (!process.env.AUTH) {
    oldRender();
    return;
  }
  if (token) {
    // 获取permission，存储在globaldva中, timeout设置
    // 优化： 入场loading
    // 思考： 为什么不在layout中做fetch，1.闪屏
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        Authorizations: token,
      },
    })
      .then(res => res.json())
      .then(res => {
        const {
          header: { code },
        } = res;
        if (code === 200) {
          const { body } = res;
          authRoutes = body;
          window.g_app.model({ ...permissionModel, state: { ...authRoutes } });
          oldRender();
        } else {
          backToLogin(oldRender);
        }
      })
      .catch(e => {
        backToLogin(oldRender);
      });
  } else {
    backToLogin(oldRender);
  }
}
const backToLogin = oldRender => {
  window.g_app.model({ ...permissionModel, state: authRoutes });

  const router = require('umi/router');
  router.push('/user/login');
  oldRender();
};

const permissionModel = {
  namespace: 'permission',
  state: {},
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};
