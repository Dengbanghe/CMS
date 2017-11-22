import React from 'react'
import {connect} from 'react-redux'
import {Button, Form, Input, Tree, Spin, Row, Col,Checkbox} from 'antd'
import {fetch, transfer2tree,remoteHost} from '../util/common'
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode
class PostForm extends React.Component{
    render() {
        const {getFieldDecorator} = this.props.form
        const {enableSwitch,setEnableSwitch,disabled,checkBoxOnChange,checkBoxState} = this.props
        return (
            <Form>
                <FormItem label="岗位名称">
                    {getFieldDecorator('postname', {
                        rules:[{required:true,message:'请输入岗位名称'}]
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
                        >{enableSwitch==true?'启用':'禁用'}</Checkbox>
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

class Post extends React.Component {
    state = {
        data:[],
        mainBtn:{text:'新增',disabled:true,display:true},
        submitBtn:{text:'提交',display:false},
        cancelBtn:{text:'取消',display:false},
        transferBtn:{text:'关联角色',disabled:true},
        checkBoxState:false,
        isEdit:false,
        enableSwitch:false,
        loading:false,
        disabled:true,
        buttonText:'新增',

    }
    componentDidMount(){
        this.getData()
    }
    getData=async(param)=>{
        const data = await fetch(`${remoteHost}/post/tree`,param)
        let treeData = transfer2tree(data,{rootId:'dept_0'})
        this.setState({data:[...treeData]})
    }
    getForm=form=>{
        this.form=form
    }


    saveUpdate=()=>{
        const form = this.form
        form.validateFields(async(err,values)=>{
            console.log(values)
            values={...values,enable:values.enable==true?'1':'0'}
        })
    }
    commit=()=>{
        console.log(123)
    }
    onSelect=(selectedKeys, {selected, selectedNodes, node, event})=>{
        const form = this.form
        if(selectedKeys.length==0){
            form.resetFields();
            this.setState({mainBtn:{...this.state.mainBtn,disabled:true,display:true,text:'新增'},
                submitBtn:{...this.state.submitBtn,display:false},
                cancelBtn:{...this.state.cancelBtn,display:false},
                transferBtn:{...this.state.transferBtn,disabled:true},
                disabled:true,
                checkBoxState:false
            })
            return
        }
        let nodeData = {}
        if (selectedNodes[0]) {
            nodeData = selectedNodes[0].props.dataRef
        }
        form.resetFields();
        if(selectedKeys[0].includes('dept')){
            this.setState({mainBtn:{...this.state.mainBtn,disabled:false,display:true,text:'新增'},

            })
            form.setFieldsValue({fDeptid:nodeData.guid})
        }else{
            this.form.setFieldsValue({...nodeData})
            this.setState({
                mainBtn:{...this.state.mainBtn,disabled:false,display:true,text:'修改'},
            })
        }
        this.setState({
            checkBoxState:nodeData.enable==1,
            submitBtn:{...this.state.submitBtn,display:false},
            cancelBtn:{...this.state.cancelBtn,display:false},
            transferBtn:{...this.state.transferBtn,disabled:false},
            disabled:true
        })
        // this.setState({isEditing: false, isAdding: false, formData: nodeData})
    }
    // setEnableSwitch=checked=>{
    //     this.setState({enableSwitch:checked})
    // }
    addOrEdit=()=>{
        this.setState({mainBtn:{...this.state.mainBtn,display:false},
            submitBtn:{...this.state.submitBtn,display:true},
            cancelBtn:{...this.state.cancelBtn,display:true},
            transferBtn:{...this.state.transferBtn,disabled:true},
            disabled:false,
        })
    }


    cancel=()=>{

    }
    checkBoxOnChange= (e) => {
        this.setState({
            checkBoxState: e.target.checked,
        });
    }
    render() {
        const {data,enableSwitch,disabled,mainBtn,submitBtn,cancelBtn,transferBtn,isEdit,checkBoxState} = this.state
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
                    </Col>
                    <Col span={16}>
                        <Button
                            type=''
                            loading={false}
                            onClick={this.addOrEdit}
                            disabled={mainBtn.disabled}
                            style={mainBtn.display==true?{}:{display:'none'}}
                        >{mainBtn.text}</Button>
                        <Button style={submitBtn.display==true?{}:{display:'none'}} onClick={this.saveUpdate}>{submitBtn.text}</Button>
                        <Button style={cancelBtn.display==true?{}:{display:'none'}} onClick={this.cancel}>{cancelBtn.text}</Button>

                        <Button disabled={transferBtn.disabled}>{transferBtn.text}</Button>
                        <WrappedPostForm
                            ref={this.getForm}
                            enableSwitch={enableSwitch}
                            setEnableSwitch={this.setEnableSwitch}
                            disabled={disabled}
                            checkBoxOnChange={this.checkBoxOnChange}
                            checkBoxState={checkBoxState}
                        />
                    </Col>
                </Row>
            </div>
        )
    }
}

module.exports = connect()(Post)