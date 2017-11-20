import React,{ Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,DatePicker} from 'antd'
import { fetch ,remoteHost} from '../util/common'
import moment from 'moment'
const FormItem = Form.Item;

const columns = [{
    title: '帐号',
    dataIndex: 'account',
    width: 100,
    fixed: 'left',
    sorter: true
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
           case 1:
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
        return (
            <Modal
                visible={visible}
                title={title}
                okText="保存"
                onCancel={onCancel}
                onOk={onCreate}
                confirmLoading={confirmLoading}
            >
                <Form layout="vertical">
                    {getFieldDecorator('guid', {})(
                        <Input type="hidden"/>
                    )}
                    <FormItem label="帐号">
                        {getFieldDecorator('account', {
                            rules: [{ required: true, message: '请输入用户名' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem
                        label="DatePicker"
                    >
                        {getFieldDecorator('date', {})(
                            <DatePicker />
                        )}
                    </FormItem>
                    <FormItem label="地址">
                        {getFieldDecorator('address')(<Input type="textarea" />)}
                    </FormItem>
                </Form>
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
        let sort = sorter.field===undefined?{}:{order:sorter.field,orderBy:sorter.order}
        this.getData({...pagination,...sort})
    }

    saveFormRef = (form) =>{
        console.log(form)
        this.form =form
    }
    addUser = () => {
        this.setState({ modalVisible: true ,modalTitle:'新增用户'});
        this.form.setFieldsValue({})
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
                console.log('test')
                return;
            }
            this.setState({ confirmLoading:true});
            fetch(`${remoteHost}/user/update`,values)
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
