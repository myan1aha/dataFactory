/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
import React from 'react';
import { Table, Breadcrumb, Popconfirm, message, Spin, Modal, Icon, Input, Select, Tooltip, Button, Form } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
// import { getSearchList } from './service'

import UploadProject from './components/UploadProject/';

const { Option } = Select;
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
let isSearch = false;
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
      searchName: 'projectName',
      searchList: [],
      proList: '',
      taskList: '',
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
        render: (_, records) =>
           (
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
                  <Tooltip title="编辑">
                    <Icon type="edit" />
                  </Tooltip>
                </Link>
              </li>
              <li style={listStyle}>
                <Popconfirm
                  title="Are you sure delete this task?"
                  onConfirm={e => this.deleteTask(e, records.projectName, records.taskName)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Tooltip title="删除">
                    <Icon type="delete" style={{ color: 'darkred' }} />
                  </Tooltip>
                </Popconfirm>
              </li>
              <li style={listStyle}>
                <Tooltip title="上传项目">
                  <Icon type="upload" onClick={() => this.showModal(records.projectName)} />
                </Tooltip>
              </li>
            </ul>
          )
        ,
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
    }).then(() => {
      const proList = new Set();
      const taskList = new Set();
      this.props.task.list.forEach(v => {
        proList.add(v.projectName);
        taskList.add(v.taskName);
      })
      this.setState({
        proList: [...proList],
        taskList: [...taskList],
        searchList: [...proList],
      })
      // console.log(this.state.proList);
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
    const { filter } = this.props.task;
    console.log(this.props);
    this.props.dispatch({
      type: 'task/getList',
      payload: { ...filter, ...params },
    });
  };

  // onFilterChange = params => {
  //   this.onListChange({
  //     ...params,
  //   });
  // };

  searchList = value => {
    console.log('searchList');
    const { searchName } = this.state;
    const params = {};
    params[`${searchName}`] = value;
    console.log(params);
    // this.onListChange({
    //   ...params,
    // })
  }


  onSelectChange = value => {
    const { taskList, proList } = this.state;
    this.setState({
      searchName: value,
      searchList: [],
    }, () => {
      // eslint-disable-next-line react/no-access-state-in-setstate
      const list = this.state.searchName === 'projectName' ? proList : taskList;
      this.setState({
        searchList: list,
      })
    })
  }

  onSearchChange = value => {
    // console.log(value);
    const { searchName } = this.state;
    if (searchName === 'projectName') {
      this.setState({
        projectName: value,
        taskName: '',
      })
    } else {
      this.setState({
        taskName: value,
        projectName: '',
      })
    }
    // const params = searchName==='projectName' ? { projectName: value } : { taskName: value };
    // this.onListChange(params);
  }

  getSearchList = param => {
    isSearch = true;
    console.log(this.state);
    const params = {
      ...param,
      taskName: this.state.taskName,
      projectName: this.state.projectName,
    }
    console.log(params);
    const { filter } = this.props.task;
    this.props.dispatch({
      type: 'task/getTargetList',
      payload: { ...filter, ...params },
    });
  }

  goAllList = () => {
    isSearch = false;
    this.props.history.push('/myTasks');
    // console.log(this.props);
  }

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
    if (!isSearch) {
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
    } else if (pageSize !== pagination.pageSize) {
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
  };

  render() {
    const {
      task: { list = [], page = 1, pageSize = 10, total = 0 },
    } = this.props;

    // const { searchName, searchList } = this.state;
    const searchNameCN = this.state.searchName === 'projectName' ? '项目名称' : '任务名称';
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

    list.forEach(v => {
      v.key = v.id;
    })
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
        <Spin spinning={this.props.loadingTask}>
          {/* <Filter
                onChange={this.onFilterChange}
                scaleList={scaleList}
                selectDetail={selectDetail}
              /> */}
          <div style={{ margin: '10px 0' }}>
            <Button style={{ display: 'inline', float: 'left' }} onClick={this.goAllList}>
              显示全部任务
            </Button>
            <Input.Group style={{ marginBottom: '10px', marginLeft: '55%', display: 'inline' }}>
              <Select defaultValue="projectName" onSelect={value => { this.onSelectChange(value) }}>
                <Select.Option value="projectName">项目名称</Select.Option>
                <Select.Option value="taskName">任务名称</Select.Option>
              </Select>
              <Select
                style={{ width: '20%' }}
                placeholder={`请选择${searchNameCN}`}
                onChange={this.onSearchChange}
                allowClear
              >
                {this.state.searchList.map(item => <Option value={item} key={item}>{item}</Option>)}
              </Select>
              <Button type="primary" icon="search" onClick={this.getSearchList}></Button>
            </Input.Group>
          </div>
          <Table
            className="compact-table"
            pagination={pagination}
            dataSource={list}
            columns={this.columns}
            onChange={this.handleTableChange}
          />
        </Spin>
        <Modal
          title={this.state.title}
          width="70%"
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
