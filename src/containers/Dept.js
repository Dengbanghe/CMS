import React,{ Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,Tree } from 'antd'
const TreeNode =Tree.TreeNode
import { fetch ,remoteHost} from '../util/common'
const FormItem = Form.Item;

const columns = [{
    title:'部门编码',
    dataIndex:'deptcode',
    width:'30%'
},{
    title:'部门名称',
    dataIndex:'deptname',
    width:'30%'
},{
    title:'备注',
    dataIndex:'remark',
    width:'40%'
}]
class Dept extends Component{
    state = {
        data:[],
        loading:false,
        modalVisible:false,
        modalTitle:'',
        selectedRows:[],
        formData:{},
        confirmLoading:false
    }

    componentDidMount(){
        this.getData()
    }
    getData = async(param) =>{
        this.setState({loading:true})
        let data = await fetch(`${remoteHost}/dept/page`,param)
        this.setState({data:data,loading:false})
    }

    onRowClick = function(record,index){
        this.setState({selectedRowKeys:record.guid+''})
        this.selectRow([record])
    }

    selectRow = (row)=>{
        this.setState({selectedRows:[...row]})
    }

    render(){
        const {data,selectedRowKeys,loading } = this.state
        const rowSelection ={
            selectedRowKeys,
            type:'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys})
                this.selectRow(selectedRows)
            }
        }
        const loop = data => data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode key={item.guid} title={item.deptname} disableCheckbox={item.key === '0-0-0'}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.guid} title={item.deptname} />;
        });
    return(<div>
        <Tree>
            {loop(data)}
        </Tree>
    </div>)
    }
}

module.exports = connect()(Dept)