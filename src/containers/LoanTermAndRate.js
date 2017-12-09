import React, { Component } from 'react' // 引入React
import bigdecimal from 'js-big-decimal'
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,Icon,Select,InputNumber,Timeline } from 'antd';
import { fetch ,remoteHost,transfer2tree} from '../util/common'
// import { getRegionData } from '../actions/regicodeMgmt';

const FormItem = Form.Item;
const ButtonGrid = Button.Group;
const Option = Select.Option;
const Item = Timeline.Item

let count = 0
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
        modalAddTitle: '',
        modalAddVisible: false,
        confirmLoading: false,
        selectedRows:[],
        options:{loanType:[],repaymethod:[],loanterm:[]},
        moneyModalVis:false,
        moneyTabData:[],
        totalMoney:0, //应还总额
        capital:0, //本金
        interest:0, //利息
        showTimeLine:[],
        showDownUp:'up',
        delete:''  //记录删除操作
    }

    async componentDidMount(){
        //请求无需二次请求的数据
        let loanData = await fetch(`${remoteHost}/loantype/list`)
        let repayData = await fetch(`${remoteHost}/repaymethod/list`)
        let loanTermData = await fetch(`${remoteHost}/loanterm/list`)
        // let termRateListData = await fetch(`${remoteHost}/loanTermRate/list`)
        const data ={
            loanType:loanData,
            repaymethod:repayData,
            loanterm:loanTermData,
            // termRateList:termRateListData
        }

        this.setState({options:data})

        this.getData({...this.state.pagination})
    }
    getData = async(param) =>{
        if(this.state.delete === 'delete'){  //删除某条记录后禁用除了新增外的按钮
            this.setState({selectedRows:[]})
        }
        this.setState({confirmLoading:true})
        let result = await fetch(`${remoteHost}/loanrate/page`,param)
        let data = result.data
        data = data.map(item=>({...item,'guid':item.guid.toString()}))

        this.setState({data:data,pagination:result.page ,confirmLoading:false,delete:''})
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
            onOk:  async() => {
                this.setState({delete:'delete'})
                await fetch(`${remoteHost}/loanrate/remove`,{guid:this.state.selectedRows[0].guid})
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
            await fetch(`${remoteHost}/loanrate/saveUpdate`,{...values});
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

    moneyModal = ()=>{
        this.setState({
            moneyModalVis:true,
            moneyTabData: this.state.selectedRows,
            totalMoney:0,
            interest:0,
            capital:0,
            showTimeLine:[]
        })
        this.refs.loanMoney.refs.input.value = '请输入贷款金额'
    }
    moneyModalCan = ()=>{
        this.setState({moneyModalVis:false})
    }
    //控制贷款详情显示
    showDU=()=>{
        count++
        if(count%2==0){
            this.setState({showDownUp:'down'})
        }else{
            this.setState({showDownUp:'up'})
        }
    }

    //处理贷款
    handleLoanInput = ()=>{
        let inputValue = this.refs.loanMoney.refs.input.value.trim()
        if(inputValue == 0 || inputValue == '请输入贷款金额'){
            this.setState({
                totalMoney:0,
                capital:0,
                interest:0,
                showTimeLine:[]
            })
            return
        }
        let loanMoney = bigdecimal.round(this.refs.loanMoney.refs.input.value.trim(),2).replace(/^0+\./,'0.').replace(/^0+([0-9])/,'$1')
        let rate = this.state.selectedRows[0].rates

        let interest = bigdecimal.multiply(loanMoney,rate)  //总利息
        let totalMoney = bigdecimal.add(loanMoney,interest) //还款总额
        this.setState({
            totalMoney:new bigdecimal(bigdecimal.round(totalMoney,2)).getPrettyValue(3,','),
            capital: new bigdecimal(loanMoney).getPrettyValue(3,','),
            interest: new bigdecimal(bigdecimal.round(interest,2)).getPrettyValue(3,',')
        })

        if(this.state.selectedRows[0].repayMethod == '先息后本'){
            this.setState({showTimeLine:this.firstIntCap(totalMoney,interest,loanMoney)})
        }

        if(this.state.selectedRows[0].repayMethod == '本息同额'){
            this.setState({showTimeLine:this.sameCapInt(totalMoney,interest,loanMoney)})
        }
    }


    //本息同额
    sameCapInt = (totalMoney,interest,loanMoney) =>{
        //期数
        let term = parseInt(this.state.selectedRows[0].loanTerm.substring(0,this.state.selectedRows[0].loanTerm.length-1))
        //每期还款本金
        let termCap = bigdecimal.round(bigdecimal.divide(loanMoney,term),2)
        //每期还款的利息
        let termInt = bigdecimal.round(bigdecimal.divide(interest,term),2)
        //每期还款总额
        let termMoney = bigdecimal.round(bigdecimal.add(termCap,termInt),2)
        let timeLine = []
        for(let i=0;i<term;i++){
            if(i==term-1){   //最后一期还款为 (本金 - 已还本金) +（总利息 - 已还利息）
                let lastCap = bigdecimal.round(bigdecimal.subtract(loanMoney,bigdecimal.multiply(termCap,term-1)),2)
                let lastInterest = bigdecimal.round(bigdecimal.subtract(interest,bigdecimal.multiply(termInt,term-1)),2)
                let mon = bigdecimal.round(bigdecimal.add(lastCap,lastInterest),2)
                timeLine.push(<Timeline.Item key={i}><p>第 {i+1} 期&nbsp;<strong style={{fontSize:13}}>{mon}</strong></p><p>含本金 {lastCap} 元 &nbsp;&nbsp;利息 {lastInterest} 元</p></Timeline.Item>)
            }else{
                timeLine.push(<Timeline.Item key={i}><p>第 {i+1} 期&nbsp;<strong>{termMoney}</strong></p><p>含本金 {termCap} 元 &nbsp;&nbsp;利息 {termInt} 元</p></Timeline.Item>)
            }
        }
        return timeLine
    }


    //先息后本
    firstIntCap = (totalMoney,interest,loanMoney) => {
        //期数
        let term = parseInt(this.state.selectedRows[0].loanTerm.substring(0,this.state.selectedRows[0].loanTerm.length-1))
        //每期还款总额（利息）
        let termMoney = bigdecimal.round(bigdecimal.divide(interest,term),2)
        let timeLine = []
        for(let i=0;i<term;i++){
            if(i==term-1){   //最后一期还款为 本金 +（总利息 - 已还利息）
                let lastInterest = bigdecimal.round(bigdecimal.subtract(interest,bigdecimal.multiply(termMoney,term-1)),2)
                let mon = bigdecimal.round(bigdecimal.add(loanMoney,lastInterest),2)
                timeLine.push(<Timeline.Item key={i}><p>第 {i+1} 期&nbsp;<strong style={{fontSize:13}}>{mon}</strong></p><p>含本金 {loanMoney} 元 &nbsp;&nbsp;利息 {lastInterest} 元</p></Timeline.Item>)
            }else{
                timeLine.push(<Timeline.Item key={i}><p>第 {i+1} 期&nbsp;<strong>{termMoney}</strong></p><p>含利息 {termMoney} 元</p></Timeline.Item>)
            }
        }
        return timeLine
    }

    render(){
        const {data,options ,modalAddTitle, modalAddVisible, confirmLoading, selectedRowKeys, pagination,
            moneyModalVis,moneyTabData,totalMoney,capital,interest,showTimeLine,showDownUp} = this.state;
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
                <Button type="primary" icon="pay-circle-o" onClick={this.moneyModal} disabled={this.state.selectedRows.length==0} style={{marginLeft:10,marginBottom:10}}>试算还款金额</Button>
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
                <TermRateForm
                    ref={this.saveFormRef}
                    title={modalAddTitle}
                    visible={modalAddVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    options={options}
                />
                <Modal
                    onCancel={this.moneyModalCan}
                    visible={moneyModalVis}
                    footer={null}
                    title='还款金额试算'>
                    <div>
                        <Table
                            rowKey ='guid'
                            dataSource={moneyTabData}
                            columns={columns}
                            pagination={false}
                        />
                        <div style={{marginLeft:80,marginTop:25}}>
                            <label>贷款金额：</label>
                            <Input type='number' step='0.01' onFocus={this.handleFocus} onBlur={this.handleLoanInput} style={{width:250,marginBottom:-10}} ref='loanMoney' min='0' placeholder='请输入贷款金额'/>
                        </div>
                        <div style={{marginTop:30,marginBottom:20}}>
                            <span>总共应还 <strong style={{fontSize:14}}>{totalMoney==0?0:totalMoney}</strong> 元</span><span style={{marginLeft:20,marginRight:20}}>本金 <strong style={{fontSize:14}}>{capital==0?0:capital}</strong> 元</span><span>总利息 <strong style={{fontSize:14}}>{interest==0?0:interest}</strong> 元</span>
                        </div>
                        <div style={{marginBottom:20}}><a onClick={this.showDU}>还款详情<Icon type={showDownUp}/></a></div>
                        <Timeline>
                            {showDownUp=='down'?showTimeLine:''}
                        </Timeline>
                    </div>
                </Modal>
            </div>
        )
    }
}


module.exports = LoanTermAndRate