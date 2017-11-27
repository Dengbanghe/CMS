import React from 'react'
import { connect } from 'react-redux'
import { fetch ,remoteHost,transfer2tree} from '../util/common'
import {Button,Icon,Input ,Form,Table} from 'antd'
const FormItem =Form.Item
const columns = [{
    title: '行政区划名称',
    dataIndex: 'reginame',
    key: 'reginame',
    width: '60%',
}, {
    title: '行政区划编码',
    dataIndex: 'regicode',
    key: 'regicode',
}];

const data = [
    {
        key: 1,
        reginame: '河北省',
        regicode: 130000,
        children: [{
            key: 11,
            reginame: '长安区',
            regicode: 130002
        }, {
            key: 12,
            reginame: '桥西区',
            regicode: 130004,
        }]
    }, {
        key: 2,
        reginame: '天津市',
        regicode: 120000,
        children:[{
            key: 21,
            reginame: '和平区',
            regicode: 120001
        },{
            key: 22,
            reginame: '河东区',
            regicode: 120002
        }]
    }
];

class RegicodeMgmt extends React.Component{

    render(){
        const rowSelection = {
            onChange: (selectedRowKeys, selectedRows) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            },
            onSelect: (record, selected, selectedRows) => {
                console.log(record, selected, selectedRows);
            },
            onSelectAll: (selected, selectedRows, changeRows) => {
                console.log(selected, selectedRows, changeRows);
            },
        };
        return (<div><Table columns={columns} rowSelection={rowSelection} dataSource={data}/></div>)
}
}
// rowSelection objects indicates the need for row selection


module.exports = connect()(RegicodeMgmt)