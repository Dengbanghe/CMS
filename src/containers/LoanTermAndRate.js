import React, { Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,Icon,Select } from 'antd';
import { fetch ,remoteHost,transfer2tree} from '../util/common'
// import { getRegionData } from '../actions/regicodeMgmt';

const FormItem = Form.Item;
const ButtonGrid = Button.Group;
const Option = Select.Option;

const columns = [{
    title: '贷款类型名称',
    dataIndex: 'loanTypeName',
    key: 'loanTypeName',
    width: '30%',
}, {
    title: '还款方式',
    dataIndex: 'repayMethod',
    key: 'repayMethod',
    width: '20%',
}, {
    title: '贷款期限',
    dataIndex: 'loanTerm',
    key: 'loanTerm',
    width: '20%',
}, {
    title: '利率',
    dataIndex: 'rates',
    key: 'rates'
}, {
    title: '会员等级名称',
    dataIndex: 'rateName',
    key: 'rateName'
}];

// const data = [{
//     guid:1,
//     loanTypeName: '非上市银行股权质押贷款',
//     repayMethod: '先息后本',
//     loanTerm: '12期',
//     rates: 0.01
// },{
//     guid:2,
//     loanTypeName: '房地产抵押贷款',
//     repayMethod: '本息同额',
//     loanTerm: '24期',
//     rates: 0.022
// }];

const TermRateForm = Form.create()(
    (props) => {
        const { visible, onCancel,confirmLoading, onCreate, form ,title,options} = props;
        const {getFieldDecorator} = form;

        const loopSelectOption = (arr,key,title)  =>{
            return arr.map((item)=>{
                return (<option key={item[key]}>{item[title]}</option>)
            })
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
                        <FormItem label="会员等级名称" style={{marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('rateName', {
                                rules: [{ required: true, message: '请输入会员等级名称' }],
                            })(
                                <Input placeholder="输入会员等级名称"/>
                            )}
                        </FormItem>
                        <FormItem label="贷款类型名称" {...formItemLayout}>
                            {getFieldDecorator('fLoanTypeId', {
                                rules: [{ required: true, message: '请选择贷款类型名称' }],
                            })(
                                <Select placeholder=" ---请选择---">
                                    {loopSelectOption(options.loanType,'guid','loanTypeName')}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="还款方式" style={{marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('fRepayMethodCode', {
                                rules: [{ required: true, message: '请选择还款方式' }],
                            })(
                                <Select placeholder="---请选择---">
                                    {loopSelectOption(options.repaymethod,'methodCode','methodName')}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="贷款期限" style={{marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('fLoanTermId', {
                                rules: [{ required: true, message: '请选择贷款期限' }],
                            })(
                                <Select placeholder=" ---请选择---">
                                    {loopSelectOption(options.loanterm,'guid','loanTermName')}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="利率" {...formItemLayout}>
                            {getFieldDecorator('rates', {
                                rules: [{ required: true, message: '请输入利率' }],
                            })(
                                <Input type="number" min="0" step="0.001" placeholder="输入利率"/>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }
)

class LoanTermAndRate extends Component{
    state = {
        data:[],
        pagination: {pageSize:10,current:1},
        loading:false,
        modalAddTitle: '',
        modalAddVisible: false,
        confirmLoading: false,
        selectedRows:[],
        options:{loanType:[],repaymethod:[],loanterm:[]}
    }

    async componentDidMount(){
        //请求无需二次请求的数据
        let loanData = await fetch(`${remoteHost}/loantype/list`)
        let repayData = await fetch(`${remoteHost}/repaymethod/list`)
        let loanTermData = await fetch(`${remoteHost}/loanterm/list`)
        // let termRateListData = await fetch(`${remoteHost}/loanTermRate/list`)
        const data ={
            loanType:loanData.data,
            repaymethod:repayData.data,
            loanterm:loanTermData.data,
            // termRateList:termRateListData.data
        }

        this.setState({options:data})

        this.getData({...this.state.pagination})
    }
    getData = async(param) =>{
        this.setState({loading:true})
        let data = await fetch(`${remoteHost}/loanrate/page`,param)

        this.setState({data:data.data,pagination:data.page ,loading:false})
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
            modalAddTitle: '新增'
        });
        this.form.resetFields()
    }
    editRegin = () =>{
        this.setState({modalAddVisible: true, modalAddTitle:'修改'});
        let data = {...this.state.selectedRows[0]}
        this.form.resetFields()
        this.form.setFieldsValue({...data,fLoanTypeId:data.fLoanTypeId.toString(),fLoanTermId:data.fLoanTermId.toString()})
    }
    deleteRegin = () =>{
        Modal.confirm({
            title: '警告',
            content: '请确认是否需要删除该条记录?',
            onOk:  () => {
                fetch(`${remoteHost}/loanrate/remove`,{guid:this.state.selectedRows[0].guid})
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
            fetch(`${remoteHost}/loanrate/saveUpdate`,{...values});
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
        this.setState({selectedRowKeys:record.guid.toString()})
        this.selectRow([record])
    }

    selectRow = (row)=>{
        this.setState({selectedRows:[...row]})
    }

    render(){
        const {data,options ,modalAddTitle, modalAddVisible, confirmLoading, selectedRowKeys, pagination} = this.state;
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
                    bordered
                />:<div><Icon type="frown-o" />暂无数据</div>}
                <TermRateForm
                    ref={this.saveFormRef}
                    title={modalAddTitle}
                    visible={modalAddVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    options={options}
                />
            </div>
        )
    }
}


module.exports = LoanTermAndRate