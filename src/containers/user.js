import React,{ Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,DatePicker,Col,Row,Radio ,TreeSelect} from 'antd'
import { fetch ,remoteHost} from '../util/common'
import moment from 'moment'
const FormItem = Form.Item;

const columns = [{
    title: '帐号',
    dataIndex: 'account',
    width: 100,
    fixed: 'left',
    sorter: true,
}, {
    title: '用户名',
    dataIndex: 'nickname',
    width: 150,
    sorter: true
}, {
    title: '状态',
    dataIndex: 'status',
    render:(text, record, index) => {
       switch (text){
           case '0' :
           return '停用'
           break
           case '1':
           return '锁定'
           break
           default :
           return '正常'
       }
    },
    width: 75
}, {
    title: '部门',
    dataIndex: 'deptName',
    width: 150
}, {
    title: '岗位',
    dataIndex: 'postName',
    width: 150
}, {
    title: '创建时间',
    dataIndex: 'addtime',
    width: 150
}, {
    title: '备注',
    dataIndex: 'remark',
    width: 400,
    fixed: 'right'
}];

const deptTreeData = [
    {guid: 1, deptcode: '01', deptname: '测试部门01', remark: 'beizhu01', pid: 0, _id: 'dept_1', _pid: 'dept_0', _title: '测试部门01'},
    {guid: 2, deptcode: '02', deptname: '测试部门02', remark: 'beizhu02', pid: 1, _id: 'dept_2', _pid: 'dept_1', _title: '测试部门02'},
    {guid: 3, deptcode: '03', deptname: '测试部门03', remark: 'beizhu03', pid: 2, _id: 'dept_3', _pid: 'dept_2', _title: '测试部门03'},
    {guid: 4, deptcode: '04', deptname: '测试部门04', remark: 'beizhu04', pid: 0, _id: 'dept_4', _pid: 'dept_0', _title: '测试部门04'},
    {guid: 1, postname: '岗位01', remark: '', fDeptid: 3, enable: 1, _id: 'post_1', _pid: 'dept_3', _title: '岗位01'},
    {guid: 2, postname: '岗位02', remark: '', fDeptid: 3, enable: 1, _id: 'post_2', _pid: 'dept_3', _title: '岗位02'}
]

const CollectionCreateForm = Form.create()(
//     changePostValue={this.changePostValue}
// postValue={this.state.postValue}
    (props) => {
        const { visible, onCancel, onCreate, form ,title,confirmLoading,postTree,changePostValue,postValue} = props;
        const { getFieldDecorator } = form;
        // const  layout = {labelCol: { span: 5 ,offset: 0}}
        return (
            <Modal
                visible={visible}
                title={title}
                okText="保存"
                onCancel={onCancel}
                onOk={onCreate}
                confirmLoading={confirmLoading}
                width={600}
            >
                <div >
                    <Form layout="inline" hideRequiredMark={true}>
                        {getFieldDecorator('guid', )(
                            <Input type="hidden" />
                        )}
                        {getFieldDecorator('fDeptid', )(
                            <Input type="hidden" />
                        )}
                        <FormItem label="帐号" >
                            {getFieldDecorator('account', {
                                rules: [{ required: true, message: '请输入用户名' }],
                            })(
                                <Input style={{width:200,marginTop:10}}/>
                            )}
                        </FormItem>
                        <FormItem label="用户名">
                            {getFieldDecorator('nickname', {})(
                                <Input style={{width:200,marginTop:10}}/>
                            )}
                        </FormItem>
                        <FormItem label="岗位">
                            {getFieldDecorator('fPostid', {})(
                                <TreeSelect
                                    // value={postValue}
                                    treeData={postTree}
                                    treeDefaultExpandAll
                                    treeDataSimpleMode={{id:'_id',pId:'_pid',rootPId:'dept_0'}}
                                    onChange={changePostValue}
                                    style={{width:200,marginTop:10}}
                                />
                            )}
                        </FormItem>
                        <FormItem label="状态">
                            {getFieldDecorator('status')(
                                <Radio.Group style={{width:250,marginTop:10}}>
                                    <Radio.Button value="0">停用</Radio.Button>
                                    <Radio.Button value="1">锁定</Radio.Button>
                                    <Radio.Button value="2">正常</Radio.Button>
                                </Radio.Group>
                            )
                        }
                        </FormItem>
                        <FormItem label="备注" >
                            {getFieldDecorator('remark')(<Input type="textarea" style={{width:500,marginTop:10}}/>)}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        );
    }
);


class User extends Component{
    state = {
        data:[],
        pagination: {pageSize:20,current:1},
        loading:false,
        modalVisible:false,
        modalTitle:'',
        selectedRows:[],
        formData:{},
        postTree:[],
        confirmLoading:false,
        postValue:''
    }
    //组件加载完毕后触发
    async componentDidMount(){

        let postTreeData =await fetch(`${remoteHost}/post/tree`,{})
        console.log(postTreeData)
        postTreeData = postTreeData.map(item=>({...item,label:item._title,value:item._id}))
        console.log(postTreeData)
        this.getData({...this.state.pagination,postTree:postTreeData})
    }

    getData = async(param) =>{
        this.setState({loading:true})
        let data = await fetch(`${remoteHost}/user/page`,param)

        this.setState({data:data.data,pagination:data.page ,loading:false})
    }
    //分页 排序 过滤 触发回调方法
    pageChange = (pagination, filters, sorter) => {
        let sort = sorter.field===undefined?{}:{order:sorter.field,orderby:sorter.order==='ascend' ? 'asc' :sorter.order ==='descend'? 'desc':''}
        this.getData({...pagination,...sort})
    }

    saveFormRef = (form) =>{
        this.form =form
    }
    addUser = () => {
        this.setState({ modalVisible: true ,modalTitle:'新增用户'});
        this.form.resetFields()
    }
    editUser = ()=>{
        this.setState({modalVisible: true ,modalTitle:'修改'})
        let data = {...this.state.selectedRows[0]}
        data.date = moment(data.date,'YYYY-MM-DD')
        this.form.setFieldsValue({...data,fPostid:`post_${data.fPostid}`})
    }

    removUser = () =>{
        Modal.confirm({
            title: '警告',
            content: '请确认是否需要删除该用户?',
            onOk:  () => {
                fetch(`${remoteHost}/user/remove`,{guid:this.state.selectedRows[0].guid})
            }
        })
    }

    handleCancel = () => {
        this.setState({ modalVisible: false });
    }

    handleCreate = () => {
        const form = this.form;
        form.validateFields(async(err, values) => {
            // values.date = values.date.format("YYYY-MM-DD")
            if (err) {
                return;
            }
            this.setState({ confirmLoading:true});
            fetch(`${remoteHost}/user/saveUpdate`,{...values,fPostid:values.fPostid.replace('post_','')})
            form.resetFields();
            this.setState({ modalVisible: false ,confirmLoading:false});
        });
    }

    onRowClick = function(record,index){
        this.setState({selectedRowKeys:record.guid+''})
        this.selectRow([record])
    }

    selectRow = (row)=>{
        this.setState({selectedRows:[...row]})
    }
    changePostValue = (value,label,extra)=>{
        console.log(extra)
        this.form.setFieldsValue({fDeptid:extra.triggerNode.props.fDeptid})
        if(value.includes('dept')){return}
    }

    render(){
        const {data,loading,modalVisible,selectedRowKeys,pagination,modalTitle,confirmLoading,postTree} = this.state;
        const rowSelection = {
            selectedRowKeys,
            type : 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys})
                this.selectRow(selectedRows)
            }
        };
        return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary"  onClick={this.addUser}>新增</Button>
                <Button type="primary" style={{marginLeft:10}} onClick={this.editUser} disabled={this.state.selectedRows.length==0}>修改</Button>
                <Button type="danger" style={{marginLeft:10}} onClick={this.removUser} disabled={this.state.selectedRows.length==0}>删除</Button>
            </div>
            <Table
                rowKey="guid"
                bordered={true}
                size="small"
                scroll={{x:1200,y:700}}
                columns={columns}
                rowSelection={rowSelection}
                pagination= {pagination}
                dataSource={data}
                loading={loading}
                onChange={this.pageChange}
                onRowClick={this.onRowClick.bind(this)}
                 />
            <CollectionCreateForm
                ref={this.saveFormRef}
                visible={modalVisible}
                title={modalTitle}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
                confirmLoading={confirmLoading}
                postTree={postTree}
                changePostValue={this.changePostValue}
                postValue={this.state.postValue}
            />
        </div>
        )
    }
}

module.exports = connect()(User)
