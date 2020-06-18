import React from 'react';
import { Breadcrumb, Table, Popconfirm, Cascader, Button } from 'antd';
import Link from 'umi/link'
// eslint-disable-next-line react/prefer-stateless-function

const dataSource = [
    {
        id: '44dc1dbab7fa4f1db24ccf86b6b023f3',
        name: '裁判文书',
        type: '地信产业',
        phase: '数据清洗',
        isMove: '已迁移',
    },
    {
        id: 'e646ab9aa7ff442f9ae4cf7a70cf097a',
        name: '劳动仲裁',
        type: '地信产业',
        phase: '数据清洗',
        isMove: '已迁移',
    }
]

class TasksData extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
          {
            title: 'id',
            dataIndex: 'id',
            // key: 'id',
            width: '15%',
            sorter: {
              compare: (a, b) => (a.id > b.id ? 1 : -1),
              multiple: 1,
          },
          //   sortOrder: 'descend',
          },
          {
            title: '名称',
            dataIndex: 'name',
          //   key: 'name',
            width: '10%',
            sorter: {
              compare: (a, b) => a.name_en - b.name_en,
              multiple: 3,
            },
          },
          {
            title: '项目类型',
            dataIndex: 'type',
            // key: 'type',
            width: '10%',
            sorter: {
                compare: (a, b) => (a.type > b.type ? 1 : -1),
                multiple: 4,
            },
          },
          {
            title: '数据阶段',
            dataIndex: 'phase',
            // key: 'phase',
            width: '10%',
            sorter: {
                compare: (a, b) => (a.phase > b.phase ? 1 : -1),
                multiple: 5,
            },
          },
          {
            title: '是否迁移',
            dataIndex: 'isMove',
            // key: 'isMove',
            width: '10%',
            sorter: {
                compare: (a, b) => (a.isMove > b.isMove ? 1 : -1),
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
              <Button disabled>编辑</Button>
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
                        <Link to="/tasks">Data Factory</Link>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br></br>
                <Table className="compact-table" dataSource={dataSource} columns={this.columns} />
            </div>
        )
    }
}
export default TasksData;
