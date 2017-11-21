import React,{ Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,DatePicker,Col,Row,Radio } from 'antd'
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


const CollectionCreateForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form ,title,confirmLoading} = props;
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
                        <FormItem label=" 部门 ">
                            {getFieldDecorator('deptid', {})(
                                <Input style={{width:200,marginTop:10}}/>
                            )}
                        </FormItem>
                        <FormItem label="岗位">
                            {getFieldDecorator('postid', {})(
                                <Input style={{width:200,marginTop:10}}/>
                            )}
                        </FormItem>
                        <FormItem label="状态">
                            {getFieldDecorator('status')(
                                <Radio.Group   style={{width:250,marginTop:10}}>
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
        confirmLoading:false
    }
    //组件加载完毕后触发
    componentDidMount(){
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
        this.form.setFieldsValue(data)
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
            fetch(`${remoteHost}/user/saveUpdate`,values)
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

    render(){
        const {data,loading,modalVisible,selectedRowKeys,pagination,modalTitle,confirmLoading} = this.state;
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
            />
        </div>
        )
    }
}

module.exports = connect()(User)
