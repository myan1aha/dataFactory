import React from 'react';
import { Table, Spin, Input, Pagination } from 'antd';
// import Link from 'umi/link';
import { connect } from 'dva';
import { overview, news, company } from './columns'

let pageSizeOptions = ['200', '300', '500'];
let isSearch = false;
@connect(({ report, loading }) => ({
    report,
    loadingReport: loading.models.report,
}))
class DisplayTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageSize: 200,
        };
    }

    componentDidMount() {
        const col = this.props.location.pathname.split('/')[2];
        // const pageDetail = col === 'company' ? { start: 0, count: 3 } : null;
        this.props.dispatch({
            type: 'report/getReport',
            payload: {
                col,
            },
        })
    }

    onListChange = params => {
        const { filter } = this.props.report;
        console.log(params);
        params.col = 'company';
        // const pageDetail = {
        //     start: ,
        //     count: pageSize,
        // }
        this.props.dispatch({
            type: 'report/getReport',
            payload: { ...filter, ...params },
        });
    };

    handleTableChange = (pagination, _, sorter) => {
        console.log(pagination);
        const { pageSize = 200 } = this.props.report;
        // const { order, field } = sorter;
        const filter = {
            sortOrder: 'desc',
            sortKey: '',
        };
        // if (order) {
        //     filter.sortOrder = order === 'ascend' ? 'asc' : 'desc';
        //     filter.sortKey = field;
        // }
        if (isSearch) {
            console.log('search');
            if (pageSize !== pagination.pageSize) {
                console.log(pageSize, pagination.pageSize);
                this.getSearchList({
                    page: 1,
                    pageSize: pagination.pageSize,
                    ...filter,
                });
            } else {
                const page = pagination.current;
                this.getSearchList({
                    page,
                    ...filter,
                });
            }
        } else if (pageSize !== pagination.pageSize) {
                console.log(pageSize, pagination.pageSize);
                this.onListChange({
                    page: 1,
                    pageSize: pagination.pageSize,
                    ...filter,
                });
            } else {
                const page = pagination.current;
                this.onListChange({
                    page,
                    ...filter,
                });
            }   
    }

    getSearchList = params => {
        isSearch = true;
        const { filter } = this.props.report;
        this.props.dispatch({
          type: 'report/getTargetReport',
          payload: { ...filter, ...params },
        });
    }

    onSearchChange = val => {
        const params = {
            name: val,
        }
        this.getSearchList(params);
    }

    onShowSizeChange = (current, pageSize) => {
        // console.log(current, pageSize);
        this.setState({
            page: 1,
            pageSize,
        })
        this.handleTableChange({
            current,
            pageSize,
        })
    }

    myPageChange = (page, pageSize) => {
        console.log(page, pageSize);
        this.setState({
            page,
            pageSize,
        })
        // this.handleTableChange({
        //     page:
        // })
        this.handleTableChange({
            current: page,
            pageSize,
        })
    }

    render() {
        const col = this.props.location.pathname.split('/')[2];
        const {
            report: { list = [], page = 1, pageSize = 200, total = 0 },
        } = this.props;
        let columns;
        // console.log(total);
        if (!pageSizeOptions.includes(`${pageSize}`)) {
            pageSizeOptions.push(`${pageSize}`);
            pageSizeOptions = pageSizeOptions.sort((a, b) => a - b);
        }

        const pagination = col === 'company' ? {
            current: page,
            total,
            pageSize,
            size: 'small',
            showSizeChanger: true,
            pageSizeOptions,
            // onChange: this.onPageChange,
        } : false;
        if (col === 'overview') {
            columns = overview;
        } else if (col === 'news') {
            columns = news;
        } else if (col === 'company') {
            columns = company;
        }
        return (
          <div>
            {/* <Breadcrumb style={{ marginBottom: '20px' }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/Dataset">Dataset Application</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.props.typeName}</Breadcrumb.Item>
            </Breadcrumb> */}
            <Spin spinning={this.props.loadingReport}>
                {col === 'company' ? (
                    <div style={{ display: 'flex' }}>
                        <Input.Search
                            placeholder="请输入企业名称"
                            allowClear
                            onSearch={val => this.onSearchChange(val)}
                            style={{ width: '20%', display: 'flex' }}
                        />
                        <Pagination
                            showSizeChanger
                            onShowSizeChange={this.onShowSizeChange}
                            pageSizeOptions={pageSizeOptions}
                            pageSize={this.state.pageSize}
                            current={this.state.page}
                            total={total}
                            onChange={this.myPageChange}
                            size="small"
                            style={{ display: 'flex', flex: '1', justifyContent: 'flex-end' }}
                        />
                    </div>
                ) : null}
                <Table
                    columns={columns}
                    dataSource={list}
                    rowKey={ record => (col === 'company' ? record.company_id : record.description) }
                    pagination={ false }
                    onChange={this.handleTableChange}
                    style={{ marginTop: 20 }}
                />        
            </Spin>
          </div>
        )
    }
}

export default DisplayTable;
