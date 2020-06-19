import { getList, addTask, editTask, portTask, deleteTask, getTaskDetail } from './service';

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
  selectDetail: {},
  scaleList: [],
  filter: {
    proName: '',
    taskName: '',
    dataInputs: [],
    dataOutputs: [],
    taskDependencies: '',
    parentNode: '',
    command: [],
    numRetry: '',
    retryInterval: '',
    description: '',
    owner: '',
  },
};

export default {
  namespace: 'task',
  state: initialValue,
  effects: {
    *getList({ payload }, { call, put }) {
      const { page = 1, pageSize, ...filter } = payload;
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
      // let { areaCode, role, userId } = yield select(state => state.permission);
      const { filter, page, pageSize } = yield select(state => state.task);
      // if (filter.areaCode) {
      //   // eslint-disable-next-line prefer-destructuring
      //   areaCode = filter.areaCode;
      // }
      yield put({
        type: 'getList',
        payload: { ...filter },
      });
      // yield put({
      //   type: 'getAreaDetail',
      //   payload: { areaCode },
      // });
    },

    *addTask({ payload }, { call, put, select }) {
      // 把字段parNode换成对应的parentNode
      const payloadParse = JSON.parse(JSON.stringify(payload).replace(/parNode/g, 'parentNode'));
      console.log(payloadParse);
      const response = yield call(addTask, payloadParse);
      if (response) {
        yield put({
          type: 'refresh',
        });
      }
      return response;
    },

    *getTaskDetail({ payload }, { call, put }) {
      const response = yield call(getTaskDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
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
      console.log('delete');
      const response = yield call(deleteTask, payload);
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
      console.log('saveDetail');
      return { ...state, selectDetail: payload };
    },
    // saveIndustryList(state, { payload }) {
    //   return { ...state, industryList: payload };
    // },
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    saveFilter(state, { payload }) {
      return { ...state, filter: { ...state.filter, ...payload } };
    },
  },
};
