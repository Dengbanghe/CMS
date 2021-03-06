import React, { Component } from 'react' // 引入React
import bigdecimal from 'js-big-decimal'
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,Icon  } from 'antd';
import { fetch ,remoteHost,transfer2tree} from '../util/common'
// import { getRegionData } from '../actions/regicodeMgmt';

const FormItem = Form.Item;
const ButtonGrid = Button.Group;

const columns = [{
    title: '还款方式',
    dataIndex: 'methodName',
    key: 'methodName',
    width: '50%',
}, {
    title: '说明',
    dataIndex: 'remark',
    key: 'remark',
}];

// const data = [{
//         methodcode:1,
//         methodname: '先息后本',
//         remark: '先息后本',
//     },{
//         methodcode:2,
//         methodname: '本息同额',
//         remark: '本息同额',
//     }];

const ReginAddForm = Form.create()(
    (props) => {
        const { visible, onCancel,confirmLoading, onCreate, form ,title} = props;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 5 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
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
                        {getFieldDecorator('methodCode')(
                            <Input type="hidden"/>
                        )}
                        <FormItem label="还款方式" {...formItemLayout}>
                            {getFieldDecorator('methodName', {
                                rules: [{ required: true, message: '请输入还款方式' }],
                            })(
                                <Input placeholder="输入还款方式"/>
                            )}
                        </FormItem>
                        <FormItem label="说明" style={{marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('remark', {
                                rules: [{ required: false, message: '请输入还款方式说明' }],
                            })(
                                <Input type="textarea" placeholder="输入还款方式说明"/>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }
)

class RepayMethod extends Component{
    state = {
        data:[],
        pagination: {pageSize:10,current:1},
        modalAddTitle: '',
        modalAddVisible: false,
        confirmLoading: false,
        selectedRows:[],
        create:'',
        delete:''  //记录删除操作
    }

    componentDidMount(){
        this.getData({...this.state.pagination})
    }
    getData = async(param) =>{
        if(this.state.delete === 'delete'){  //删除某条记录后禁用除了新增外的按钮
            this.setState({selectedRows:[]})
        }
        this.setState({confirmLoading:true})
        let data = await fetch(`${remoteHost}/repaymethod/page`,param)
        this.setState({data:data.data,pagination:data.page ,confirmLoading:false,delete:''})
    }
    pageChange = (pagination) => {
        // let sort = sorter.field===undefined?{}:{order:sorter.field,orderby:sorter.order==='ascend' ? 'asc' :sorter.order ==='descend'? 'desc':''}
        this.getData({...pagination})
    }
    saveFormRef = (form) =>{
        this.form =form
    }
    addRegin = () => {
        this.setState({
            create:'create',
            modalAddVisible: true,
            modalAddTitle: '新增还款方式'
        });
        this.form.resetFields()
    }
    editRegin = () =>{
        this.setState({create:'',modalAddVisible: true, modalAddTitle:'修改还款方式'});
        let data = {...this.state.selectedRows[0]}
        this.form.resetFields()
        this.form.setFieldsValue({...data})
    }
    deleteRegin = () =>{
        Modal.confirm({
            title: '警告',
            content: '请确认是否需要删除该还款方式?',
            onOk:  async() => {
                this.setState({delete:'delete'})
                await fetch(`${remoteHost}/repaymethod/remove`,{methodCode:this.state.selectedRows[0].methodCode})
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
            //创建时设置主键
            if(this.state.create === 'create'){
                if(this.state.data.length>0){
                    values.methodCode = bigdecimal.add(this.state.data[this.state.data.length-1].methodCode,1)
                }else {
                    values.methodCode = 0
                }
            }
            await fetch(`${remoteHost}/repaymethod/saveUpdate`,{...values});
            form.resetFields();
            this.setState({ create:'',modalAddVisible: false,confirmLoading:false})

            this.getData({...this.state.pagination})
        });
    }

    handleCancel = () => {
        this.setState({
            modalAddVisible: false,
        });
    }

    onRowClick = (record,index) =>{
        this.setState({selectedRowKeys:[record.methodCode.toString()]})
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
                    rowKey ='methodCode'
                    pagination={pagination}
                    onChange={this.pageChange}
                    onRowClick={this.onRowClick}
                    loading={confirmLoading}
                    bordered
                />:<div><Icon type="frown-o" />暂无数据</div>}
                <ReginAddForm
                    ref={this.saveFormRef}
                    title={modalAddTitle}
                    visible={modalAddVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                />
            </div>
        )
    }
}


module.exports = RepayMethod