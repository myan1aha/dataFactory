import { Component } from 'react';
import { Input, DatePicker, Divider } from 'antd';
// import InvestCheck from './InvestCheck';

import styles from './index2.less'
// import areas from '@/utils/area';

// import moment from 'moment';
// import { stringify } from 'qs';

const { RangePicker } = DatePicker;

export default class Filter extends Component {
  constructor(props) {
    super(props);
    let activeArea = '';
    let activeAreaCode = '';
    if (props.activeAreaCode) {
      activeArea = areas.find(v => v.code === `${props.activeAreaCode}`);
      // eslint-disable-next-line prefer-destructuring
      activeAreaCode = props.activeAreaCode;
    }
    this.state = {
      activeArea: activeArea,
      activeAreaCode: `${activeAreaCode || '330000'}`,
      rangeDate: [],
    };
  }

  // static getDerivedStateFromProps(nextProps, state) {
  // const { data = {} } = nextProps;
  // if (data !== state.data) {
  //   const { searchKeywords = '' } = data;
  //   return {
  //     data,
  //     searchKeywords,
  //   };
  // }
  // return null;
  // }

  onCodeChange = areaCode => {
    this.props.onChange({
      areaCode,
    });
  };

  clickArea = area => {
    this.setState({
      activeArea: area,
      activeAreaCode: area ? area.code : 330000,
    });
    this.onCodeChange(area ? area.code : 330000);
  };

  clickSubArea = area => {
    this.setState({
      activeAreaCode: area.code,
    });
    this.onCodeChange(area ? area.code : 330000);
  };

  onRangeChange = rangeDate => {
    this.setState({
      rangeDate,
    });
    console.log(rangeDate[0] ? rangeDate[0].format('YYYY-MM-DD') + ' 00:00:00' : '');
    this.props.onChange({
      beginTime: rangeDate[0] ? rangeDate[0].format('YYYY-MM-DD') + ' 00:00:00' : '',
      endTime: rangeDate[1] ? rangeDate[1].format('YYYY-MM-DD') + ' 23:59:59' : '',
    });
  };

  onScaleChange = checkedList => {
    this.props.onChange({
      investmentScale: checkedList.join(','),
    });
  };

  render() {
    const { scaleList, activeAreaCode: propCode, selectDetail } = this.props;
    const { activeArea, activeAreaCode } = this.state;
    const { companyNumber, reportCount, investedTotal, investmentTotal } =
      selectDetail.reportDetail || {};
    return (
      <div>
        <div>
          <div className={`${styles.filterBold}`}>组合筛选</div>
          <div style={{ float: 'right' }}>
            <span className={styles.statisticTitle}>{!propCode ? '已上报' : '已上报/需上报'}</span>
            <span className={styles.staValue}>{companyNumber}</span>
            <span className={styles.staAddonV}>{!propCode ? '' : `/${reportCount || 0}`}</span>
            <span className={styles.statisticTitle}>累计总投资额</span>
            <span className={styles.staValue}>{investmentTotal}</span>
            <span className={styles.staAddon}>亿元</span>
            <span className={styles.statisticTitle}>已完成投资额</span>
            <span className={styles.staValue}>{investedTotal}</span>
            <span className={styles.staAddon}>亿元</span>
          </div>
        </div>
        <div>
          {!propCode || /^\d+00$/.test(propCode + '') ? (
            <div className={styles.filter}>
              <div className={`${styles.filterBold} ${styles.minHeight}`}>所属城市</div>
              {!propCode || propCode === '310000' ? (
                <div style={{ width: '100%' }}>
                  <span
                    className={`${styles.area} ${
                      parseInt(activeAreaCode / 100) === 3300 ? 'active' : ''
                    }`}
                    onClick={e => this.clickArea()}
                  >
                    全部
                  </span>
                  {areas.map((v, idx) => (
                    <span
                      className={`${styles.area} ${
                        parseInt(activeAreaCode / 100) === parseInt(v.code / 100) ? 'active' : ''
                      }`}
                      onClick={e => this.clickArea(v)}
                      key={idx}
                    >
                      {v.name}
                    </span>
                  ))}
                  <Divider style={{ margin: '12px 0 8px 0' }} />
                  <div>
                    {activeArea ? (
                      <div>
                        <span
                          className={`${styles.subArea} ${
                            activeAreaCode === activeArea.code ? 'active' : ''
                          }`}
                          onClick={e => this.clickSubArea(activeArea)}
                        >
                          {activeArea.name}
                        </span>
                        {activeArea.children.map((v, idx) => (
                          <span
                            className={`${styles.subArea} ${
                              activeAreaCode === v.code ? 'active' : ''
                            }`}
                            onClick={e => this.clickSubArea(v)}
                            key={idx}
                          >
                            {v.name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div>
                  {activeArea ? (
                    <div>
                      <span
                        className={`${styles.area} ${
                          activeAreaCode === activeArea.code ? 'active' : ''
                        }`}
                        onClick={e => this.clickSubArea(activeArea)}
                      >
                        {activeArea.name}
                      </span>
                      {activeArea.children.map((v, idx) => (
                        <span
                          className={`${styles.area} ${activeAreaCode === v.code ? 'active' : ''}`}
                          onClick={e => this.clickSubArea(v)}
                          key={idx}
                        >
                          {v.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ) : null}
          <div className={styles.filter}>
            <div className={styles.filterBold}>填报时间</div>
            <RangePicker value={this.state.rangeDate} onChange={this.onRangeChange} />
          </div>
          <div className={styles.filter}>
            <div className={styles.filterBold}>投资规模</div>
            {/* <div>
              <InvestCheck list={scaleList} onChange={this.onScaleChange} />
            </div> */}
          </div>
        </div>
        <div className={styles.filterBold} style={{ marginTop: 18 }}>
          筛选结果{' '}
          {propCode && !/^\d+00$/.test(propCode + '') ? (
            <span className={styles.filterSub}>(注：执行人员只能看到由自己上报的内容)</span>
          ) : null}
        </div>
      </div>
    );
  }
}
