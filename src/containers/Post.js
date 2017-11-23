import React from 'react'
import {connect} from 'react-redux'
import {Button, Form, Input, Tree, Spin, Row, Col, Checkbox,Transfer} from 'antd'
import {fetch, transfer2tree, remoteHost} from '../util/common'
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode
const ButtonGroup = Button.Group
class PostForm extends React.Component {
    render() {
        const {getFieldDecorator} = this.props.form
        const {enableSwitch, disabled, checkBoxOnChange, checkBoxState} = this.props
        return (
            <Form>
                {getFieldDecorator('guid')(
                    <Input type="hidden"/>
                )}
                {getFieldDecorator('fDeptid')(
                    <Input type="hidden"/>
                )}
                <FormItem label="岗位名称">
                    {getFieldDecorator('postname', {
                        rules: [{required: true, message: '请输入岗位名称'}]
                    })(
                        <Input disabled={disabled}/>
                    )}
                </FormItem>
                <FormItem label="启用状态">
                    {getFieldDecorator('enable')(
                        <Checkbox
                            checkedChildren="启用"
                            unCheckedChildren="禁用"
                            checked={checkBoxState}
                            onChange={checkBoxOnChange}
                            disabled={disabled}
                        >{enableSwitch == true ? '启用' : '禁用'}</Checkbox>
                    )}
                </FormItem>
                <FormItem label="备注">
                    {getFieldDecorator('remark', {})(
                        <Input type="textarea" disabled={disabled}/>
                    )}
                </FormItem>
            </Form>
        )
    }
}

const WrappedPostForm = Form.create()(PostForm);
const mockData=[
    {guid: 1, rolename: '角色01',  remark: 'beizhu01', enable: 1},
    {guid: 2, rolename: '角色02',  remark: 'beizhu02', enable: 1},
    {guid: 3, rolename: '角色03',  remark: 'beizhu03', enable: 1},
    {guid: 4, rolename: '角色04',  remark: 'beizhu04', enable: 1}
]
class Post extends React.Component {
    state = {
        data: [],
        selectedNode: {},
        mainBtn: {text: '新增', disabled: true, display: true},
        submitBtn: {text: '提交', display: false},
        cancelBtn: {text: '取消', display: false},
        transferBtn: {text: '关联角色', disabled: true},
        checkBoxState: false,
        isEdit: false,
        enableSwitch: false,
        loading: false,
        transferLoading:false,
        disabled: true,
        buttonText: '新增',

        roleTransfer:{targetKeys:[],selectedKeys:[],activated:false}

    }

    componentDidMount() {
        this.getData()
    }

    getData = async (param) => {
        const data = await fetch(`${remoteHost}/post/tree`, param)
        let treeData = transfer2tree(data, {rootId: 'dept_0'})
        this.setState({data: [...treeData]})
    }
    getForm = form => {
        this.form = form
    }


    saveUpdate = () => {
        const form = this.form
        form.validateFields(async (err, values) => {
            values = {...values, enable: values.enable == true ? '1' : '0'}
            console.log(values)
            let result = await fetch(`${remoteHost}/post/saveUpdate`, values)
            if (result.success) {
                if (this.state.selectedNode._id.includes('post')) {
                    this.selectedPost()
                    this.getData()
                } else {
                    this.selectedDept()
                }
            }

        })
    }


    selectedNode = () => {
        const form = this.form
        form.resetFields();
        this.setState({
            mainBtn: {...this.state.mainBtn, disabled: true, display: true, text: '新增'},
            submitBtn: {...this.state.submitBtn, display: false},
            cancelBtn: {...this.state.cancelBtn, display: false},
            transferBtn: {...this.state.transferBtn, disabled: true},
            disabled: true,
            checkBoxState: false
        })
    }
    selectedPost = nodeData => {
        if (nodeData) {
            this.form.setFieldsValue({...nodeData})
            this.setState({checkBoxState: nodeData.enable == 1})
        }
        this.setState({
            mainBtn: {...this.state.mainBtn, disabled: false, display: true, text: '修改'},
            transferBtn: {...this.state.transferBtn, disabled: false},
            submitBtn: {...this.state.submitBtn, display: false},
            cancelBtn: {...this.state.cancelBtn, display: false},
            disabled: true
        })
    }
    selectedDept = nodeData => {
        if (nodeData) {
            this.form.resetFields()
            this.form.setFieldsValue({fDeptid: nodeData.guid,})
            this.setState({checkBoxState: false})
        }
        this.setState({
            mainBtn: {...this.state.mainBtn, disabled: false, display: true, text: '新增'},
            transferBtn: {...this.state.transferBtn, disabled: true},
            submitBtn: {...this.state.submitBtn, display: false},
            cancelBtn: {...this.state.cancelBtn, display: false},
            disabled: true
        })
    }


    onSelect = (selectedKeys, {selected, selectedNodes, node, event}) => {
        const form = this.form
        if (selectedKeys.length == 0) {
            this.selectedNode()
            return
        }
        let nodeData = {}
        if (selectedNodes[0]) {
            nodeData = selectedNodes[0].props.dataRef
        }
        this.setState({selectedNode: nodeData})

        form.resetFields();

        if (selectedKeys[0].includes('dept') && (nodeData.children.length == 0 || nodeData.children[0]._id.includes('post'))) {
            this.selectedDept(nodeData)
        } else if (selectedKeys[0].includes('post')) {
            this.selectedPost(nodeData)
        } else {
            this.selectedNode()
        }
    }

    addOrEdit = () => {
        this.setState({
            mainBtn: {...this.state.mainBtn, display: false},
            submitBtn: {...this.state.submitBtn, display: true},
            cancelBtn: {...this.state.cancelBtn, display: true},
            transferBtn: {...this.state.transferBtn, disabled: true},
            disabled: false,
        })
    }


    cancel = () => {
        const nodeData = this.state.selectedNode;
        if (nodeData._id.includes('post')) {
            this.selectedPost(nodeData)
        } else {
            this.selectedDept(nodeData)
        }
    }
    checkBoxOnChange = e => {
        this.setState({
            checkBoxState: e.target.checked
        });
    }

    transferChange = (nextTargetKeys,direction,moveKeys)=>{
        let roleTransfer = this.state.roleTransfer
        this.setState({roleTransfer:{...roleTransfer,targetKeys:nextTargetKeys }})
    }
    transferSelectedChange = (sSelectedKeys,tSelectedKeys)=>{
        let roleTransfer = this.state.roleTransfer
        this.setState({roleTransfer:{...roleTransfer,selectedKeys:[...sSelectedKeys],targetKeys:[...tSelectedKeys]}})
    }
    render() {
        const {data, enableSwitch, disabled, mainBtn, submitBtn, cancelBtn, transferBtn, checkBoxState,
            roleTransfer
        } = this.state
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
                <Row>
                    <Col span={8}>
                        {data.length > 0 ? <Tree
                            showLine={true}
                            defaultExpandAll={true}
                            autoExpandParent={true}
                            onSelect={this.onSelect}
                        >
                            {loop(data)}
                        </Tree> : <Spin spinning={true}></Spin>
                        }
                    </Col>
                    <Col span={16} style={roleTransfer.activated==true?{display:'none'}:{}}>
                        <ButtonGroup>
                            <Button
                                type='primary'
                                loading={false}
                                onClick={this.addOrEdit}
                                disabled={mainBtn.disabled}
                                style={mainBtn.display == true ? {} : {display: 'none'}}
                            >{mainBtn.text}</Button>
                            <Button style={submitBtn.display == true ? {} : {display: 'none'}}
                                    onClick={this.saveUpdate}>{submitBtn.text}</Button>
                            <Button style={cancelBtn.display == true ? {} : {display: 'none'}}
                                    onClick={this.cancel}>{cancelBtn.text}</Button>

                            <Button disabled={transferBtn.disabled}
                                onClick={()=>{this.setState({roleTransfer:{...roleTransfer,activated:true}})}}
                            >{transferBtn.text}</Button>
                        </ButtonGroup>
                        <WrappedPostForm
                            ref={this.getForm}
                            enableSwitch={enableSwitch}
                            disabled={disabled}
                            checkBoxOnChange={this.checkBoxOnChange}
                            checkBoxState={checkBoxState}
                        />
                    </Col>
                    <Col span={16} style={roleTransfer.activated==false?{display:'none'}:{}}>

                            <Button
                            onClick={()=>{this.setState({roleTransfer:{...roleTransfer,activated:false}})}}>岗位维护</Button>
                        <Transfer
                             dataSource={mockData.map((item)=>{return{...item,key:item.guid.toString(),}})}
                            titles={['未关联', '已关联角色']}
                            targetKeys={roleTransfer.targetKeys}
                            selectedKeys={roleTransfer.selectedKeys}
                            onChange={this.transferChange}
                            onSelectChange={this.transferSelectedChange}
                            // onScroll={this.handleScroll}
                            render={item => item.rolename}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

module.exports = connect()(Post)