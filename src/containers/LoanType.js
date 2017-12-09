import React, { Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,Icon, Select,Radio,message } from 'antd';
import { fetch ,remoteHost,transfer2tree} from '../util/common'
// import { getRegionData } from '../actions/regicodeMgmt';

const FormItem = Form.Item;
const ButtonGrid = Button.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const columns = [{
    title: '贷款类型名称',
    dataIndex: 'loanTypeName',
    key: 'loanTypeName',
    width: '30%',
}, {
    title: '介绍',
    dataIndex: 'remark',
    key: 'remark',
    width: '40%',
},{
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render:function (text,record,index) {
        if(text == 0){
            return '正常'
        }else if(text == 1){
            return '停用'
        }else{
            return '删除'
        }
    }
}];

// const data = [{
//         guid:1,
//         loantypename: '非上市银行股权质押贷款',
//         remark: '非上市银行股权质押贷款',
//         status: 0
//     },{
//         guid:2,
//         loantypename: '房地产抵押贷款',
//         remark: '房地产抵押贷款',
//         status: 1
//     }];

const LoanTypeForm = Form.create()(
    (props) => {
        const { visible, onCancel,confirmLoading, onCreate, form ,title,sortTotal} = props;
        const {getFieldDecorator} = form;

        const sortSelectOption = []
        for(let i=0;i<sortTotal;i++){
            sortSelectOption.push(<Option key={i.toString()}>{i}</Option>)
        }

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 15 },
            },
        }

        return (
            <Modal
                title={title}
                visible={visible}
                onOk={onCreate}
                onCancel={onCancel}
            >
                <div>
                    <Form>
                        {getFieldDecorator('guid')(
                            <Input type="hidden"/>
                        )}
                        <FormItem label="贷款类型名称" {...formItemLayout}>
                            {getFieldDecorator('loanTypeName', {
                                rules: [{ required: true, message: '请输入贷款类型名称' }],
                            })(
                                <Input placeholder="贷款类型名称"/>
                            )}
                        </FormItem>
                        <FormItem label="贷款类型介绍" style={{marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('remark', {
                                rules: [{ required: false, message: '请输入贷款类型介绍' }],
                            })(
                                <Input type="textarea" placeholder="输入贷款类型介绍" />
                            )}
                        </FormItem>
                        <FormItem label="状态" style={{ marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('status', {
                                rules: [{ required: false, message: '请选择贷款类型状态' }],
                            })(
                                <Select placeholder=" ---请选择---" >
                                    <Option value="0">正常</Option>
                                    <Option value="1">停用</Option>
                                    <Option value="2">删除</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="顺序" style={{marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('sort', {
                                rules: [{ required: false}],
                                initialValue:'0'
                            })(
                                <Select>
                                    {sortSelectOption}
                                </Select>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }
)

class LoanType extends Component{
    state = {
        data:[],
        pagination: {pageSize:10,current:1},
        modalAddTitle: '',
        modalAddVisible: false,
        confirmLoading: false,
        selectedRows:[],
        delete:''
    }

    componentDidMount(){
        this.getData({...this.state.pagination})
    }
    getData = async(param) =>{
        if(this.state.delete === 'delete'){  //删除某条记录后禁用除了新增外的按钮
            this.setState({selectedRows:[]})
        }
        this.setState({confirmLoading:true})
        let result = await fetch(`${remoteHost}/loantype/page`,param)
        let data = result.data
        data = data.map(item=>({...item,'guid':item.guid.toString()}))
        // let dat = transfer2tree(data.data)
        data.sort(this.compareUp(data,"sort"))
        this.setState({data:data,pagination:result.page ,confirmLoading:false,delete:''})
    }
    // 升序排序
    compareUp = (arr,propertyName) => {
        if ((typeof arr[0][propertyName]) != "number") { // 属性值为非数字
            return function(object1, object2) {
                var value1 = object1[propertyName];
                var value2 = object2[propertyName];
                return value1.localeCompare(value2);
            }
        }
        else {
            return function(object1, object2) { // 属性值为数字
                var value1 = object1[propertyName];
                var value2 = object2[propertyName];
                return value1 - value2;
            }
        }
    }

    pageChange = (pagination) => {
        this.getData({...pagination})
    }
    saveFormRef = (form) =>{
        this.form =form
    }
    addRegin = () => {
        this.setState({
            modalAddVisible: true,
            modalAddTitle: '新增贷款类型'
        });
        this.form.resetFields()
    }
    editRegin = () =>{
        this.setState({modalAddVisible: true, modalAddTitle:'修改贷款类型'});
        let data = {...this.state.selectedRows[0]}
        this.form.resetFields()
        this.form.setFieldsValue({...data,status:data.status.toString()})
    }
    deleteRegin = () =>{
        Modal.confirm({
            title: '警告',
            content: '请确认是否需要删除该贷款类型?',
            onOk:  async() => {
                this.setState({delete:'delete'})
                await fetch(`${remoteHost}/loantype/remove`,{guid:this.state.selectedRows[0].guid})
                this.getData({...this.state.pagination})
            }
        })
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields(async(err, values) => {
            if (err) {
                return;
            }
            this.setState({ confirmLoading:true});
            await fetch(`${remoteHost}/loantype/saveUpdate`,{...values});
            form.resetFields();
            this.setState({ modalAddVisible: false ,confirmLoading:false})

            this.getData({...this.state.pagination})
        });
    }

    handleCancel = () => {
        this.setState({
            modalAddVisible: false,
        });
    }

    onRowClick = (record,index) =>{
        this.setState({selectedRowKeys:[record.guid.toString()]})
        this.selectRow([record])
    }

    selectRow = (row)=>{
        this.setState({selectedRows:[...row]})
    }

    render(){
        const {data, modalAddTitle, modalAddVisible, confirmLoading, selectedRowKeys, pagination} = this.state;
        const rowSelection = {
            selectedRowKeys,
            type : 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({ selectedRowKeys:[...selectedRowKeys]})
                this.selectRow(selectedRows)
            }
        };

        return (
            <div>
                <Button type="primary" icon="plus" onClick={this.addRegin} >新增</Button>
                <Button type="primary" icon="edit" onClick={this.editRegin} disabled={this.state.selectedRows.length==0} style={{marginLeft:10}}>修改</Button>
                <Button type="danger" icon="minus" onClick={this.deleteRegin} disabled={this.state.selectedRows.length==0} style={{marginLeft:10,marginBottom:10}}>删除</Button>
                {data.length>0?<Table
                    columns={columns}
                    rowSelection={rowSelection}
                    dataSource={data}
                    rowKey ='guid'
                    pagination={pagination}
                    onChange={this.pageChange}
                    onRowClick={this.onRowClick}
                    loading={confirmLoading}
                    bordered
                />:<div><Icon type="frown-o" />暂无数据</div>}
                <LoanTypeForm
                    ref={this.saveFormRef}
                    title={modalAddTitle}
                    visible={modalAddVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    sortTotal={pagination.total}
                />
            </div>
        )
    }
}

module.exports = LoanType