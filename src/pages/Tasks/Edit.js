import React from 'react';
import { Breadcrumb, Form, Input, Button, Spin } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';

import options from './options'
import InsertForm from './InsertForm'

const { TextArea } = Input;
const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 10,
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


@Form.create()
@connect(({ task, loading }) => ({
    // industryList: task.industryList,
    task,
    loadingTask: loading.models.task,
}))
class TasksEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // eslint-disable-next-line react/no-unused-state
            form: {},
        }
    }

    // eslint-disable-next-line react/sort-comp
    onAdd = () => {
        console.log('add');
    }

    onCancel = () => {
        this.props.history.goBack();
    }

    validator = (rule, value, callback) => {
        const { max, required, msg } = rule;
        if (required && !value) {
          callback(msg);
        } else if (value && value.length > max) {
          callback('超出可输入的最大字符');
        } else {
          callback();
        }
      };

    componentDidMount() {
        // const { role, areaCode, userId } = this.props.permission;
        this.props.dispatch({
          type: 'task/getTaskDetail',
          payload: {
            id: this.props.location.query.id,
          },
        });
        // const data = this.props.task.selectDetail;
        // // console.log(data);
        // this.props.form.setFieldsValue(data, () => {
        //     // console.log('success form');
        // });
        // console.log(data);
        const data = this.props.task.selectDetail;
        if (data) {
            // console.log(data);
            this.props.form.setFieldsValue(data, () => {
                console.log(data);
                    console.log('success form');
            });
        }
      }

    render() {
        // console.log(this.props);
        const { getFieldDecorator } = this.props.form;
        // console.log('fields', getFieldsValue());
        const data = this.props.task.selectDetail;
        // console.log(data);
        // console.log(this.props);
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
                        Tasks Edit
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br></br>
                <Spin spinning={this.props.loadingTask}>
                <Form
                    {...layout}
                    name="basic"
                    className="form_info"
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
                                                    validator: this.validator,
                                                  },
                                                ],
                                                // eslint-disable-next-line max-len
                                                // initialValue: data[item.name] ? data[item.name] : null,
                                            })(
                                                 item.type === 'input' ? <Input placeholder={`请输入${item.label}`}/>
                                                                        : <TextArea></TextArea>,
                                            )}
                                        </Form.Item>
                                    );
                                case 'insertForm':
                                    // console.log(item.label);
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
                                            // eslint-disable-next-line max-len
                                            <InsertForm action="edit" label={item.label} name={item.name}/>,
                                        )}
                                        </Form.Item>
                                    );
                                default: return null;
                            }
                        })
                    }
                    <Form.Item {...tailLayout}>
                        <Button type="primary" onClick={this.onAdd}>保存</Button>
                        <Button type="dashed" style={{ marginLeft: '10px' }} onClick={this.onCancel}>取消</Button>
                    </Form.Item>
                </Form>
                </Spin>
            </div>

        )
    }
}
export default TasksEdit;
