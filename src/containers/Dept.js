import React,{ Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Button,  Form, Input,Tree ,Spin ,Row,Col} from 'antd'
const TreeNode =Tree.TreeNode
import { fetch ,remoteHost} from '../util/common'
import LTT from 'list-to-tree'
const FormItem = Form.Item;

class DeptForm extends  Component{
    render(){
        const {getFieldDecorator} = this.props.form,
            {isAdding,isEditing,editing} = this.props
        return(
            <Form>
                {getFieldDecorator('guid')(
                    <Input type="hidden" />
                )}
                {getFieldDecorator('pid',{initialValue:0})(
                    <Input type="hidden" />
                )}
                <FormItem label="部门编码">
                    {getFieldDecorator('deptcode', {
                        rules: [{ required: true}],
                    })(
                        <Input disabled={editing}/>
                    )}
                </FormItem>
                <FormItem label="部门名称">
                    {getFieldDecorator('deptname', {
                        rules: [{ required: true}],
                    })(
                        <Input disabled={editing}/>
                    )}
                </FormItem>

                <FormItem label="排序">
                    {getFieldDecorator('sort')(
                        <Input  disabled={editing}/>
                    )}
                </FormItem>

                <FormItem label="备注">
                    {getFieldDecorator('remark')(
                        <Input type="textarea" disabled={editing}/>
                    )}
                </FormItem>
            </Form>
        )
    }
}

const WrappedDeptForm = Form.create()(DeptForm);
class Dept extends Component{
    state = {
        data:[],//树数据
        loading:false,//加载数据
        formData:{},//表单数据
        confirmLoading:false,//提交按钮加载状态
        isAdding:false,//新增状态
        isEditing:false,//编辑状态
    }

    componentDidMount(){
        this.getData()
    }
    getData = async(param) =>{
        this.setState({loading:true})
        let data = await fetch(`${remoteHost}/dept/tree`,param)
        data.push({})
        let treeData = new LTT([...data],{
            key_id:'guid',
            key_parent:'pid',
            key_child :'children'
        }).GetTree()
        this.setState({data:[...treeData],loading:false})
    }
    onSelect = (selectedKeys,{selected,selectedNodes,node,event}) => {
        let nodeData ={}
        if(selectedNodes[0]){
            nodeData = selectedNodes[0].props.dataRef
        }
        this.form.resetFields();
        this.form.setFieldsValue(nodeData)
        this.setState({isEditing:false,isAdding:false,formData:nodeData})

    }
    onRightClick = ({event, node} )=>{
        let data = this.state.data.find((el)=>el.guid== 1)
    }
    getForm = (form)=>{
        this.form = form
    }
    addDept = () => {
        let formData= this.state.formData
        this.form.resetFields();
        if(formData.guid){
            this.form.setFieldsValue({pid:formData.guid});
        }
        this.setState({isAdding:true})
    }
    editDept = () =>{
        this.setState({isEditing:true})
    }
    saveUpdate = () => {
        const form = this.form;
        form.validateFields(async(err, values) => {
            if (err) {
                return;
            }
            this.setState({ confirmLoading:true});
            fetch(`${remoteHost}/dept/saveUpdate`,values)
            this.getData()
            if(this.state.isAdding){
                form.setFieldsValue(this.state.formData)
            }
            this.setState({ modalVisible: false ,confirmLoading:false,});
        });
    }
    cancel = () => {
        this.setState({isEditing:false,isAdding:false})
        this.form.setFieldsValue(this.state.formData)
    }

    // onDragEnd = ({event, node}) =>{
    //     console.log('over')
    //     console.log(event)
    //     console.log(node)
    // }
    onDrop = ({event, node, dragNode, dragNodesKeys,dropToGap}) => {
        let targetData = node.props.dataRef
        let nodeData = dragNode.props.dataRef
        let result=null
        if(dropToGap){
            result = {...nodeData,pid:targetData.pid}
        }else{
            result = {...nodeData,pid:targetData.guid}
        }
        if(result){
            fetch(`${remoteHost}/dept/saveUpdate`,result)
            this.getData()
        }



    }
    render(){
        const {data,isAdding,isEditing} = this.state,
            editing=!(isAdding||isEditing)
        const loop = data => {
            return data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode key={item.guid+''} title={item.deptname} dataRef={item}>
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode key={item.guid+''} title={item.deptname} dataRef={item}/>;
            });
        }
    return(
        <div>
            <Row>
                <Col span={8}>
                    {data.length>0 ? <Tree
                        draggable={true}
                        onDragEnd={this.onDragEnd}
                        showLine={true}
                        defaultExpandAll={true}
                        autoExpandParent={true}
                        onSelect={this.onSelect}
                        onRightClick={this.onRightClick}
                        onDrop={this.onDrop}
                    >
                        {loop(data)}
                    </Tree> : <Spin spinning={true}></Spin>
                    }

                </Col>
                <Col span={16}>
                    <div style={{ marginBottom: 16 }}>
                        <Button  onClick={editing==true?this.addDept:this.saveUpdate}>{editing==true?'新增':'保存'}</Button>
                        <Button  style={{marginLeft:10}} onClick={editing==true?this.editDept:this.cancel}>{editing==true?'修改':'取消'}</Button>
                    </div>
                    <WrappedDeptForm
                        ref={this.getForm}
                        editing={!(isAdding || isEditing)}
                    />
                </Col>
            </Row>
        </div>
    )
    }
}

module.exports = connect()(Dept)