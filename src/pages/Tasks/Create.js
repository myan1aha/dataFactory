import React from 'react';
import { Breadcrumb, Form, Input, Button } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'umi/link';
import options from './options'
// import CreateForm from './createForm'

const { TextArea } = Input;

const layout = {
    labelCol: {
        span: 4,
    },
    wrapperCol: {
        span: 8,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 4,
        span: 8,
    },
};
// const formItemLayout = {
//     labelCol: {
//         xs: { span: 24 },
//         sm: { span: 4 },
//     },
//     wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 20 },
//     },
// };

// eslint-disable-next-line react/prefer-stateless-function
class TasksCreate extends React.Component {
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
                        Tasks Creation
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br></br>
                <Form
                    {...layout}
                    name="basic"
                >
                    {
                        options.map(item => {
                            switch (item.type0) {
                                case 'text':
                                    return (
                                        <Form.Item
                                            label={`${item.label}`}
                                            name={`${item.name}`}
                                            rules={[
                                            {
                                                required: true,
                                                message: `请输入${item.label}`,
                                            },
                                            ]}
                                            key={item.key}
                                        >
                                            { item.type === 'input' ? <Input placeholder={`请输入${item.label}`}/>
                                            : <TextArea></TextArea>
                                            }
                                        </Form.Item>
                                    );
                                case 'insertForm':
                                    return (
                                        <Form.Item

                                        >
                                            <Input placeholder="222"></Input>
                                        </Form.Item>
                                    );
                                default: return null;
                            }
                        })
                    }
                    <Form.Item {...tailLayout}>
                        <Button type="primary">立即创建</Button>
                        <Button type="dashed" style={{ marginLeft: '10px' }}>取消</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
export default TasksCreate;