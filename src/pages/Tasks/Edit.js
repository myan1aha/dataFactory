import React from 'react';
import { Breadcrumb, Form, Input, Button, Select } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';

import options from './options'
import InsertForm from './InsertForm'
// import Multi from './MuInput';
import OrderInput from './OrderInput'

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
@connect(({ task }) => ({
    industryList: task.industryList,
}))
class TasksEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // eslint-disable-next-line react/no-unused-state
            form: {},
        }
    }

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

    formatForm = () => {
        // const { getFieldsValue } = this.props;
        const data = this.props.location.query;
        // data.industryCode += '';
        // data.area = renderAreaArray(data.areaCode);
        // data.dateTime0 = data.signingTime ? moment(data.signingTime) : null;
        // data.dateTime1 =
        //     data.startTime && data.endTime ? [moment(data.startTime), moment(data.endTime)] : [];

        // [1, 2, 3, 4].forEach(v => (data[`quarter${v}`] = ''));
        // (data.records || []).forEach(v => {
        //     data[`quarter${v.quarter}`] = v.investment;
        // });
        data.proName = 'pro';
        this.props.form.setFieldsValue({
            taskName: data.name,
            // type: data.type,
            proName: data.proName,
        });
    };

    render() {
        console.log(this.props);
        const { getFieldDecorator, getFieldsValue } = this.props.form;
        // console.log('fields', getFieldsValue());
        const data = this.props.location.query;
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
                                                initialValue: data[item.name] ? data[item.name] : null,
                                            })(
                                                 item.type === 'input' ? <Input placeholder={`请输入${item.label}`}/>
                                                                        : <TextArea></TextArea>,
                                            )}
                                        </Form.Item>
                                    );
                                case 'select':
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
                                                 <Select></Select>
                                            )}
                                        </Form.Item>
                                    )
                                case 'insertForm':
                                    // console.log(item.label);
                                    return (
                                        // eslint-disable-next-line max-len
                                        <Form.Item label={item.label} {...formItemLayout} key={item.key}>
                                        {getFieldDecorator(item.name, {
                                            rules: [
                                            {
                                                required: true,
                                                message: `请输入${item.label}`,
                                            },
                                            ],
                                        })(
                                            // eslint-disable-next-line max-len
                                            <InsertForm label={item.label} required={!item.noneed} name={item.name}/>,
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
            </div>

        )
    }
}
export default TasksEdit;
