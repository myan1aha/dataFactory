import React from 'react';
import { Breadcrumb, Cascader, Button } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { SearchOutlined } from '@ant-design/icons';
import Link from 'umi/link';
import WeeklyInc from '../../components/WeeklyInc'

const options = [
    {
      value: 'category',
      label: 'Category',
      children: [
        {
          value: 'dataPhase',
          label: '数据阶段',
          children: [
            {
              value: '',
              label: '',
            },
          ],
        },
        {
            value: 'project',
            label: '项目',
            children: [
                {
                value: '',
                label: '',
                },
            ],
        },
        {
            value: 'dataType',
            label: '数据类型',
            children: [
                {
                value: '',
                label: '',
                },
            ],
        },
        {
            value: 'importance',
            label: '重要度',
            children: [
                {
                value: '',
                label: '',
                },
            ],
        },
      ],
    },
];

// eslint-disable-next-line react/prefer-stateless-function
class TasksRelationship extends React.Component {
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
                        Tasks Relationship
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br></br>
                <span>标签体系：</span>
                <Cascader
                    options={options}
                />
                <Button style={{ marginLeft: '10px' }} className="search_btn" type="primary" icon={<SearchOutlined />}>
                    Search
                </Button>
                <WeeklyInc option={options}></WeeklyInc>
            </div>
        )
    }
}
export default TasksRelationship;

