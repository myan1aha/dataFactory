/* eslint-disable comma-dangle */
/* eslint-disable object-shorthand */
import React from 'react';
import { Button, Icon, Input, Cascader, Form } from 'antd';

// import LazyCascader from './LazyCascader';
import { getTableDetail } from './service';
import styles from './index.less';

// function arrayMove(array, from, to) {
//   array = array.slice();
//   array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);

//   return array;
// }
const options = [
  {
    value: 'Top Level1',
    label: 'topLevel2',
    isLeaf: false,
  },
  {
    value: 'Top Level2',
    label: 'topLevel2',
    isLeaf: false,
  },
];

class DynamicFieldSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line no-nested-ternary
      // list: props.value ? props.value.map(v => ({ value: v }))
      //                   : props.required ? [{ value: '' }]
      //                                    : [],
      list: [],
      options,
      alertStyle: {
        display: 'none',
      },
    };
  }

  loadData = async selectedOptions => {
    console.log('loadData', selectedOptions);
    const len = selectedOptions.length;
    const targetOption = selectedOptions[-1];
    targetOption.loading = true;

    console.log(targetOption.value);

    const response = await getTableDetail(targetOption.value);
    response.then(res => {
      targetOption.loading = false;
      targetOption.children = [];
      res.forEach(item => {
        targetOption.children.push({
          label: item.value,
          value: item.value,
          isLeaf: len === 3,
        });
      });
      this.setState({
        // eslint-disable-next-line react/no-access-state-in-setstate
        options: [...this.state.options],
      });
    });
    // load options lazily
    // setTimeout(() => {
    //   targetOption.loading = false;
    //   targetOption.children = [
    //     {
    //       label: `${targetOption.label} Dynamic 1`,
    //       value: 'dynamic1',
    //       isLeaf: len === 3,
    //     },
    //     {
    //       label: `${targetOption.label} Dynamic 2`,
    //       value: 'dynamic2',
    //       isLeaf: false,
    //     },
    //   ];

    //   this.setState({
    //     // eslint-disable-next-line react/no-access-state-in-setstate
    //     options: [...this.state.options],
    //   });
    // }, 1000);
  };

  remove = (e, k) => {
    // console.log(e, k);
    const list = this.state.list.filter(v => {
      console.log(v, k);
      return v !== k;
    });
    console.log(list);
    const { required } = this.props;
    if (required && list.length < 1) {
      // eslint-disable-next-line no-unused-expressions
      this.setState({
        list: [],
      });
    } else {
      this.setState({
        list: list,
      });
    }
  };

  add = () => {
    const { list } = this.state;
    // console.log(list);
    this.setState({
      list: list.concat({ value: '' }),
    });
  };

  onChange = (e, item) => {
    // console.log(e, item);
    const { list } = this.state;
    const value = e.target ? e.target.value : e;
    // 判断重复
    const isExist =
      list.length > 1 ? list.some(v => value.join() === (v.value.join() || v.value)) : false;
    console.log(isExist);
    if (!isExist) {
      // console.log("没有重复");
      item.value = value;
      // this.setState({});
      const { onChange } = this.props;
      // eslint-disable-next-line no-unused-expressions
      onChange && onChange(this.state.list.map(v => v.value));
    } else {
      alert('重复表');
    }
  };

  render() {
    const { list = [], alertStyle } = this.state;
    // console.log(list);
    const { label, name } = this.props;
    // console.log(label, name);
    return (
      <React.Fragment>
        {list.map((v, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Form.Item key={`item-${index}`}>
            <div className={styles.inputWrapper}>
              {name === 'command' ? (
                <Input value={v.value} onChange={e => this.onChange(e, v)} />
              ) : (
                // : <Select>
                //   <Select.Option value="a">ddd</Select.Option>
                // </Select>
                <Cascader
                  options={this.state.options}
                  loadData={this.loadData}
                  onChange={e => this.onChange(e, v)}
                  value={v.value}
                  // changeOnSelect
                />
              )}
              <Icon
                theme="filled"
                className="dynamic-delete-button"
                type="minus-circle"
                onClick={e => this.remove(e, v)}
              />
              <div className="tableNumber">
                {label}
                {index + 1}
              </div>
              {/* <Alert message="Success Text" style={alertStyle} type="success" /> */}
            </div>
          </Form.Item>
        ))}
        <div style={{ marginTop: '-10px' }}>
          <Button style={{ width: '30%' }} type="primary" onClick={this.add}>
            新增{label}
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default DynamicFieldSet;
