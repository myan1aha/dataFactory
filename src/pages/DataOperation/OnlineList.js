import React from 'react';
import { Table, Breadcrumb, Popconfirm, message, Spin, Modal, Icon, Input, Select, Tooltip, Button, List, Form } from 'antd';
import Link from 'umi/link';
import { getSubsDetail } from './service'

import importItems from './importItems';
import { connect } from 'dva';

const { TextArea } = Input;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const detailFormLayout = {
  labelCol: {
    xs: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 12 },
  },
}

const entityDetailKey = [
  { label: '在线表id', name: 'id' },
  { label: '在线表名称', name: 'name' },
  { label: '描述', name: 'description' },
  { label: '数据库名称', name: 'dbName' },
  { label: '数据库类型', name: 'dbType' },
  { label: '服务器名称', name: 'serverName' },
  { label: '数据源id', name: 'sourceId' },
  { label: '数据总量', name: 'totalCount' },
  { label: '昨日新增', name: 'yesterdayNewCount' },
]

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 14 },
  },
};

const dbType = ['Mongo', 'Mysql', 'Hive', 'Hbase', 'Es', 'ArangoDB'];

@Form.create()
@connect(({ dataOperation, loading }) => ({
  dataOperation,
  loading: loading.models.dataOperation,
}))
class DisplayTable extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
          // dataSrc: [],
          modalVisibal: false,
          // type: dbType,
          selectOptions: [],
          detailModal: false,
          entityDetail: '',
        };
        this.columns = [
            // {
            //   title: 'sourceId',
            //   dataIndex: 'sourceId',
            //   width: '15%',
            // },
            {
              title: '表名',
              dataIndex: 'name',
              width: '10%',
            },
            {
              title: '表描述',
              dataIndex: 'description',
              width: '10%',
            },
            {
              title: '数据库类型',
              dataIndex: 'dbType',
              width: '10%',
            },
            {
                title: '库名',
                dataIndex: 'dbName',
                width: '10%',
            },
            {
              title: '服务器地址',
              dataIndex: 'serverName',
              width: '15%',
            },
            {
              title: '数据总量',
              dataIndex: 'totalCount',
              width: '8%',
            },
            {
              title: '今日新增',
              dataIndex: 'yesterdayNewCount',
              width: '8%',
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
                        <Tooltip title="查看详情">
                          <Icon type="profile" onClick={() => this.getOnlineListDetail(records)}/>
                          {/* <Icon type="profile" onClick={this.info}/> */}
                        </Tooltip>
                      {/* </Link> */}
                    </li>
                    <li >
                      <Popconfirm
                        title="Are you sure delete this task?"
                        // eslint-disable-next-line max-len
                        onConfirm={e => this.deleteOnlineList(e, records.id)}
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

    // async componentDidMount() {
    //   const data = await this.getOnlineList()
    //   this.setState({
    //       dataSrc: data,
    //   })
    // }

    componentDidMount() {
      this.props.dispatch({
        type: 'dataOperation/getOnlineList',
        payload: {
          page: 1,
          pageSize: 10,
          filter: {
            dbType: '',
          },
        },
      })
    }

    // getOnlineList = async () => {
    //   const res = await getOnlineList();
    //     return res;
    // }

    showModal = () => {
      this.setState({
        modalVisibal: true,
      })
    }

    closeModal = () => {
      this.setState({
        modalVisibal: false,
        detailModal: false,
      })
    }

    importOnlineList = () => {

    }

    select = async val => {
      const res = await getSubsDetail(val);
      console.log(res);
    }

    // 查看表详情
    getOnlineListDetail = record => {
      // this.props.dispatch({
      //   type: 'dataOperation/getOnlineListDetail',
      //   payload: {
      //     entityId: id,
      //   },
      // }).then(res => {
      //   console.log(res);
      // })
      // const { setFieldsValue } = this.props.form;
      // console.log(record);
      // this.props.form.setFieldsValue(record);
      this.setState({
        detailModal: true,
        entityDetail: record,
      })
    }

    deleteOnlineList = async (e, id) => {
      e.preventDefault();
      e.stopPropagation();
      this.props.dispatch({
        type: 'dataOperation/deleteOnlineList',
        payload: {
          entityId: id,
        },
      }).then(() => {
        message.success('已删除');
      })
    }

    onSelect = async val => {
      const { selectOptions } = this.state;
      selectOptions.push(val);
      if (selectOptions.length === 1) {
        // const res = await request('')
      }
    }

    render() {
      const { getFieldDecorator } = this.props.form;
      const { dataOperation: { onlineList } } = this.props;
      // console.log(this.props);
        return (
          <div>
            {/* <Breadcrumb style={{ marginBottom: '20px' }}>
                <Breadcrumb.Item>
                    <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                    <Link to="/Dataset">Dataset Application</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{this.props.typeName}</Breadcrumb.Item>
            </Breadcrumb> */}
            <Button style={{ marginBottom: '10px' }} onClick={this.showModal}>导入在线表</Button>
            <Modal
            title="导入在线表"
            onOk={this.importOnlineList}
            okText="确认导入"
            onCancel={this.closeModal}
            visible={this.state.modalVisibal}
            >
              <Form {...layout} name="basic">
                {importItems.map(item => {
                  switch (item.type) {
                    case 'textarea':
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
                                    required: item.noRequired ? false : true,
                                    message: `请输入${item.label}`,
                                },
                                ],
                            })(<TextArea placeholder={`请输入${item.label}`} key={item.name}></TextArea>)}
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
                                    // validator: this.validator,
                                    // type: item.dataType,
                                    },
                                ],
                            })(
                                <Select key={item} placeholder={`请输入${item.label}`} onSelect={val => this.select(val)}>
                                    {item.name === 'dbType' ? dbType.map(v => (<Select.Option key={v}>{v}</Select.Option>)) : null}
                                </Select>,
                            )
                            }
                        </Form.Item>
                      );
                    default: return null;
                  }
                })}
              </Form>
            </Modal>
            <Table
                columns={this.columns}
                dataSource={onlineList}
                // onRow={ records => { records.key = `${records.id}`;  records.rowKey = `${records.id}`  }}
                rowKey={ record => record.id }
            />
            <Modal
            title="详情"
            visible={this.state.detailModal}
            onOk={this.closeModal}
            onCancel={this.closeModal}
            >
              <Form>
                {entityDetailKey.map(item => (
                  <Form.Item
                    label={item.label}
                    name={item.name}
                    key={item.name}
                    {...detailFormLayout}
                    >
                    {getFieldDecorator(item.name, {
                      })(
                      <span style={{ marginLeft: '20px' }} key={item.name}>{this.state.entityDetail[`${item.name}`]}</span>,
                      )
                    }
                  </Form.Item>
                ))}
              </Form>
            </Modal>
          </div>
        )
    }
}

export default DisplayTable;
