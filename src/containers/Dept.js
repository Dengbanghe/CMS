import React,{ Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,Tree ,Spin } from 'antd'
const TreeNode =Tree.TreeNode
import { fetch ,remoteHost} from '../util/common'
import LTT from 'list-to-tree'
const FormItem = Form.Item;
var list = [
    {
        id: 1,
        parent: 0
    }, {
        id: 2,
        parent: 1
    }, {
        id: 3,
        parent: 1
    }, {
        id: 4,
        parent: 2
    }, {
        id: 5,
        parent: 2
    }, {
        id: 6,
        parent: 0
    }, {
        id: 7,
        parent: 0
    }, {
        id: 8,
        parent: 7
    }, {
        id: 9,
        parent: 8
    }, {
        id: 10,
        parent: 0
    }
];

var ltt = new LTT(list, {
    key_id: 'id',
    key_parent: 'parent'
});
var tree = ltt.GetTree();

console.log( tree );


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
        let data = await fetch(`${remoteHost}/dept/tree`,param)
        let ltt = new LTT([...data],{
            key_id:'guid',
            key_parent:'pid',
            key_child :'children'
        })
        let treeData = ltt.GetTree()
        console.log(JSON.stringify(treeData))
        this.setState({data:[...treeData],loading:false})
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
        const loop = data => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode key={item.deptcode} title={item.deptname} dataRef={item}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.deptcode} title={item.deptname} dataRef={item}/>;
            });
        }
    return(
        <Tree>
            {/*<TreeNode key='20' title='测试部门01'/>*/}

            {loop(data)}
        </Tree>
    )
    }
}

module.exports = connect()(Dept)