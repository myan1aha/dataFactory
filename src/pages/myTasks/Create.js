/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
import React from 'react';
import { Form, Input, Button, Select, Tag, InputNumber, Tooltip, message } from 'antd';
import { connect } from 'dva';
import options from './components/options'
import InsertFrom from './components/Input/InsertForm'
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
  params.failEmails = params.failEmails ? params.failEmails : '';
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
        // console.log(this.props);
        // const { userId } = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (err) return;
          this.onAddTask({ ...formatValues(values) });
        });
    };


  onAddTask = values => {
    // console.log(values);
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
        const { getFieldsValue } = this.props.form;
        const { dataInputs, projectName } = getFieldsValue(['projectName', 'dataInputs']);
        if (!projectName) {
            message.error('请输入项目名称！');
            return;
        }
        if (!dataInputs) {
            message.error('请输入来源表！');
            return;
        }
        this.analyseDependency();
    };

    analyseDependency = async () => {
        const { getFieldsValue, setFieldsValue } = this.props.form;
        const value = getFieldsValue(['projectName', 'dataInputs']);
        value.dataInputs = value.dataInputs.length > 0 ? value.dataInputs.map(v => v.join('/')) : [];
        const res = await taskDependency(value);
        setFieldsValue({
            taskDependencies: res.dependencies,
        })
        if (res.dependency.length > 0) {
            this.setState({
                dependencyList: res.dependency,
            })
        } else {
            this.setState({
                dependencyList: ['no dependency'],
            })
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const inputWidth = {
            width: '90%',
            marginRight: '8px',
        }
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
                    {options.map(item => {
                        if (item.name === 'id') return null;
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
                                                },
                                                ],
                                            })(
                                                item.type === 'input' ? <Input placeholder={`请输入${item.label}`} key={item.name} maxLength={50} />
                                                                        : <TextArea placeholder={`请输入${item.label}`} key={item.name}></TextArea>,
                                            )}
                                                <div style={{ display: 'flex' }}>
                                                { item.name === 'retryInterval' ? (<Tag style={{ fontSize: '13px' }} key={item.name}>毫秒</Tag>) : null }
                                            </div>
                                        </Form.Item>
                                    );
                                case 'inputNum':
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
                                                    message: item.name === 'numRetry' ? `请输入${item.label}(0 ~ 3的整数)` : `请输入${item.label}(正整数)`,
                                                    pattern: item.name === 'numRetry' ? new RegExp(/^[0-3]\d*$/, 'g') : new RegExp(/^[0-9]\d*$/, 'g'),
                                                    // max: item.name === 'numRetry' ? 3 : null,
                                                    // max: 3,
                                                    // min: 0,
                                                },
                                                ],
                                            })(
                                                <InputNumber key={item.name} style={ item.name === 'retryInterval' ? inputWidth : { width: '100%' }} placeholder={`请输入${item.label}`}/>,
                                            )}
                                                <div style={{ display: 'inline' }}>
                                                { item.name === 'retryInterval' ? (<Tag style={{ fontSize: '13px' }} key={item.name}>毫秒</Tag>) : null }
                                            </div>
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
                                        )}
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
                                            <Input style={{ display: 'none' }} key={item.name}></Input>,
                                        )
                                        }
                                        <Tooltip title="解析任务依赖">
                                            <Button style={{ display: 'inline', marginRight: '10px' }} shape="circle" icon="search" loading={this.state.iconLoading} onClick={e => this.onAnalyse(e)}></Button>
                                        </Tooltip>
                                        {this.state.dependencyList.length > 0 ? <span style={{ fontSize: '15px' }} >{this.state.dependencyList}</span> : null}
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
                                                <Select key={item.name} placeholder={`请输入${item.label}`}>
                                                    {this.state.proList.map(v => (<Select.Option key={v}>{v}</Select.Option>))}
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
            );
        }
}
export default TasksCreate;
