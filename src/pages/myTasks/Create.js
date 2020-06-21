/* eslint-disable max-len */
import React from 'react';
import { Breadcrumb, Form, Input, Button } from 'antd';
import { connect } from 'dva';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import Link from 'umi/link';
import options from './options';
import InsertFrom from './InsertForm';

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
  let params = { ...values };
  params = JSON.parse(JSON.stringify(params).replace(/parNode/g, 'parentNode'));
  params.dataInputs = params.dataInputs.map(v => v.join('/'));
  params.dataOutputs = params.dataOutputs.map(v => v.join('/'));
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
    this.state = {};
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
        this.props.history.push({ pathname: '/myTasks/list' });
      });
  };

  onChange = () => {
    console.log('change');
  };

  onAnalyse = e => {
    const values = e.target.value;
    this.props
      .dispatch({
        type: 'task/analyseTask',
        payload: values,
      })
      .then(res => {
        console.log(res);
      });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Home</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/myTasks">Tasks Application</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Tasks Creation</Breadcrumb.Item>
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
                            required: true,
                            message: `请输入${item.label}`,
                            // type: item.dataType,
                          },
                        ],
                      })(
                        item.type === 'input' ? (
                          <Input placeholder={`请输入${item.label}`} />
                        ) : (
                          <TextArea></TextArea>
                        ),
                      )}
                      <div>
                        {item.name === 'taskDependencies' ? (
                          <Button onClick={e => this.onAnalyse(e)}>解析任务依赖</Button>
                        ) : null}
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
                            required: true,
                            message: `请输入${item.label}`,
                          },
                        ],
                      })(
                        <InsertFrom
                          action="create"
                          label={item.label}
                          required="true"
                          name={item.name}
                        />,
                      )}
                    </Form.Item>
                  );
                default:
                  return null;
              }
            } else return null;
          })}
          <Form.Item {...tailLayout}>
            <Button type="primary" onClick={this.onAdd}>
              立即创建
            </Button>
            <Button type="dashed" style={{ marginLeft: '10px' }}>
              取消
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default TasksCreate;
