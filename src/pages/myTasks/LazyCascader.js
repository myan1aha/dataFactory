import React from 'react';
import { Cascader } from 'antd';

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
export default class LazyOptions extends React.Component {
  state = {
    options,
  };

  onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions);
  };

  loadData = selectedOptions => {
    console.log('loadData');
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;

    // load options lazily
    setTimeout(() => {
      targetOption.loading = false;
      targetOption.children = [
        {
          label: `${targetOption.label} Dynamic 1`,
          value: 'dynamic1',
        },
        {
          label: `${targetOption.label} Dynamic 2`,
          value: 'dynamic2',
        },
      ];

      this.setState({
        // eslint-disable-next-line react/no-access-state-in-setstate
      options: [...this.state.options],
    });
    }, 1000);
};

  render() {
    return (
      <Cascader
        options={this.state.options}
        loadData={this.loadData}
        onChange={this.onChange}
        changeOnSelect
        value={this.props.value}
      />
    );
  }
}
