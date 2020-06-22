/* eslint-disable max-len */
import React from 'react';
import { Table, Breadcrumb, Popconfirm, message, Spin, Modal, Button, Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import { getProJson } from './service';

import UploadProject from './components/UploadProject/';

// import './index.less'
// import Task from './tasks'
// import Filter from './Filter'

let pageSizeOptions = ['1', '2', '3'];

const listStyle = {
  width: '30%',
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
      title: '',
      isPage: false,
      isShowHeader: false,
    };
    this.columns = [
      {
        title: '任务id',
        dataIndex: 'id',
        //   key: 'id',
        width: '15%',
        sorter: (a, b) => (a.id - b.id ? 1 : -1),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '项目名称',
        dataIndex: 'projectName',
        //   key: 'name_en',
        width: '10%',
        sorter: (a, b) => (a.projectName - b.projectName ? 1 : -1),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '任务名称',
        dataIndex: 'taskName',
        //   key: 'name',
        width: '10%',
        sorter: (a, b) => (a.taskName - b.taskName ? 1 : -1),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '上游节点',
        dataIndex: 'parentNode',
        // key: 'type',
        width: '10%',
        sorter: (a, b) => (a.parentNode - b.parentNode ? 1 : -1),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: '负责人',
        dataIndex: 'owner',
        // key: 'inCharge',
        width: '10%',
        sorter: (a, b) => (a.owner - b.owner ? 1 : -1),
        sortDirections: ['descend', 'ascend'],
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
        width: '8%',
        render: (_, records) => {
          // const { visible, confirmLoading, dataSource, isPage, title, isShowHeader } = this.state;
          return (
            <ul style={{ display: 'inline' }}>
              <li style={listStyle}>
                <Link
                  to={{ pathname: '/myTasks/edit',
                        query: {
                          taskName: records.taskName,
                          projectName: records.projectName,
                        },
                      }}
                  onClick={this.editRow}
                >
                  <Icon type="edit" />
                </Link>
              </li>
              <li style={listStyle}>
                <Popconfirm
                  title="Are you sure delete this task?"
                  onConfirm={e => this.deleteTask(e, records.projectName, records.taskName)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Icon type="delete" style={{ color: 'darkred' }} />
                </Popconfirm>
              </li>
              <li style={listStyle}>
                <Icon type="upload" onClick={() => this.showModal(records.projectName)} />
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
        owner: '',
      },
    });
  }

  originPic = () => {
    console.log('origin picture');
  };

  showModal = projectName => {
    this.setState({
      visible: true,
      title: `项目名称 : ${projectName}`,
      modalId: projectName,
    });
  };

  handleOk = projectName => {
    // 上传项目
    this.props
      .dispatch({
        type: 'task/portTask',
        payload: {
          projectName,
        },
      })
      .then(res => {
        if (res) {
          message.success('上传成功');
          this.handleCancel();
        }
      });
  };

  handleCancel = () => {
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
            <Link to="/myTasks">Tasks Application</Link>
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
            // pagination={this.state.isPage}
            pagination={pagination}
            dataSource={list}
            columns={this.columns}
            onChange={this.handleTableChange}
            // bordered
          />
        </Spin>
        <Modal
          title={this.state.title}
          width={'70%'}
          onCancel={this.handleCancel}
          destroyOnClose
          visible={this.state.visible}
          footer={null}
          wrapClassName="scroll-modal no-padding"
        >
          <UploadProject
            loading={this.props.loadingTask}
            modalId={this.state.modalId}
            onUpload={this.handleOk}
          />
        </Modal>
      </div>
    );
  }
}

export default Tasks;
