/* eslint-disable comma-dangle */
/* eslint-disable object-shorthand */
import React from 'react';
import { Button, Icon, Cascader } from 'antd';

// import { render } from 'react-dom';
// eslint-disable-next-line import/no-unresolved
import { sortableContainer, sortableElement, sortableHandle } from 'react-sortable-hoc';

import styles from './index.less';

function arrayMove(array, from, to) {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);

  return array;
}
const options = [
  {
    value: 'category',
    label: 'Category',
    children: [
      {
        value: 'dataPhase',
        label: '数据阶段',
        children: [
          {
            value: '1',
            label: '1',
          },
        ],
      },
      {
          value: 'project',
          label: '项目',
          children: [
              {
              value: '2',
              label: '2',
              },
          ],
      },
      {
          value: 'dataType',
          label: '数据类型',
          children: [
              {
              value: '',
              label: '',
              },
          ],
      },
      {
          value: 'importance',
          label: '重要度',
          children: [
              {
              value: '',
              label: '',
              },
          ],
      },
    ],
  },
];
const DragHandle = sortableHandle(() => <div className={styles.handle}></div>);

const SortableItem = sortableElement(({ value }) => (
  <li className={styles.dragItem}>
    <DragHandle />
    {value}
  </li>
));

const SortableContainer = sortableContainer(({ children }) => <ul>{children}</ul>);

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

  static getDerivedStateFromProps(nextProps, state) {
    const { value, required } = nextProps;
    if (value && value !== state.value) {
      return {
        value,
        // eslint-disable-next-line no-nested-ternary
        list: value.length > 0 ? value.map(v => ({ value: v })) : required ? [{ value: '' }] : [],
      };
    }
    return null;
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const list = arrayMove(this.state.list, oldIndex, newIndex);

    const { onChange } = this.props;
    // eslint-disable-next-line no-unused-expressions
    onChange && onChange(list.map(v => v.value));
    // console.log(list);
    // this.setState({
    //   list,
    // });
  };

  remove = (e, k) => {
    const list = this.state.list.filter(v => v !== k);
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
    console.log(list);
    this.setState({
      list: list.concat({ value: '' }),
    });
  };

  onChange = (e, item) => {
    // const { value } = e.target;
    console.log(e, item);
    item.value = e;
    const { list } = this.state;
    this.setState({
      list: list
    })
    console.log(this.state.list);
  };

  render() {
    const { list = [] } = this.state;
    // const list = [...document.getElementsByClassName('cascader')];
    const { label } = this.props;
    // console.log(this.props);

    return (
      <React.Fragment>
        <SortableContainer onSortEnd={this.onSortEnd} useDragHandle helperClass="is-moving">
          {list.map((v, index) => 
          { console.log(v, index);
          return (
            <SortableItem
              // eslint-disable-next-line react/no-array-index-key
              key={`item-${index}`}
              index={index}
              value={
                <div className={styles.inputWrapper}>
                  {/* <Input value={v.value} onChange={e => this.onChange(e, v)} /> */}
                  <Cascader className="cascader"
                    options={options}
                    value={v.value} onChange={e => this.onChange(e, v)}/>
                  <Icon
                    theme="filled"
                    className="dynamic-delete-button"
                    type="minus-circle"
                    onClick={e => this.remove(e, v)}
                  />
                  <div className="tableNumber">{label}{index + 1}</div>
                </div>
              }
            />
          )}
          )}
        </SortableContainer>
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
