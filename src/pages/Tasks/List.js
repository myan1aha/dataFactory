import React from 'react';
import { Table, Breadcrumb,Popconfirm, message } from 'antd';
import Link from 'umi/link';
// import './index.less'
// import Task from './tasks'

function confirm(e) {
  console.log(e);
  message.success('Click on Yes');
}

function cancel(e) {
  console.log(e);
  message.error('Click on No');
}

const addTag = () => {
  console.log('addtag');
}

const dataSource = [
    {
      key: 1,
      id: 11111,
      name: '任务1',
      name_en: 'task1',
      type: 'type1',
      inCharge: 'aaa',
      status: '75%',
    },
    {
        key: 2,
        id: 22222,
        name: '任务2',
        name_en: 'task2',
        type: 'type2',
        inCharge: 'bbb',
        status: '50%',
    },
    {
        key: 3,
        id: 22222,
        name: '任务3',
        name_en: 'task3',
        type: 'type3',
        inCharge: 'ccc',
        status: '60%',
    },
  ];
const listStyle = {
  width: '30%', cursor: 'pointer', float: 'left', fontSize: 14,
}
// eslint-disable-next-line react/prefer-stateless-function
class Tasks extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: 'id',
        dataIndex: 'id',
      //   key: 'id',
        width: '10%',
        sorter: {
          compare: (a, b) => (a.id > b.id ? 1 : -1),
          multiple: 1,
      },
      //   sortOrder: 'descend',
      },
      {
        title: '任务英文名称',
        dataIndex: 'name_en',
      //   key: 'name_en',
        width: '15%',
        sorter: {
          compare: (a, b) => a.name_en - b.name_en,
          multiple: 3,
        },
      },
      {
        title: '任务名称',
        dataIndex: 'name',
      //   key: 'name',
        width: '15%',
        sorter: {
          compare: (a, b) => a.name - b.name,
          multiple: 2,
        },
      },
      {
        title: '类别',
        dataIndex: 'type',
        // key: 'type',
        width: '10%',
        sorter: {
            compare: (a, b) => (a.type > b.type ? 1 : -1),
            multiple: 4,
        },
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
        title: '状态',
        dataIndex: 'status',
        // key: 'status',
        width: '10%',
        sorter: {
            compare: (a, b) => (a.status > b.status ? 1 : -1),
            multiple: 6,
        },
        // sorter: true,
      },
      {
        title: '操作',
        dataIndex: 'option',
        // key: 'option',
        width: '15%',
        render: () => (
          <div className="option_list">
            <ul style={{ display: 'inline' }}>
                <li style={listStyle}>
                      <Link to='/tasks/edit'>编辑</Link>
                </li>
                <li style={listStyle}>
                <Popconfirm
                  title="Are you sure delete this task?"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                >
                  <a href="#">删除</a>
                </Popconfirm>
                </li>
                <li style={listStyle}>
                      <a onClick={addTag}>打标签</a>
                </li>
            </ul>
          </div>
        ),
      },
    ];
  }

  render() {
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
              <Table className="compact-table" dataSource={dataSource} columns={this.columns} />
          </div>
      )
  }
}

export default Tasks;
