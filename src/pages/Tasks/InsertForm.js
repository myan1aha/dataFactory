/* eslint-disable comma-dangle */
/* eslint-disable object-shorthand */
import React from 'react';
import { Button, Icon, Input, Cascader, Select, Form } from 'antd';

import LazyCascader from './LazyCascader';

import styles from './index.less';

// function arrayMove(array, from, to) {
//   array = array.slice();
//   array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);

//   return array;
// }


class DynamicFieldSet extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // eslint-disable-next-line no-nested-ternary
      // list: props.value ? props.value.map(v => ({ value: v }))
      //                   : props.required ? [{ value: '' }]
      //                                    : [],
      list: [],
    };
  }

  remove = (e, k) => {
    // console.log(e, k);
    const list = this.state.list.filter(v => 
      {
        console.log(v,k);
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
      })
    }

    // this.setState({
    //   list,
    // });
  };

  add = () => {
    const { list } = this.state;
    // console.log(list);
    this.setState({
      list: list.concat({ value: '' }),
    });
  };

  onChange2 = (e, v) => {
    // console.log('input', e.target.value, v);
    v.value = e.target.value;
    const { list } = this.state;
    this.setState({
      list: list
    })
  }

  render() {
    const { list = [] } = this.state;
    // console.log(list);
    const { label, name } = this.props;
    // console.log(label, name);
    return (
      <React.Fragment>
          {list.map((v, index) =>
           (
             // eslint-disable-next-line react/no-array-index-key
             <Form.Item key={`item-${index}`}>
              <div className={styles.inputWrapper} >
              { name === 'command' ? <Input value={v.value} onChange={e => this.onChange2(e, v)}/>
                : <Select>
                  <Select.Option value="a">ddd</Select.Option>
                </Select>
                // : <LazyCascader/>
              }
                <Icon
                  theme="filled"
                  className="dynamic-delete-button"
                  type="minus-circle"
                  onClick={e => this.remove(e, v)}
                />
                  <div className="tableNumber">{label}{index + 1}</div>
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
