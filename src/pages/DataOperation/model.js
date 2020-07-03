import { getOnlineList, deleteOnlineList, getOnlineListDetail } from './service';

let PAGESIZE = 20;
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
    onlineList: [],
    page: 1,
    pageSize: PAGESIZE,
    total: 0,
    // selectDetail: {},
    // scaleList: [],
    filter: {
      name: '',
      description: '',
      dbType: '',
      dbName: '',
      serverName: '',
      totalCount: 0,
      yesterdayNewCount: 0,
    },
};

export default {
    namespace: 'dataOperation',
    state: initialValue,
    effects: {
        *getOnlineList({ payload }, { call, put }) {
            const { page = 1, pageSize, ...filter } = payload;
            const params = decreaseFormat(payload);
            const response = yield call(getOnlineList, params);
            if (response) {
                yield put({
                    type: 'save',
                    payload: {
                        onlineList: response,
                        pageSize: params.pageSize,
                        page,
                    },
                });
                yield put({
                    type: 'saveFilter',
                    payload: filter,
                })
            }
        },
        *deleteOnlineList({ payload }, { call, put }) {
            const response = yield call(deleteOnlineList, payload);
            if (response) {
                yield put({
                    type: 'refresh',
                });
            }
            return response;
        },
        // *getOnlineListDetail({}, { call, put }) {

        // },
        *refresh(_, { call, put, select }) {
            console.log('refresh');
            const { filter, page, pageSize } = yield select(state => state.onlineList);
            yield put({
                type: 'getOnlineList',
                payload: { ...filter }
            })
        }
    },

    reducers: {
        init() {
            return initialValue;
        },
        save(state, { payload }) {
            return { ...state, ...payload };
        },
        saveFilter(state, { payload }) {
            return { ...state, filter: { ...state.filter, ...payload } }
        },
    },
}
