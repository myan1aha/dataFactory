import React from 'react';
import { Breadcrumb, Form, Input, Button, Spin } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';

import options from './options'
import InsertForm from './InsertForm'

const { TextArea } = Input;
const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
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
    },
    wrapperCol: {
        xs: { span: 14 },
    },
};

function value2form(values) {
    const params = { ...values };
    params.parNode = params.parentNode;
    delete params.parentNode;
    params.dataInputs = params.dataInputs.map(v => v.split('/'));
    // params.dataInputs = [['a', 'b'], ['c']];
    params.dataOutputs = params.dataOutputs.map(v => v.split('/'));
    params.command = params.command.map(v => v[Object.keys(v)[0]])
    // params.numRetry = Number(params.numRetry);
    // params.retryInterval = Number(params.retryInterval);
    return params;
}

export function formatValues(values) {
    const params = { ...values };
    params.parentNode = params.parentNode;
    delete params.parNode;
    params.dataInputs = params.dataInputs.map(v => v.join('/'));
    params.dataOutputs = params.dataOutputs.map(v => v.join('/'));
    params.command = params.command.map((v, index) => ({
        [`command${!index ? '' : '.'}${!index ? '' : index}`]: v,
    }))

    params.numRetry = Number(params.numRetry);
    params.retryInterval = Number(params.retryInterval);
    return params;
}

@Form.create()
@connect(({ task, loading }) => ({
    // industryList: task.industryList,
    task,
    loadingTask: loading.models.task,
}))
class TasksEdit extends React.Component {
    // constructor(props) {
    //     super(props);
    //     // this.state = {
    //     //     form: {},
    //     // }
    // }

    // eslint-disable-next-line react/sort-comp
    saveTask = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
        if (err) return;
        this.onEditTask({ ...formatValues(values) });
        });
    }

    onEditTask = values => {
        console.log(values);
        this.props.dispatch({
            type: 'task/editTask',
            payload: values,
        }).then(res => {
            if (res) {
              this.props.history.push({ pathname: '/myTasks/list' });
            }
          }, err => {
              console.log(err);
          });
    };

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
            // id: this.props.location.query.id,
            taskName: this.props.location.query.taskName,
            projectName: this.props.location.query.projectName,
          },
        }).then(res => {
            console.log(res)
            setTimeout(() => {
                if (res) {
                    this.props.form.setFieldsValue(value2form(res));
                }
            }, 10);
        });
       
      }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Breadcrumb >
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/myTasks">Tasks Application</Link>
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
                                                    // type: item.dataType,
                                                  },
                                                ],
                                            })(
                                                 item.type === 'input' ? <Input placeholder={`请输入${item.label}`} disabled = {item.name === 'id'}/>
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
                                                // type: item.dataType,
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
                        <Button type="primary" onClick={this.saveTask}>保存</Button>
                        <Button type="dashed" style={{ marginLeft: '10px' }} onClick={this.onCancel}>取消</Button>
                    </Form.Item>
                </Form>
                </Spin>
            </div>

        )
    }
}
export default TasksEdit;
