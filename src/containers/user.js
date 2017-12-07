import React,{ Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,Radio ,Select,TreeSelect,DatePicker} from 'antd'
import { fetch ,remoteHost} from '../util/common'
import moment from 'moment'

const FormItem = Form.Item;
const Option = Select.Option

const columns = [{
    title: '帐号',
    dataIndex: 'account',
    width: 100,
    fixed: 'left',
    sorter: true,
}, {
    title: '姓名',
    dataIndex: 'nickname',
    width: 130,
    sorter: true
}, {
    title: '性别',
    dataIndex: 'sex',
    width: 50,
    render:(text,record,index)=>{
        switch (text){
            case '0' :
                return '男'
                break
            case '1':
                return '女'
                break
            default:
                return '未知'
        }
    }
}, {
    title: '出生年月',
    dataIndex: 'birthday',
    width: 100,
}, {
    title: '身份证号',
    dataIndex: 'idcard',
    width: 140,
}, {
    title: '固定电话',
    dataIndex: 'phoneno',
    width: 130,
}, {
    title: '传真',
    dataIndex: 'faxno',
    width: 130,
}, {
    title: '电子邮件',
    dataIndex: 'email',
    width: 130,
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
    title: '办公地址',
    dataIndex: 'address',
    width: 130,
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

const CollectionCreateForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form ,title,confirmLoading,postTree,changePostValue,postValue} = props;
        const { getFieldDecorator } = form;
        // const formItemLayout = {
        //     labelCol: {
        //         xs: { span: 24 },
        //         sm: { span: 8},
        //     },
        //     wrapperCol: {
        //         xs: { span: 24 },
        //         sm: { span: 16 },
        //     },
        // }

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
                    <Form layout='inline' hideRequiredMark={true}>
                        {getFieldDecorator('guid', )(
                            <Input type="hidden" />
                        )}
                        {getFieldDecorator('fDeptid', )(
                            <Input type="hidden" />
                        )}
                        {getFieldDecorator('addtime', )(
                            <Input type="hidden" />
                        )}
                        <FormItem label="帐号" style={{marginLeft:30}}>
                            {getFieldDecorator('account', {
                                rules: [{ required: true, message: '请输入帐号' }]
                            })(
                                <Input placeholder='输入帐号' style={{width:200,marginTop:10}}/>
                            )}
                        </FormItem>
                        <FormItem label="用户名" style={{marginLeft:10}}>
                            {getFieldDecorator('nickname', {})(
                                <Input placeholder='输入用户名'  style={{width:200,marginTop:10}}/>
                            )}
                        </FormItem>
                        <FormItem label="性别" style={{marginLeft:30,marginTop:10}} >
                            {getFieldDecorator('sex', {initialValue:'0'})(
                                <Select style={{width:100}}>
                                    <Option value="0">男</Option>
                                    <Option value="1">女</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="出生年月" style={{marginLeft:100,marginTop:10}} >
                            {getFieldDecorator('birthday', {})(
                                <DatePicker
                                    showToday={false}
                                    style={{width:200}}
                                />
                            )}
                        </FormItem>
                        <FormItem label="身份证号" style={{marginLeft:5,marginTop:10}}>
                            {getFieldDecorator('idcard', {
                                    validateTrigger:'onBlur',rules: [{
                                    pattern:/^[1-9](\d{16}|\d{13})[0-9xX]$/,
                                    message:'身份证格式错误！'
                                }
                                ]})(
                                <Input placeholder='输入身份证号' style={{width:200}}/>
                            )}
                        </FormItem>
                        <FormItem label="电话" style={{marginTop:10,marginLeft:25}}>
                            {getFieldDecorator('phoneno', {})(
                                <Input placeholder='输入电话号码' style={{width:200}}/>
                            )}
                        </FormItem>
                        <FormItem label="电子邮件" style={{marginLeft:5,marginTop:10}} >
                            {getFieldDecorator('email', {})(
                                <Input type='email' placeholder='输入电子邮件' style={{width:200}}/>
                            )}
                        </FormItem>
                        <FormItem label="传真" style={{marginLeft:25,marginTop:10}}>
                            {getFieldDecorator('faxno', {})(
                                <Input placeholder='输入传真' style={{width:200}}/>
                            )}
                        </FormItem>
                        <FormItem label="办公地址" style={{marginLeft:5,marginTop:10}} >
                            {getFieldDecorator('address', {})(
                                <Input placeholder='输入办公地址' style={{width:200}}/>
                            )}
                        </FormItem>
                        <FormItem label="岗位" style={{marginLeft:25,marginTop:10}} >
                            {getFieldDecorator('fPostid', {})(
                                <TreeSelect
                                    // multiple={true}
                                    // value={postValue}
                                    treeData={postTree}
                                    treeDefaultExpandAll
                                    treeDataSimpleMode={{id:'_id',pId:'_pid',rootPId:'dept_0'}}
                                    onChange={changePostValue}
                                    placeholder='请选择'
                                    style={{width:200}}
                                />
                            )}
                        </FormItem>
                        <FormItem label="状态" style={{marginTop:10,marginLeft:30}} >
                            {getFieldDecorator('status')(
                                <Radio.Group>
                                    <Radio.Button value="0">停用</Radio.Button>
                                    <Radio.Button value="1">锁定</Radio.Button>
                                    <Radio.Button value="2">正常</Radio.Button>
                                </Radio.Group>
                            )
                        }
                        </FormItem>

                        <FormItem label="备注" style={{marginTop:10,marginLeft:30}} >
                            {getFieldDecorator('remark')(<Input placeholder='输入用户备注' type="textarea" style={{width:475}}/>)}
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
        let postTreeData =await fetch(`${remoteHost}/post/tree`)
        postTreeData = postTreeData.map(item=>{return {...item,label:item._title,value:item._id,disabled:item._id.includes('dept')}})
        this.setState({postTree:postTreeData})
        this.getData({...this.state.pagination})
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
        data.birthday = moment(data.birthday,'YYYY-MM-DD')
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
            let date = new Date(values.birthday)
            let formatDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
            fetch(`${remoteHost}/user/saveUpdate`,{...values,fPostid:values.fPostid.replace('post_',''),birthday:formatDate})
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
