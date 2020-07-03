import { getReport, getTargetReport } from './service';

let PAGESIZE = 200;
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
        company_id: '',
        company_name: '',
        product_num: '',
        patent_num: '',
        software_num: '',
        recruit_num: '',
        judgedoc_num: '',
        trademark_num: '',
        stats_date: '',
    },
}

export default {
    namespace: 'report',
    state: initialValue,
    effects: {
        *getReport({ payload }, { call, put }) {
            const { page = 1, pageSize, ...filter } = payload;
            const params = decreaseFormat(payload);
            const response = yield call(getReport, params);
            if (response) {
                // console.log(response.data);
                yield put({
                    type: 'save',
                    payload: {
                        list: response.data,
                        pageSize: params.pageSize,
                        page,
                        total: response.total,
                    },
                });
                yield put({
                    type: 'saveFilter',
                    payload: filter,
                })
            }
        },

        *getTargetReport({ payload }, { call, put }) {
            const { page = 1, pageSize, ...filter } = payload;
            const params = decreaseFormat(payload);
            const response = yield call(getTargetReport, params);
            if (response) {
                // console.log(response.data);
                yield put({
                    type: 'save',
                    payload: {
                        list: response.data,
                        pageSize: params.pageSize,
                        page,
                        total: response.total,
                    },
                });
                yield put({
                    type: 'saveFilter',
                    payload: filter,
                })
            }
        }

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
}
