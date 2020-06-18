/* eslint-disable max-len */
import React from 'react';
import { Table, Breadcrumb, Popconfirm, message, Spin, Modal, Button } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import { getUploadConfirm } from './service';
// import './index.less'
// import Task from './tasks'
// import Filter from './Filter'

function cancel(e) {
  console.log(e);
  message.error('Click on No');
}

let pageSizeOptions = ['1', '2', '3'];

const listStyle = {
  width: '20%',
  cursor: 'pointer',
  float: 'left',
  fontSize: 13,
  padding: 0,
};

@connect(({ task, loading }) => ({
  // list: task.list,
  task,
  loadingTask: loading.models.task,
}))
class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false,
      dataSource: [],
    };
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
        dataIndex: 'parNode',
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
        render: (_, records) => {
          const { visible, confirmLoading, dataSource } = this.state;
          return (
            <ul style={{ display: 'inline' }}>
              <li style={listStyle}>
                <Link
                  to={{ pathname: '/tasks/edit', query: { id: records.id } }}
                  onClick={this.editRow}
                >
                  编辑
                </Link>
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
                {/* <a onClick={ this.uploadPro } style={{ whiteSpace: 'nowrap' }}>上传项目</a> */}
                <div>
                  <Button type="primary" onClick={this.showModal}>
                    上传项目
                  </Button>
                  <Modal
                    title="Title"
                    visible={visible}
                    onOk={this.handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                  >
                    <h1>项目：{records.projectName}</h1>
                    <Table columns dataSource={dataSource} />
                  </Modal>
                </div>
              </li>
            </ul>
          );
        },
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

  showModal = async () => {
    const response = await getUploadConfirm();
    response.then(res => {
      const list = res.value;
      this.setState({
        visible: true,
        dataSource: list,
      });
    });
  };

  handleOk = () => {
    // 上传项目

    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  };

  deleteTask = (e, projectName, taskName) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(projectName, taskName);
    this.props.dispatch({
      type: 'task/deleteTask',
      payload: {
        projectName,
        taskName,
      },
    });
  };

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
    const { pageSize = 2 } = this.props.task;
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
      this.onListChange({
        page,
        ...filter,
      });
    }
  };

  render() {
    // console.log(this.props);
    const {
      task: { list = [], page = 1, pageSize = 10, total = 0 },
    } = this.props;

    // eslint-disable-next-line array-callback-return
    list.forEach(item => {
      // eslint-disable-next-line no-param-reassign
      item.key = item.id;
    });
    // 将拿到的数据中字段名“parentNode”修改成“parNode”
    const listParse = JSON.parse(JSON.stringify(list).replace(/parentNode/g, 'parNode'));

    if (!pageSizeOptions.includes(`${pageSize}`)) {
      pageSizeOptions.push(`${pageSize}`);
      pageSizeOptions = pageSizeOptions.sort((a, b) => a - b);
    }
    const pagination = {
      current: page,
      total,
      pageSize,
      size: 'small',
      showSizeChanger: true,
      pageSizeOptions,
    };

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/tasks">Tasks Application</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Tasks List</Breadcrumb.Item>
        </Breadcrumb>
        <br></br>
        {/* <Spin */}
        <Spin spinning={this.props.loadingTask}>
          {/* <Filter
                onChange={this.onFilterChange}
                scaleList={scaleList}
                selectDetail={selectDetail}
              /> */}
          <Table
            className="compact-table"
            pagination={pagination}
            dataSource={listParse}
            columns={this.columns}
            onChange={this.handleTableChange}
            bordered
          />
        </Spin>
        {/* <Pagination/> */}
      </div>
    );
  }
}

export default Tasks;
