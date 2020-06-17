import React from 'react';
import { Table, Breadcrumb, Popconfirm, message } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
// import './index.less'
// import Task from './tasks'

function cancel(e) {
  console.log(e);
  message.error('Click on No');
}

let pageSizeOptions = ['10', '20', '30'];

const dataSource = [
    {
      key: 1,
      id: 11111,
      taskName: '任务1',
      name_en: 'task1',
      type: 'type1',
      inCharge: 'aaa',
      status: '75%',
    },
    {
        key: 2,
        id: 22222,
        taskName: '任务2',
        name_en: 'task2',
        type: 'type2',
        inCharge: 'bbb',
        status: '50%',
    },
    {
        key: 3,
        id: 22222,
        taskName: '任务3',
        name_en: 'task3',
        type: 'type3',
        inCharge: 'ccc',
        status: '60%',
    },
  ];
const listStyle = {
  width: '20%', cursor: 'pointer', float: 'left', fontSize: 13, padding: 0,
}

@connect(({ task }) => ({
  list: task.list,
  task,
}))
class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      li: {},
    }
    this.columns = [
      {
        title: '任务id',
        dataIndex: 'id',
      //   key: 'id',
        width: '15%',
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
      //   key: 'name_en',
        width: '10%',
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
      //   key: 'name',
        width: '10%',
      },
      {
        title: '上游节点',
        dataIndex: 'parentNode',
        // key: 'type',
        width: '10%',
      },
      {
        title: '负责人',
        dataIndex: 'inCharge',
        // key: 'inCharge',
        width: '10%',
        sorter: {
            compare: (a, b) => (a.inCharge > b.inCharge ? 1 : -1),
            multiple: 5,
        },
      },
      {
        title: '基本描述',
        dataIndex: 'description',
        // key: 'status',
        width: '10%',
      },
      {
        title: '操作',
        dataIndex: 'option',
        // key: 'option',
        width: '15%',
        render: (_, records) => (
            <ul style={{ display: 'inline' }}>
                <li style={listStyle}>
                      <Link to={
                       { pathname: '/tasks/edit',
                         query: { id: records.id } }
                      } onClick={this.editRow}>编辑</Link>
                </li>
                <li style={listStyle}>
                <Popconfirm
                  title="Are you sure delete this task?"
                  onConfirm={e => this.deleteTask(e, records.projectName, records.taskName)}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <a href="#">删除</a>
                </Popconfirm>
                </li>
                <li style={listStyle}>
                      <a onClick={ this.uploadPro } style={{ whiteSpace: 'nowrap' }}>上传项目</a>
                </li>
            </ul>
        ),
      },
    ];
  }

  componentDidMount() {
    // const { role, areaCode, userId } = this.props.permission;
    this.props.dispatch({
      type: 'task/getList',
      payload: {
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
      },
    });
  }

  deleteTask = (e, projectName, taskName) => {
    e.preventDefault();
    e.stopPropagation();
    this.props.dispatch({
      type: 'task/deleteTask',
      payload: {
        projectName,
        taskName,
      },
    });
  }

  onListChange = params => {
    // const { role, userId } = this.props.permission;
    const { filter } = this.props.task;
    this.props.dispatch({
      type: 'task/getList',
      payload: { ...filter, ...params },
    });
  };

  onFilterChange = params => {
    this.onListChange({
      ...params,
    });
  };

  handleTableChange = (pagination, _, sorter) => {
    const pageSize = 2;
    const { order, field } = sorter;
    const filter = {
      sortOrder: 'desc',
      sortKey: '',
    };
    if (order) {
      filter.sortOrder = order === 'ascend' ? 'asc' : 'desc';
      filter.sortKey = field;
    }
    if (pageSize !== pagination.pageSize) {
      this.onListChange({
        page: 1,
        pageSize: pagination.pageSize,
        ...filter,
      });
    } else {
      const page = pagination.current;
      console.log(this);
      this.onListChange({
        page,
        ...filter,
      });
    }
  };

  render() {
    console.log(this.props);
    const {
      task: { list = [], page = 1, pageSize = 10, total = 0, scaleList = [], selectDetail = {} },
    } = this.props;
    console.log(list);
    // const pageSize = 2;
    // const page = 1;
    if (!pageSizeOptions.includes(`${pageSize}`)) {
      pageSizeOptions.push(`${pageSize}`);
      pageSizeOptions = pageSizeOptions.sort((a, b) => a - b);
    }
    const pagination = {
      current: page,
      total: 0,
      pageSize,
      size: 'small',
      showSizeChanger: true,
      pageSizeOptions,
    };

    return (
        <div>
            <Breadcrumb >
              <Breadcrumb.Item>
                <Link to="/">Home</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <Link to="/tasks">Tasks Application</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                Tasks List
              </Breadcrumb.Item>
            </Breadcrumb>
            <br></br>
            <Table
            className="compact-table"
            pagination={pagination}
            dataSource={list}
            columns={this.columns}
            onChange={this.handleTableChange}
            bordered
            />
            {/* <Pagination/> */}
        </div>
    )
  }
}

export default Tasks;
