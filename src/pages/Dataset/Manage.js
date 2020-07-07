/* eslint-disable max-len */
import React from 'react';
import { Form, Input, Breadcrumb, Button, Select } from 'antd';
import { connect } from 'dva';
// import Link from 'umi/link';
import formItems from './formItems';
import { addServer } from './service'

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
const datasetNames = [
    'Mongo', 'Mysql', 'Hbase', 'Hive', 'ES', 'Arango',
]

function formatValues(values) {
    const params = { ...values };
    params.port = parseInt(params.port);
    return params;
}
// eslint-disable-next-line react/prefer-stateless-function
@Form.create()
@connect(({}) => ({

}))
class Manage extends React.Component {
    onAdd = () => {
        // console.log(this.props);
        // const { userId } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (err) return;
          this.onAddServer({ ...formatValues(values) });
        });
    };

    onAddServer = async values => {
        const res = await addServer(values);
        console.log(values);
        if (res) {
            const { type } = values;
            this.props.history.push(`/dataset/${type}`);
        }
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                {/* <Breadcrumb >
                    <Breadcrumb.Item>
                        <Link to="/">Home</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <Link to="/myTasks">Tasks Application</Link>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        Tasks Creation
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br></br> */}
                <Form {...layout} name="basic">
                    {formItems.map(item => {
                        switch (item.type0) {
                            case 'text':
                                return (
                                    <Form.Item
                                        label={`${item.label}`}
                                        name={`${item.name}`}
                                        key={item.name}
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator(item.name, {
                                            rules: [
                                            {
                                                required: !item.noRequired,
                                                message: `请输入${item.label}`,
                                            },
                                            ],
                                        })(
                                            item.type === 'input' ? <Input placeholder={`请输入${item.label}`} key={item.name} />
                                                                    : <TextArea placeholder={`请输入${item.label}`} key={item.name}></TextArea>,
                                        )}
                                    </Form.Item>
                                );
                            case 'select':
                                return (
                                    <Form.Item
                                        label={`${item.label}`}
                                        name={`${item.name}`}
                                        key={item.name}
                                        {...formItemLayout}
                                    >
                                        {getFieldDecorator(item.name, {
                                            rules: [
                                                {
                                                required: !item.noRequired,
                                                message: `请输入${item.label}`,
                                                validator: this.validator,
                                                // type: item.dataType,
                                                },
                                            ],
                                        })(
                                            <Select key={item.name} placeholder={`请输入${item.label}`}>
                                                {datasetNames.map(v => (<Select.Option key={v}>{v}</Select.Option>))}
                                            </Select>,
                                        )
                                        }
                                    </Form.Item>
                                )
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
export default Manage;
