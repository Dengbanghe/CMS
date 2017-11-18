import React,{ Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,DatePicker} from 'antd'
import {fetch} from '../util/common'
import moment from 'moment'
const FormItem = Form.Item;

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    width:100,
    fixed:'left',
    sorter:true
}, {
    title: 'Age',
    dataIndex: 'age',
    width:70,
    sorter:true
}, {
    title:'test1',
    dataIndex:'test1',
    width:150
},{
    title:'test2',
    dataIndex:'test2',
    width:300
},{
    title: 'Address',
    dataIndex: 'address',
    width:500,
    fixed:'right'
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
                    <FormItem label="姓名">
                        {getFieldDecorator('name', {
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
        let data = await fetch('http://localhost:9876/user/list',param)
        this.setState({data:data.result,pagination:data.page ,loading:false})
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
            values.date = values.date.format("YYYY-MM-DD")
            if (err) {
                return;
            }
            this.setState({ confirmLoading:true});
            fetch('http://localhost:9876/user/update',values)
            form.resetFields();
            this.setState({ modalVisible: false ,confirmLoading:false});
        });
    }

    onRowClick = function(record,index){
        this.setState({selectedRowKeys:record.id})
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
            },
        };
        return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary"  onClick={this.addUser}>新增</Button>
                <Button type="primary" style={{marginLeft:10}} onClick={this.editUser} disabled={this.state.selectedRows.length==0}>修改</Button>
            </div>
            <Table
                rowKey="id"
                bordered={true}
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
