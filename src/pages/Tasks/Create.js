/* eslint-disable max-len */
import React from 'react';
import { Breadcrumb, Form, Input, Button, Cascader } from 'antd';
import { connect } from 'dva';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'umi/link';
import options from './options'
import InsertFrom from './InsertForm'


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
const formItemLayout = {
    labelCol: {
        xs: { span: 4 },
        sm: { span: 4 },
    },
    wrapperCol: {
        xs: { span: 8 },
        sm: { span: 8 },
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
function formatValues(values) {
    const params = { ...values };
    return params;
}

@Form.create()
@connect(({ task }) => ({
    // industryList: task.industryList,
    task,
}))
class TasksCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    onAdd = () => {
        console.log(this.props);
        // const { userId } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (err) return;
          this.onAddTask({ ...formatValues(values) });
        });
    };

    onAddTask = values => {
        console.log(values);
        this.props
          .dispatch({
            type: 'task/addTask',
            payload: values,
          })
          .then(res => {
              console.log('success', res);
          });
    };

    onChange = () => {
        console.log('change');
    }

    render() {
        const { getFieldDecorator, getFieldsValue } = this.props.form;
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
                                            key={item.key}
                                            {...formItemLayout}
                                        >
                                            {getFieldDecorator(item.name, {
                                                rules: [
                                                  {
                                                    required: true,
                                                    message: `请输入${item.label}`,
                                                  },
                                                ],
                                            })(
                                                 item.type === 'input' ? <Input placeholder={`请输入${item.label}`}/>
                                                                        : <TextArea></TextArea>,
                                            )}
                                        </Form.Item>
                                    );
                                case 'insertForm':
                                    return (
                                        // eslint-disable-next-line max-len
                                        <Form.Item label={item.label} {...formItemLayout} key={item.key}>
                                        {getFieldDecorator(item.name, {
                                            rules: [
                                            {
                                                required: false,
                                                message: `请输入${item.label}`,
                                            },
                                            ],
                                        })(
                                            <InsertFrom label={item.label} required="false" name={item.name}/>,
                                        )
                                        }
                                           
                                        </Form.Item>
                                    );
                                default: return null;
                            }
                        })
                    }
                    <Form.Item {...tailLayout}>
                        <Button type="primary" onClick={this.onAdd}>立即创建</Button>
                        <Button type="dashed" style={{ marginLeft: '10px' }}>取消</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
export default TasksCreate;
