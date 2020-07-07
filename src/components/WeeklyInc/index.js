import { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';

import echarts from 'echarts/lib/echarts'; // 必须
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/legendScroll';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/pictorialBar';

export default class Line extends Component {
  constructor(props) {
    super(props);
    this.initChart = this.initChart.bind(this);
    this.options = null;
    this.chart = null;
  }

  componentDidMount() {
    this.initChart();
    window.addEventListener('resize', this.resize, { passive: true });
  }

  componentDidUpdate() {
    this.initChart();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
    echarts.dispose(this.ID);
    this.chart = null;
  }

  initChart() {
    const { weekly = {} } = this.props; //外部传入的data数据
    const option = {
        // 标题
        title: {
          text: '数据详情',
        },
        // //工具箱
        // //保存图片
        // toolbox:{
        //     show:true,
        //     feature:{
        //         saveAsImage:{
        //             show:true
        //         }
        //     }
        // },
        // 图例-每一条数据的名字叫销量
        legend: {
            data: ['增量'],
        },
        // x轴
        xAxis: {
            // data:["苹果","橘子","橙子","香蕉","菠萝","榴莲"]
            data: weekly.date,
        },
        //y轴没有显式设置，根据值自动生成y轴
        yAxis: {},
        //数据-data是最终要显示的数据
        series: [{
            name: '增量',
            type: 'line',
            // data: [40, 20, 35, 60, 55, 10]
            data: weekly.increment,
        }],
    };
    //数据的处理
    if (this.props.formatData) {
      this.options = this.props.formatData(option, this.props.data)
    } else {
      this.options = option;
    }

    const myChart = echarts.getInstanceByDom(this.ID)
      ? echarts.getInstanceByDom(this.ID)
      : echarts.init(this.ID);
    myChart.setOption(this.options, true);
    this.chart = myChart;
    
    this.props.onMouseover&&this.chart.on('mouseover',this.props.onMouseover);
    this.props.onMouseout&&this.chart.on('mouseout',this.props.onMouseout);
  }

  @Bind()
  @Debounce(400)
  resize() {
    this.chart && this.chart.resize();
  }

  render() {
    const { width = '100%', height = '300px' } = this.props;
    return <div ref={ID => (this.ID = ID)} style={{ width, height }} />;
  }
}