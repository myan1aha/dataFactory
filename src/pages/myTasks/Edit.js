/* eslint-disable max-len */
import React from 'react';
import { Breadcrumb, Form, Input, Button, Spin, Select, Tag } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';

import options from './options'
import InsertForm from './InsertForm'
import { taskDependency, getProList } from './service'

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
  params.dataOutputs = params.dataOutputs.map(v => v.split('/'));
  params.command = params.command.map(v => v[Object.keys(v)[0]]);
  return params;
}

export function formatValues(values) {
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
            dependencyList: '',
            proList: [],
        }
    }

    // eslint-disable-next-line react/sort-comp
    getProList = async () => {
        const res = await getProList();
        this.setState({
            proList: res,
        })
    }

    componentDidMount() {
        this.props.dispatch({
          type: 'task/getTaskDetail',
          payload: {
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
        this.getProList();
    }

    saveTask = () => {
        this.props.form.validateFieldsAndScroll((err, values) => {
        if (err) return;
        this.onEditTask({ ...formatValues(values) });
        });
    }

    onEditTask = values => {
        // console.log(values);
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
  };

  validatorList = (rule, value, callback) => {
    const { required, msg, inputType } = rule;
    if (inputType === 'select') {
      if (value) {
        if (required && value.length < 1) {
            callback(msg)
        } else if (value.length > 0 && value.find(v => v.length < 4)) {
            callback('请选择具体的表')
        } else {
            callback()
        }
      } else if (!required) {
            callback()
        } else {
            callback(msg)
        }
    } else if (
        required &&
        (!value || value.findIndex(v => !v || v.split(' ').join('').length === 0) > -1)
      ) {
        callback(msg);
      } else if (value && value.findIndex(v => !v || v.split(' ').join('').length === 0) > -1) {
        callback(msg);
      } else {
        callback();
      }
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
                                                  required: !item.noRequired,
                                                  message: `请输入${item.label}`,
                                                  // validator: this.validator,
                                                  // type: item.dataType,
                                                },
                                              ],
                                          })(
                                                item.type === 'input' ? <Input placeholder={`请输入${item.label}`} disabled ={!item.isEdit}/>
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
                                              required: !item.noRequired,
                                              message: `请输入${item.label}`,
                                              // type: item.dataType,
                                              inputType: item.type,
                                              validator: this.validatorList,
                                          },
                                          ],
                                      })(
                                          // eslint-disable-next-line max-len
                                          <InsertForm action="edit" label={item.label} name={item.name}/>,
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
                                            <Input style={{display: 'none'}} key={item.name}></Input>,
                                        )
                                        }
                                        <div>
                                            <Button style={{ width: '30%' }} type="primary" loading={this.state.iconLoading} onClick={e => this.onAnalyse(e)}>解析任务依赖</Button>
                                        </div>
                                        {this.state.dependencyList.length > 0 ? this.state.dependencyList.map(v => (<Tag>{v}</Tag>)) : null}
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
                                                  required: !item.noRequired,
                                                  message: `请输入${item.label}`,
                                                  // validator: this.validator,
                                                  // type: item.dataType,
                                                },
                                              ],
                                          })(
                                              <Select disabled={!item.isEdit}>
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
                      <Button type="primary" onClick={this.saveTask}>保存</Button>
                      <Button type="dashed" style={{ marginLeft: '10px' }} onClick={this.onCancel}>取消</Button>
                  </Form.Item>
              </Form>
              </Spin>
          </div>
    );
  }
}
export default TasksEdit;
