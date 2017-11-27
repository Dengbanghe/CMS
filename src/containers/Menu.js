import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Button, Form, Input, Tree, Spin, Row, Col,Checkbox} from 'antd'
import {fetch, transfer2tree,remoteHost,treeLooper} from '../util/common'
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode
class MenuForm extends Component {
    render() {
        const {getFieldDecorator} = this.props.form,
            {editing,checkBoxState,checkBoxOnChange} = this.props
        return (
            <Form>
                {getFieldDecorator('guid')(
                    <Input type="hidden"/>
                )}
                {getFieldDecorator('pGuid', {initialValue: 0})(
                    <Input type="hidden"/>
                )}
                <FormItem label="菜单名称">
                    {getFieldDecorator('menuname', {
                        rules: [{required: true,message:'编码不能为空'}],
                    })(
                        <Input disabled={editing}/>
                    )}
                </FormItem>
                <FormItem label="URL">
                    {getFieldDecorator('menuurl')(
                        <Input disabled={true}/>
                    )}
                </FormItem>
                <FormItem label="启用状态">
                    {getFieldDecorator('enable')(
                        <Checkbox
                            checkedChildren="启用"
                            unCheckedChildren="禁用"
                            checked={checkBoxState}
                            onChange={checkBoxOnChange}
                            disabled={editing}
                        >{checkBoxState == true ? '启用' : '禁用'}</Checkbox>
                    )}
                </FormItem>
                <FormItem label="排序">
                    {getFieldDecorator('sort')(
                        <Input disabled={editing}/>
                    )}
                </FormItem>
            </Form>
        )
    }
}

const WrappedMenuForm = Form.create()(MenuForm);

class Menu extends Component {
    state = {
        data: [],//树数据
        loading: false,//加载数据
        formData: {},//表单数据
        confirmLoading: false,//提交按钮加载状态
        isAdding: false,//新增状态
        isEditing: false,//编辑状态
        drap:false,//是否进行拖拽
        checkBoxState:false,
        formDisabled:true
    }

    componentDidMount() {
        this.getData()
    }

    getData = async (param) => {
        this.setState({loading: true})
        let data = await fetch(`${remoteHost}/menu/tree`, param)
        let treeData = transfer2tree(data,{rootId:'menu_0'})
        this.setState({data: [...treeData], loading: false})
    }
    onSelect = (selectedKeys, {selected, selectedNodes, node, event}) => {
        let nodeData = {}
        if (selectedNodes[0]) {
            nodeData = selectedNodes[0].props.dataRef
        }
        this.form.resetFields();
        this.form.setFieldsValue(nodeData)
        this.setState({isEditing: false, isAdding: false,checkBoxState: nodeData.enable==1, formData:{...nodeData,enable:nodeData.enable==1}})

    }

    getForm = (form) => {
        this.form = form
    }
    addDept = () => {
        let formData = this.state.formData
        this.form.resetFields();
        if (formData.guid) {
            this.form.setFieldsValue({pid: formData.guid});
        }
        this.setState({isAdding: true})
    }
    editDept = () => {
        this.setState({isEditing: true})
    }
    saveUpdate = () => {
        const form = this.form;
        form.validateFields(async (err, values) => {
            if (err) {
                return;
            }
            this.setState({confirmLoading: true});
            fetch(`${remoteHost}/menu/saveUpdate`, {...values,enable:values.enable==true?1:0})
            this.getData()
            if (this.state.isAdding) {
                form.setFieldsValue(this.state.formData)
            }
            this.setState({isEditing: false, isAdding: false, confirmLoading: false});
        });
    }
    cancel = () => {
        let checked =this.state.formData.enable
        this.setState({isEditing: false, isAdding: false,confirmLoading: false,checkBoxState:checked})
        this.form.setFieldsValue(this.state.formData)
    }

    onDrop = ({event, node, dragNode, dragNodesKeys, dropToGap}) => {
        let targetData = node.props.dataRef
        let nodeData = dragNode.props.dataRef
        let result = null
        if (dropToGap) {
            result = {...nodeData, pid: targetData.pid}
        } else {
            result = {...nodeData, pid: targetData.guid}
        }
        if (result) {
            fetch(`${remoteHost}/menu/saveUpdate`, result)
            this.getData()
        }


    }
    checkBoxOnChange=e=>{
        this.setState({checkBoxState:e.target.checked})
    }

    render() {
        const {data, isAdding, isEditing,drap,confirmLoading,checkBoxState,formDisabled} = this.state,
            editing = !(isAdding || isEditing)
        const loop = data => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode key={item._id} title={item._title} dataRef={item}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item._id} title={item._title} dataRef={item}/>;
            });
        }
        return (
            <div>
                <Row>
                    <Col span={8}>
                        {/*<Button onClick={()=>{this.setState({drap:!drap})}}/>*/}
                        {data.length > 0 ? <Tree
                            draggable={drap}
                            onDragEnd={this.onDragEnd}
                            showLine={true}
                            defaultExpandAll={true}
                            autoExpandParent={true}
                            onSelect={this.onSelect}
                            onDrop={this.onDrop}
                        >
                            {treeLooper(data)}
                        </Tree> : <Spin spinning={true}></Spin>
                        }

                    </Col>
                    <Col span={16}>
                        <div style={{marginBottom: 16}}>
                            <Button
                                type="primary"
                                loading={confirmLoading}
                                onClick={editing == true ? this.addDept : this.saveUpdate}
                            >
                                {editing == true ? '新增' : '保存'}
                            </Button>
                            <Button
                                type="primary" style={{marginLeft: 10}}
                                onClick={editing == true ? this.editDept : this.cancel}
                            >
                                {editing == true ? '修改' : '取消'}
                            </Button>
                        </div>
                        <WrappedMenuForm
                            ref={this.getForm}
                            editing={!(isAdding || isEditing)}
                            checkBoxState={checkBoxState}
                            checkBoxOnChange={this.checkBoxOnChange}
                            disabled={formDisabled}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

module.exports = connect()(Menu)