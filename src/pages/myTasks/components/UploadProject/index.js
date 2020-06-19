import { Modal, Spin, Button, message } from 'antd';
import { PureComponent } from 'react';
import request from '@/utils/request';
import { stringify } from 'qs';
import styles from './index.less';
import Graph from './graph';

async function getAddress(params) {
  const result = await request(`/node/projectjson${params ? `?${stringify(params)}` : ''}`);
  return result;
}

class DrawerForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      content: [],
      aloading: false,
      error: false,
    };
  }
  componentDidMount() {
    //request id
    this.getData(this.props.modalId);
  }
  getData = async id => {
    this.setState({
      aloading: true,
    });
    const res = await getAddress({ projectName: id });
    if (res) {
      this.setState({
        content: res,
        active: res[0] ? res[0] : {},
      });
      this.Graph = new Graph(document.getElementById('container'));
      res[0] && this.Graph.render(res[0]);
    }else{
      this.setState({
        error: true,
      })
    }
    this.setState({
      aloading: false,
    });
  };
  onClickItem = active => {
    this.setState({
      active,
    });
    this.Graph.render(active);
  };
  onUpload = ()=>{
    // if(this.state.error){
      // message.error('项目无效')
    // }else{
      this.props.onUpload(this.props.modalId)
    // }
  }
  render() {
    const { content, active, aloading } = this.state;
    const { loading = false } = this.props;
    return (
      <Spin spinning={aloading||!!loading}>
        <div className={styles.modalBody}>
          <div className={styles.flexBody}>
            <div className={styles.graphList}>
              <div className={styles.listWrapper}>
                {content.map((v,index) => (
                  <div
                    key={index}
                    onClick={e => this.onClickItem(v)}
                    className={`${active === v ? 'active' : ''} ${styles.graphItem}`}
                  >
                    {v.flow}
                  </div>
                ))}
              </div>
              <Button type="primary" onClick={this.onUpload}>
                上传项目
              </Button>
            </div>
            <div className={styles.graphContent}>
              <div className={styles.graphDes}>流程图预览</div>
              <div className={styles.graphWrapper} style={{ width: '100%', height: '100%' }}>
                <svg
                  id="container"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  shapeRendering="optimize-speed"
                  textRendering="optimize-speed"
                ></svg>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    );
  }
}
export default DrawerForm;
