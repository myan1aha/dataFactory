import React from 'react';
import { Breadcrumb, Form, Input, Button } from 'antd';
import Link from 'umi/link';
import options from './options'
import MultiInput from './MultiInput'
// import Multi from './MuInput';

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

// eslint-disable-next-line react/prefer-stateless-function
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
        const formInfo = document.querySelector('.form_info');
        this.setState({
            // eslint-disable-next-line react/no-unused-state
            form: formInfo,
        })
    }

    render() {
        // const { getFieldDecorator } = this.props.form;
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
                                    // console.log(item.label);
                                    return (
                                        <Form.Item label={item.label} {...formItemLayout} key={item.key}
                                        rules={[
                                            {
                                                required: true,
                                                message: `请输入${item.label}`,
                                            },
                                            ]}
                                        >
                                           <MultiInput label={item.label} required={!item.noneed} />
                                        </Form.Item>
                                    );
                                default: return null;
                            }
                        })
                    }
                    <Form.Item {...tailLayout}>
                        <Button type="primary" onClick={this.onAdd}>保存</Button>
                        <Button type="dashed" style={{ marginLeft: '10px' }}>取消</Button>
                    </Form.Item>
                </Form>
            </div>

        )
    }
}
export default TasksEdit;