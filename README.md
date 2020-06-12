# 前端脚手架

## Environment Prepare

Install `node_modules` 如果提示安装核心引擎chromium可ctrl+c跳过:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

### Start project

```bash
npm start
```

or 加入权限验证模块

```bash
npm run start:auth
```

### Build project

后台地址：API_HOST
权限验证：AUTH
参考package.json文件更改打包参数

```bash
npm run build  
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

密码传输时记得加密，私钥定义在'@/utils/utils'中，根据项目的不同与后台协商定义

```javascript
import { encrypt } from '@/utils/utils'; 
encrypt(password);
```

## 关于权限

后端脚手架里统一由assignPermmsion接口获取用户所有的信息，包括路由权限等。
前端项目入口app.js中统一做免密登录判断和路由权限判断(不同用户的首页也在这里实现)，用户信息存在permission模块中。

```javascript
function patchRoutes(routes) {
  // change routes here
}
// set userInfo in permissionModel
window.g_app.model({ ...permissionModel, state: { ...userInfo } });

// how to use
@connect(({ permission }) => ({
  permission,
}))
```
