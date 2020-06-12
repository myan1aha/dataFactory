import { Form, Icon, Input, Button, Row, Col, Divider, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';

import styles from './setting.less';

import { changePassword } from './service';

function getFKey(obj) {
  for (var key in obj) return obj[key];
}

const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 6 },
};

@connect()
class Password extends React.Component {
  state = {
    hasError: false,
    loading: false,
  };

  onConfirm = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { passwordOld, passwordNew, passwordNew2 } = this.props.form.getFieldsValue();
        if (passwordNew !== passwordNew2) {
          message.info('新密码和确认密码不一致', 1);
          return;
        }
        this.changePassword({ passwordOld, passwordNew });
      }
    });
  };

  changePassword = async params => {
    this.setState({
      loading: true,
    });
    const result = await changePassword(params);
    if (result) {
      message.success('修改成功，请重新登录', 1);
      this.props.dispatch({
        type: 'login/logout',
      });
    }
    this.setState({
      loading: false,
    });
  };

  goBack = () => {
    // history 为空的话判断
    router.goBack();
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.content}>
        <div style={{ padding: '19px 0 0 19px' }}>
          <span>我的账户 / </span>
          <span style={{ fontWeight: 'bold' }}>修改密码</span>
        </div>
        <Divider style={{ margin: '18px 0 80px' }} />
        <Form>
          <Form.Item label="原密码" {...formItemLayout}>
            {getFieldDecorator('passwordOld', {
              rules: [{ required: true, message: '请输入原密码!' }],
            })(
              <Input.Password
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入原密码"
              />,
            )}
          </Form.Item>
          <Form.Item label="新密码" {...formItemLayout}>
            {getFieldDecorator('passwordNew', {
              rules: [{ required: true, message: '请输入新密码!' }],
            })(
              <Input.Password
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请输入新密码"
              />,
            )}
          </Form.Item>
          <Form.Item label="确认密码" {...formItemLayout}>
            {getFieldDecorator('passwordNew2', {
              rules: [{ required: true, message: '请再次输入新密码!' }],
            })(
              <Input.Password
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="请再次输入新密码"
              />,
            )}
          </Form.Item>
        </Form>
        <Row>
          <Col offset={9} span={6}>
            <Button type="primary" style={{ width: '100%' }} onClick={this.onConfirm}>
              确定
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
const Passwordf = Form.create({ name: 'normal_login' })(Password);

export default Passwordf;
