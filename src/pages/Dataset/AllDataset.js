import React from 'react';
import DisplayTable from './MyTable';

import { connect } from 'dva';

// eslint-disable-next-line react/prefer-stateless-function
// @connect(({ dataset, loading }) => ({
//     // list: task.list,
//     dataset,
//     loadingData: loading.models.dataset,
//   }))
// eslint-disable-next-line react/prefer-stateless-function
class Set extends React.Component {
    render() {
        const typeName = this.props.location.pathname.split('/')[2];
        return (
            <div>
                <DisplayTable typeName={typeName}/>
            </div>
        )
    }
}
export default Set;
