/* eslint-disable max-len */
import React from 'react';
import { Table, Breadcrumb, Popconfirm, message, Spin, Modal, Button, Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import { getProJson } from './service';
// import './index.less'
// import Task from './tasks'
// import Filter from './Filter'

function cancel(e) {
  console.log(e);
  message.error('Click on No');
}

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
        sorter: {
          compare: (a, b) => (a.id > b.id),
        },
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
        dataIndex: 'owner',
        // key: 'inCharge',
        width: '10%',
        sorter: {
          compare: (a, b) => (a.owner > b.owner ? 1 : -1),
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
        width: '8%',
        render: (_, records) => {
          const { visible, confirmLoading, dataSource, isPage, title, isShowHeader } = this.state;
          return (
            <ul style={{ display: 'inline' }}>
              <li style={listStyle}>
                <Link
                  to={{ pathname: '/myTasks/edit', query: { id: records.id } }}
                  onClick={this.editRow}
                >
                  <Icon type="edit" />
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
                  <Icon type="delete" style={{ color: 'darkred' }}/>
                </Popconfirm>
              </li>
              <li style={listStyle}>
                {/* <a onClick={ this.uploadPro } style={{ whiteSpace: 'nowrap' }}>上传项目</a> */}
                <div>
                  <Icon type="upload" onClick={() => this.clickModal(records.projectName)}/>
                  <Modal
                    title={title}
                    visible={visible}
                    onOk={() => this.handleOk(records)}
                    confirmLoading={confirmLoading}
                    onCancel={this.handleCancel}
                    okText="确认上传"
                  >
                    <Table showHeader={isShowHeader} bordered pagination={isPage} columns={this.proColumns} dataSource={dataSource} />
                  </Modal>
                </div>
              </li>
            </ul>
          );
        },
      },
    ];
    this.proColumns = [
      {
        title: 'name',
        dataIndex: 'name',
        //   key: 'id',
        width: '30%',
      },
      {
        title: '查看来源图',
        dataIndex: 'origin',
        //   key: 'id',
        width: '30%',
        render: () => <Button>查看来源图</Button>
      },
    ]
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
  }

  showModal = proName => {
    this.setState({
      visible: true,
      title: `项目名称 : ${proName}`,
    });
  };

  clickModal = async proName => {
    this.showModal(proName);
    const res = await getProJson(proName);
    if (res) {
      const col = [];
      res.forEach((item, index) => {
        col.push({
          name: item.flow,
          key: `item-${index}`,
        });
      })
      this.setState({
        dataSource: col,
      })
    }
  }

  handleOk = values => {
    // 上传项目
    this.setState({
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
      message.success('success!');
    }, 2000);
    const params = { ...values };
    params.parentNode = params.parentNode;
    delete params.parNode;
    console.log(params);
    // this.props
    //   .dispatch({
    //     type: 'task/portTask',
    //     payload: params,
    //   })
    //   .then(() => {
    //     this.setState({
    //       visible: false,
    //       confirmLoading: false,
    //     });
    //   });
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
            pagination={this.state.isPage}
            dataSource={listParse}
            columns={this.columns}
            onChange={this.handleTableChange}
            // bordered
          />
        </Spin>
        {/* <Pagination/> */}
      </div>
    );
  }
}

export default Tasks;
