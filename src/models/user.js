import { queryCurrent, query as queryUsers, accountLogin } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { routerRedux } from 'dva/router';

const UserModel = {
  namespace: 'login',
  state: {
    loginStatus: {},
  },
  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *login({ payload }, { call, put }) {
      const { errorCallBack, remember, ...rest } = payload;
      const response = yield call(accountLogin, rest);
      if (response) {
        const { name } = response;
        if (name === 'customError') {
          // error
          errorCallBack && errorCallBack(response.msg);
        } else {
          yield put({
            type: 'changeLoginStatus',
            payload: response,
          });
          window.location.href = '/';
        }
      }
    },
    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          token: '',
        },
      });
      yield put(
        routerRedux.push({
          pathname: '/user/login',
        }),
      );
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
    changeLoginStatus(state, { payload }) {
      // 存储token信息
      setAuthority(payload.token);
      return { ...state, loginStatus: payload };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
