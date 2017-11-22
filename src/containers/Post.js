import React from 'react'
import {connect} from 'react-redux'
import {Button, Form, Input, Tree, Spin, Row, Col} from 'antd'
import {fetch, transfer2tree,remoteHost,treeLooper} from '../util/common'
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode

class Post extends React.Component {
    state = {
        data:[],
        isPost:false,
        isDept:false
    }
    componentDidMount(){
        this.getData()
    }
    getData=async(param)=>{
        const data = await fetch(`${remoteHost}/post/tree`,param)
        let treeData = transfer2tree(data)
        this.setState({data:[...treeData]})
    }

    onSelect=(selectedKeys, {selected, selectedNodes, node, event})=>{
        let nodeData = {}
        if (selectedNodes[0]) {
            nodeData = selectedNodes[0].props.dataRef
        }
        // if(){
        //
        // }
        this.form.resetFields();
        this.form.setFieldsValue(nodeData)
        this.setState({isEditing: false, isAdding: false, formData: nodeData})
    }

    render() {
        const {data} = this.state
        const loop = data => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode key={item._id} title={item._title} dataRef={item}>
                            {loop(item.children)}
                        </TreeNode>
                    )
                }
                return <TreeNode key={item._id} title={item._title} dataRef={item}/>
            });
        }
        return (
            <div>
                {data.length > 0 ? <Tree
                    // onDragEnd={this.onDragEnd}
                    showLine={true}
                    defaultExpandAll={true}
                    autoExpandParent={true}
                    onSelect={this.onSelect}
                    // onRightClick={this.onRightClick}
                    // onDrop={this.onDrop}
                >
                    {loop(data)}
                </Tree> : <Spin spinning={true}></Spin>
                }
            </div>
        )


    }
}


module.exports = connect()(Post)