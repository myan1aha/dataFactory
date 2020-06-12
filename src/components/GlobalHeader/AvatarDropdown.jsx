import { Avatar, Icon, Menu, Spin } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';

class AvatarDropdown extends React.Component {
  onMenuClick = event => {
    const { key } = event;
    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
      return;
    }
    router.push(`/account`);
  };

  render() {
    const {
      permission={},
      menu,
    } = this.props;
    const { name } = permission;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {menu && (
          <Menu.Item key="center">
            <Icon type="user" />
            <FormattedMessage id="menu.account.center" defaultMessage="account center" />
          </Menu.Item>
        )}
        <Menu.Item key="settings">
          <Icon type="setting" />
          修改密码
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          注销登录
        </Menu.Item>
      </Menu>
    );
    return (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Icon
            type="user"
            className={styles.avatar}
            style={{
              borderRadius: '100%',
              fontSize: 18,
              padding: 3,
            }}
          />
          <span className={styles.name}>{name}</span>
        </span>
      </HeaderDropdown>
    );
  }
}

export default connect(({ permission }) => ({
  permission,
}))(AvatarDropdown);
