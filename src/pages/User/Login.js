import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Icon, Input, Button, Checkbox, Alert, Carousel } from 'antd';
import router from 'umi/router';
import styles from './Login.less';

const calarray = [
  { title: '产业地图', subTitle: ['全球产业链精准合作招商平台'] },
  {
    title: '智能项目管理',
    subTitle: ['行程与记录工具、报送、初审、研判进度', '实时掌握团队组织，项目管理更智能更快捷'],
  },
  { title: '智慧招商', subTitle: ['大数据招商解决方案'] },
];
@connect(({ loading }) => ({
  loading: false,
}))
class LoginPageForm extends Component {
  state = {
    error: null,
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'login/login',
          payload: { ...values, errorCallBack: this.errorCallBack },
        });
      }
    });
  };
  errorCallBack = error => {
    this.setState({
      error,
    });
  };
  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { error } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.left}>
            <Carousel autoplay>
              {calarray.map((v, idx) => (
                <div className={`${styles.back} ${styles['cal' + idx]}`} key={idx}>
                  <div className={styles.calTitle}>{v.title}</div>
                  {v.subTitle.map(m => (
                    <div className={styles.calSubTitle} key={m}>
                      {m}
                    </div>
                  ))}
                </div>
              ))}
            </Carousel>
          </div>
          <div className={styles.right}>
            <div className={styles.main}>
              <Form
                onSubmit={this.handleSubmit}
                colon={false}
                className="login-form"
                hideRequiredMark
              >
                <Form.Item>
                  <div className={styles.title1}>欢迎登录</div>
                  <div className={styles.title}>浙江省工业和信息化</div>
                  <div className={styles.title}>精准合作重点项目平台</div>
                </Form.Item>
                {error ? <Form.Item>{this.renderMessage(error)}</Form.Item> : null}
                <Form.Item label="手机号码" style={{ marginBottom: '0.8rem' }}>
                  {getFieldDecorator('mobile', {
                    rules: [{ required: true, message: '请输入手机号码!' }],
                  })(
                    <Input
                      prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      placeholder="请输入手机号码"
                    />,
                  )}
                </Form.Item>
                <Form.Item label="密码">
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码!' }],
                  })(
                    <Input
                      prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                      type="password"
                      placeholder="请输入密码"
                    />,
                  )}
                </Form.Item>
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  登录
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
const LoginPage = Form.create({ name: 'normal_login' })(LoginPageForm);

export default LoginPage;

/*
<div className={styles.content}>
          <div className={styles.main}>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item>
                <h3>登录</h3>
              </Form.Item>
              {error ? <Form.Item>{this.renderMessage(error)}</Form.Item> : null}
              <Form.Item>
                {getFieldDecorator('mobile', {
                  rules: [{ required: true, message: '请输入用户名!' }],
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="请输入用户名"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码!' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="请输入密码"
                  />,
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked',
                  initialValue: true,
                })(<Checkbox>记住密码</Checkbox>)}
                <Button
                  loading={loading}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        */
