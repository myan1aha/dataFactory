import React from 'react';
import { Table } from 'antd';
import './index.less'

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

const columns = [
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
                    <li style={{ width: '30%', cursor: 'pointer', float: 'left', fontSize: 14 }} onClick={() => {
                        alert('edit');}}>编辑</li>
                    <li style={{ width: '30%', cursor: 'pointer', float: 'left', fontSize: 14 }} onClick={() => {
                        alert('edit');}}>删除</li>
                    <li style={{ width: '30%', cursor: 'pointer', float: 'left', fontSize: 14 }} onClick={() => {
                        alert('edit');}}>打标签</li>
                </ul>
            </div>
        ),
    },
];

// function onChange(pagination, filters, sorter, extra) {
//     console.log('params', pagination, filters, sorter, extra);
// }

// eslint-disable-next-line react/prefer-stateless-function
class Projects extends React.Component {
    render() {
        return (
            <div>
                hello
                <Table className="compact-table" dataSource={dataSource} columns={columns} />
            </div>
        )
    }
}

export default Projects;
