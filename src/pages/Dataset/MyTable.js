import React from 'react';
import { Table, Breadcrumb, Popconfirm, message, Spin, Modal, Icon, Input, Select, Tooltip, Button, Tag } from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import { getServerDetail, importEntityChildren, deleteEntity } from './service'

// @connect({loading}) {
//   loading,
// }
class DisplayTable extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          dataSrc: [],
          modalVisible: false,
          serveAddr: '',
          dbName: '',
        };
        this.columns = [
            {
              title: 'id',
              dataIndex: 'id',
              width: '15%',
            },
            {
              title: '名称',
              dataIndex: 'qualifiedName',
              width: '15%',
            },
            {
              title: '服务器地址',
              dataIndex: 'host',
              width: '10%',
            },
            {
              title: '类别',
              dataIndex: 'typeName',
              width: '10%',
            },
            {
              title: '负责人',
              dataIndex: 'owner',
              width: '10%',
            },
            {
              title: '状态',
              dataIndex: 'isActive',
              width: '10%',
              render: isActive => (isActive ? <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /> : <Icon type="close-circle" />),
            },
            {
              title: '操作',
              dataIndex: 'option',
              // key: 'option',
              width: '8%',
              render: (_, records) =>
                 (
                  <ul style={{ display: 'flex' }}>
                    <li style={{ marginRight: '10px' }} >
                      {/* <Link
                        to={{ pathname: '/myTasks/edit',
                              query: {
                                taskName: records.taskName,
                                projectName: records.projectName,
                              },
                            }}
                      > */}
                        <Tooltip title="导入">
                          <Icon type="import" onClick={() => this.onImport(records)}/>
                        </Tooltip>
                      {/* </Link> */}
                    </li>
                    <li >
                      <Popconfirm
                        title="确定要删除这项纪录?"
                        onConfirm={() => this.deleteEntity(records.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Tooltip title="删除">
                          <Icon type="delete" style={{ color: 'darkred' }} />
                        </Tooltip>
                      </Popconfirm>
                    </li>
                  </ul>
                )
              ,
            },
          ];
    }

    async componentDidMount() {
      const data = await getServerDetail({
          type: this.props.typeName,
      })
      this.setState({
          dataSrc: data,
      })
    }

    onImport = value => {
      this.setState({
        modalVisible: true,
        serveAddr: value.id,
      })
    }

    confirmImport = async () => {
      console.log(this.state.dbName);
      const params = {
        entityId: this.state.serveAddr,
        name: this.state.dbName,
      }
      await importEntityChildren(params);
      this.setState({
        modalVisible: false,
        dbName: '',
        serveAddr: '',
      });
    }

    cancelImport = () => {
      this.setState({
        modalVisible: false,
      })
    }

    inputChange = e => {
      this.setState({
        dbName: e.target.value,
      })
    }

    deleteEntity = async id => {
      const res = await deleteEntity({ entityId: id });
      console.log(res);
    }

    render() {
        return (
          <div>
            <Breadcrumb style={{ marginBottom: '20px' }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/Dataset">Dataset Application</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.props.typeName}</Breadcrumb.Item>
            </Breadcrumb>
            <Table
                columns={this.columns}
                dataSource={this.state.dataSrc}
                rowKey={ record => record.id }

            />
            <Modal
            title="添加数据库名称"
            okText="确认导入"
            cancelText="取消导入"
            visible={this.state.modalVisible}
            onOk={this.confirmImport}
            onCancel={this.cancelImport}
            >
              <Input addonBefore="服务器地址" style={{ marginBottom: '10px' }} value={this.state.serveAddr} disabled></Input>
              <Input addonBefore="数据库名称" placeholder="请输入数据库名称" onChange={e => this.inputChange(e)} value={this.state.dbName}></Input>
            </Modal>
          </div>
        )
    }
}

export default DisplayTable;
