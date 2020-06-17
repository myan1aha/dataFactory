import {
  getList,
  // listInvestmentScale,
  addTask,
  editTask,
  // getAreaDetail,
  // listIndustry,
  portTask,
  // deleteTask,
  // exportTask,
} from './service';

let PAGESIZE = 10;
if (document.body.clientHeight - 300 > 0) {
  // eslint-disable-next-line radix
  const tempN = parseInt((document.body.clientHeight - 300) / 55);
  if (tempN > 2) {
    // PAGESIZE = tempN;
  }
}

// eslint-disable-next-line func-names
const decreaseFormat = function(payload) {
  const { page, pageSize } = {
    ...{ page: 1, pageSize: PAGESIZE },
    ...payload,
  };
  if (pageSize) PAGESIZE = pageSize;
  return { ...payload, page, pageSize };
};

const initialValue = {
  list: [],
  page: 1,
  pageSize: PAGESIZE,
  total: 0,
  filter: {

  },
  selectDetail: {},
  industryList: [],
  scaleList: [],
};

export default {
  namespace: 'task',
  state: initialValue,
  effects: {
    // *listIndustry({ _ }, { call, put, all }) {
    //   const [industryList, scaleList] = yield all([
    //     yield call(listIndustry),
    //     yield call(listInvestmentScale),
    //   ]);
    //   yield put({
    //     type: 'save',
    //     payload: { industryList, scaleList },
    //   });
    // },

    // *getAreaDetail({ payload }, { call, put }) {
    //   const response = yield call(getAreaDetail, payload);
    //   yield put({
    //     type: 'saveDetail',
    //     payload: response,
    //   });
    // },

    *getList({ payload }, { call, put }) {
      const { page = 1, pageSize, role, ...filter } = payload;
      const params = decreaseFormat(payload);
      const response = yield call(getList, params);
      // console.log(response);
      if (response) {
        yield put({
          type: 'save',
          payload: {
            list: response.list,
            pageSize: params.pageSize,
            page,
          },
        });
        yield put({
          type: 'saveFilter',
          payload: filter,
        });
      }
    },

    *refresh(_, { call, put, select }) {
      let { areaCode, role, userId } = yield select(state => state.permission);
      const { filter, page, pageSize } = yield select(state => state.project);
      if (filter.areaCode) {
        // eslint-disable-next-line prefer-destructuring
        areaCode = filter.areaCode;
      }
      yield put({
        type: 'getList',
        payload: { ...filter, areaCode, role, userId },
      });
      yield put({
        type: 'getAreaDetail',
        payload: { areaCode },
      });
    },

    *addTask({ payload }, { call, put, select }) {
      const response = yield call(addTask, payload);
      if (response) {
        yield put({
          type: 'refresh',
        });
      }
      return response;
    },

    *editTask({ payload }, { call, put, select }) {
      const response = yield call(editTask, payload);
      if (response) {
        yield put({
          type: 'refresh',
        });
      }
      return response;
    },

    *portTask({ payload }, { call, put, select }) {
      const response = yield call(portTask, payload);
      if (response) {
        yield put({
          type: 'refresh',
        });
      }
      return response;
    },
    *deleteTask({ payload }, { call, put, select }) {
      const response = yield call(this.deleteTask, payload);
      if (response) {
        yield put({
          type: 'refresh',
        });
      }
      return response;
    },

  },
  reducers: {
    init() {
      return initialValue;
    },
    saveDetail(state, { payload }) {
      return { ...state, selectDetail: payload };
    },
    saveIndustryList(state, { payload }) {
      return { ...state, industryList: payload };
    },
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveFilter(state, { payload }) {
      return { ...state, filter: { ...state.filter, ...payload } };
    },
  },
};
