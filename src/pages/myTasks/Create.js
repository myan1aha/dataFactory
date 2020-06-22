/* eslint-disable max-len */
import React from 'react';
import { Breadcrumb, Form, Input, Button, Select, Tag } from 'antd';
import { connect } from 'dva';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'umi/link';
import options from './options'
import InsertFrom from './InsertForm'
import { taskDependency, getProList } from './service';

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

function formatValues(values) {
  const params = { ...values };
  params.parentNode = params.parNode;
  delete params.parNode;
  params.dataInputs = (params.dataInputs || []).map(v => v.join('/'));
  params.dataOutputs = (params.dataOutputs || []).map(v => v.join('/'));
  params.command = params.command.map((v, index) => ({
    [`command${!index ? '' : '.'}${!index ? '' : index}`]: v,
  }));

  params.numRetry = Number(params.numRetry);
  params.retryInterval = Number(params.retryInterval);
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
            iconLoading: false,
            proList: [],
            dependencyList: [],
        }
    }

    componentDidMount() {
        this.getProList();
    }

    getProList = async () => {
        const res = await getProList();
        this.setState({
            proList: res,
        })
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
        if (res) {
          this.props.history.push({ pathname: '/myTasks/list' });
        }
      });
  };

    onAnalyse = () => {
        const { validateFieldsAndScroll } = this.props.form;
        validateFieldsAndScroll(['projectName', 'dataInputs'], (err, values) => {
            if (err) return;
            this.analyseDependency();
        })
        // const value = {
        //     dataInputs: ["MongoCollection:/192.168.1.36:27017/res_kb_process/res_kb_process_patent", "MongoCollection:/192.168.1.36:27017/res_kb_process/res_kb_process_patent"],
        //     projectName: 'test2',
        // }
    };

    analyseDependency = async () => {
        const { getFieldsValue, setFieldsValue } = this.props.form;
        const value = getFieldsValue(['projectName', 'dataInputs']);
        value.dataInputs = value.dataInputs.length > 0 ? value.dataInputs.map(v => v.join('/')) : [];
        // const value = {
        //     projectName: 'test',
        //     dataInputs: ['Mongo:/192.168.1.36:27017/corpus/paper_title']
        // }

        console.log(value);
        const res = await taskDependency(value);
        if (res) {
            console.log(res);
            setFieldsValue({
                taskDependencies: res.dependencies,
            })
            this.setState({
                dependencyList: res.dependencies,
            })
        }
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
                        Tasks Creation
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br></br>
                <Form {...layout} name="basic">
                    {options.map(item => {
                            if (item.name !== 'id') {
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
                                                        required: item.noRequired ? false : true,
                                                        message: `请输入${item.label}`,
                                                        // type: item.dataType,
                                                    },
                                                    ],
                                                })(
                                                    item.type === 'input' ? <Input placeholder={`请输入${item.label}`} key={item.name}/>
                                                                            : <TextArea key={item.name}></TextArea>,
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
                                                    required: !item.noRequired,
                                                    message: `请输入${item.label}`,
                                                },
                                                ],
                                            })(
                                                <InsertFrom action="create" key={item.name} label={item.label} required="true" name={item.name}/>,
                                            )
                                            }
                                            </Form.Item>
                                        );
                                    case 'taskDependency':
                                        return (
                                            <Form.Item label={item.label} {...formItemLayout} key={item.key}>
                                            {getFieldDecorator(item.name, {
                                                rules: [
                                                {
                                                    required: !item.noRequired,
                                                },
                                                ],
                                            })(
                                                // eslint-disable-next-line no-tabs
                                                <Input style={{display: 'none'}} key={item.name}></Input>,
                                            )
                                            }
                                            {this.state.dependencyList.length > 0 ? this.state.dependencyList.map(v => (<Tag>{v}</Tag>)) : null}
                                            <div>
                                                <Button style={{ width: '30%' }} type="primary" loading={this.state.iconLoading} onClick={e => this.onAnalyse(e)}>解析任务依赖</Button>
                                            </div>
                                            </Form.Item>
                                        )
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
                                                        required: !item.noRequired,
                                                        message: `请输入${item.label}`,
                                                        validator: this.validator,
                                                        // type: item.dataType,
                                                        },
                                                    ],
                                                })(
                                                    <Select>
                                                        {this.state.proList.map(v => (<Select.Option key={v}>{v}</Select.Option>))}
                                                    </Select>,
                                                )
                                                }
                                            </Form.Item>
                                        )
                                    default: return null;
                                }
                            } else return null;
                        })
                    }
                    <Form.Item {...tailLayout}>
                        <Button type="primary" onClick={this.onAdd}>立即创建</Button>
                        <Button type="dashed" style={{ marginLeft: '10px' }}>取消</Button>

                    </Form.Item>
                </Form>
            </div>
            );
        }
}
export default TasksCreate;
