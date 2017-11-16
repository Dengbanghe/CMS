import React, { Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input  } from 'antd';
import { getData1 } from '../actions/regicodeMgmt'
import fetch from 'isomorphic-fetch'
const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: '40%',
}, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
    width: '30%',
}, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
}];
const fetchdata = async()=>{
    let res = await fetch('data.json');
    let data = await res.json();
    return data
}

class RegicodeMgmt extends Component{
    state={
        data:[]
    }
    async componentDidMount(){
        let data = await fetchdata();
        this.setState({data:data})
    }
    render(){
        const {data,getData1} = this.props

        return (
            <div>
            <Table columns={columns}  dataSource={this.state.data} />
            </div>
        )
    }
}

const getData = state =>{
    return {data : state.regicodeMgmt.data}
}

module.exports = connect(getData,{getData1})(RegicodeMgmt)