export const DataPipeline = [
    {
        title: '数据维度类型',
        dataIndex: 'data_type',
    }, {
        title: '统计日期',
        dataIndex: 'stats_date', // string
    }, {
        title: '处理环节',
        dataIndex: 'pipeline_stage', // data
    }, {
        title: '数据新增数量',
        dataIndex: 'increment_num', // string
    }, {
        title: '数据全部数量',
        dataIndex: 'total_num', // int
    }, {
        title: '指标写入时间',
        dataIndex: 'insert_time', // datetime
    },
]

export const newsSource = [
    {
        title: '资讯源名称',
        dataIndex: 'source_name',
    }, {
        title: '统计日期',
        dataIndex: 'stats_date',
    }, {
        title: '数据新增数量',
        dataIndex: 'increment_num',
    }, {
        title: '数据全部数量',
        dataIndex: 'total_num',
    }, {
        title: '模型使用量',
        dataIndex: 'model_used',
    }, {
        title: '指标写入时间',
        dataIndex: 'insert_time',
    },
]

export const overview = [
    {
        title: '描述',
        dataIndex: 'description',
    }, {
        title: '名称',
        dataIndex: 'name',
    }, {
        title: '昨日增量',
        dataIndex: 'yes_inc_data_num',
    }, {
        title: '全部数据',
        dataIndex: 'all_data_num',
    }, {
        title: '数据清洗',
        dataIndex: 'clean_num',
    },
]

export const news = [
    {
        title: '来源名称',
        dataIndex: 'description',
    }, {
        title: '昨日增量',
        dataIndex: 'yes_inc_data_num',
    }, {
        title: '全部数据',
        dataIndex: 'all_data_num',
    }, {
        title: '历史数据',
        dataIndex: 'used_num',
    },
]

export const company = [
    {
        title: '企业实例id',
        dataIndex: 'company_id',
        width: '12%',
    }, {
        title: '企业名称',
        dataIndex: 'company_name',
        width: '16%',
    }, {
        title: '产品数量',
        dataIndex: 'product_num',
        width: '8%',
    }, {
        title: '专利数量',
        dataIndex: 'patent_num',
        width: '8%',
    }, {
        title: '软著数量',
        dataIndex: 'software_num',
        width: '8%',
    }, {
        title: '招聘数量',
        dataIndex: 'recruit_num',
        width: '8%',
    }, {
        title: '裁判文书数量',
        dataIndex: 'judgedoc_num',
        width: '11%',
    }, {
        title: '商标数量',
        dataIndex: 'trademark_num',
        width: '8%',
    }, {
        title: '统计日期',
        dataIndex: 'stats_date',
        width: '10%',
    },
]