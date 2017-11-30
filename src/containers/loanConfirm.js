import React, {Component} from 'react' // 引入React
import {connect} from 'react-redux'
import {Table, Button, Modal, Form, Input, Radio, TreeSelect, Popover, Upload, Icon, message,Select} from 'antd'
import {fetch, remoteHost, toThousands} from '../util/common'
import moment from 'moment'
import './masterTable.css'
const FormItem = Form.Item
const Option = Select.Option;
const CollectionCreateForm = Form.create()(
    (props) => {
        const { form ,ratesOptions,selectValue,confirmRateChange} = props;
        const { getFieldDecorator } = form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        return (
            <Form size="small" style={{marginTop:10}}>
                {getFieldDecorator('guid')(
                    <Input type="hidden"/>
                )}
                <FormItem label="估值" {...formItemLayout}>
                    {getFieldDecorator('assessMoney')(
                        <Input disabled={true}/>
                    )}
                </FormItem>
                <FormItem label="发放贷款金额" {...formItemLayout}>
                    {getFieldDecorator('confirmMoney',{ rules: [{ required: true, message: '请输入发放贷款金额'},{ pattern:/^[1-9]\d{0,6}(\.\d{0,2})?$/, message: '请输入正确发放贷款金额'}]})(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="服务费" {...formItemLayout}>
                    {getFieldDecorator('confirmServerMoney',{ rules: [{ required: true, message: '请输入服务费'},{ pattern:/^\d{1,6}(\.\d{0,2})?$/, message: '请输入正确服务费'}]})(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="利率标准" {...formItemLayout}>
                    {getFieldDecorator('confirmRates',{ rules: [{ required: true, message: '请选择利率标准'}]})(
                        <Select value={selectValue}
                            onChange={confirmRateChange}
                        >
                            {ratesOptions.map(item=>{
                                return (<Option value={item.rates}>{item.rateName}</Option>)
                            })}
                        </Select>
                    )}
                </FormItem>
                <FormItem label="说明" {...formItemLayout}>
                    {getFieldDecorator('confirmRemark',{ rules: [{ required: true, message: '请输入说明信息'}]})(
                        <Input type='textarea'/>
                    )}
                </FormItem>
            </Form>
        )
    })

class LoanAssess extends Component {
    state = {
        data: [],
        pagination: {pageSize: 20, current: 1},
        loading: false,
        modalVisible: false,
        modalTitle: '',
        selectedRows: [],
        formData: {},
        confirmLoading: false,
        postValue: '',
        subTableData: [],
        approve: {modalVisible: false, params: {}, fileList: [],remarkValue:''},
        ratesOptions:[],
        selectValue:''
    }
    //组件加载完毕后触发
    componentDidMount() {
        this.getData()
        // this.setState({data: data})
    }

    getData = async (param) => {
        this.setState({loading: true})
        let data = await fetch(`${remoteHost}/loanapply/page`, {...param,step:'shenhe'})
        this.setState({data: data.data, pagination: data.page, loading: false})
    }
    //分页 排序 过滤 触发回调方法
    pageChange = (pagination, filters, sorter) => {
        let sort = sorter.field === undefined ? {} : {
            order: sorter.field,
            orderby: sorter.order === 'ascend' ? 'asc' : sorter.order === 'descend' ? 'desc' : ''
        }
        this.getData({...pagination, ...sort})
    }
    columns = [{
        title: '编号',
        key: 'applyNo',
        dataIndex: 'applyNo',
        width: 120,
    }, {
        title: '',
        key: 'guid',
        width: 100,
        render: (value, row) => {
            return (<Button onClick={() => {
                this.selectRow([row]);
                this.setState({modalVisible: true})
            }}>质押详情</Button>)
        }
    }, {
        title: '用户信息',
        children: [{
            title: '贷款人',
            dataIndex: 'applyName',
            width: 100,
        }, {
            title: '联系电话',
            dataIndex: 'applyTel',
            width: 130,
        }, {
            title: '身份证',
            dataIndex: 'applyIdCard',
            render: (text, record, index) => {
                if (text.length === 18) {
                    return text.replace(/^(.{6})(?:\d+)(.{4})$/, "$1****$2")
                }
                return text
            },
            width: 130
        }]
    }, {
        title: '贷款类型',
        dataIndex: 'loanTypeName',
        width: 180
    }, {
        title: '还款方式',
        dataIndex: 'repayMethodName',
        width: 80
    }, {
        title: '贷款时间',
        dataIndex: 'loanTermName',
        width: 60
    }, {
        title: '贷款状态',
        dataIndex: 'applyStatus',
        width: 90,
        render: (text) => {
            switch (text) {
                case `0`:
                    return '申请中'
                    break
                case `1`:
                    return '审核通过'
                    break
                case `2`:
                    return '已放款'
                    break
                case `3`:
                    return '还款中'
                    break
                case `4`:
                    return '已结束'
                    break
            }
        }
    }, {
        title: '期望放款时间',
        dataIndex: 'applyDate',
        width: 120
    }, {
        title: '期望贷款金额(元)',
        dataIndex: 'applyMoney',
        width: 120,
        render: (value) => {
            return toThousands(value)
        }
    }, {
        title: '申请时间',
        dataIndex: 'applyTime',
        width: 150
    }]

    subTableColumns = [{
        title: '质押详情',
        children: [{
            title: '银行',
            dataIndex: 'bankInfoName',
            width: 150
        }, {
            title: '质押数量(股)',
            dataIndex: 'amount',
            width: 150
        }, {
            title: '股权性质',
            dataIndex: 'stockType',
            render: (value) => {
                switch (value) {
                    case '1':
                        return '自然人股'
                        break
                    case '2':
                        return '法人股'
                        break
                    case '3':
                        return '职工股'
                        break
                    case '4':
                        return '其他'
                        break
                    default:
                        return ''
                }
            },
            width: 100
        }, {
            title: '是否含证',
            dataIndex: 'hasCertificate',
            render: (value) => {
                return value == 1 ? '是' : value == 0 ? '否' : ''
            },
            width: 100
        }, {
            title: '是否可拆分',
            dataIndex: 'ensplit',
            render: (value) => {
                return value == 1 ? '是' : value == 0 ? '否' : ''
            },
            width: 100
        }]
    }, {
        title: '股金证',
        dataIndex: 'certificatePic1',
        width: 150,
        render: (value, row) => {
            // fileNo: '',
            //     fileType: '',
            //     fileName: '',
            //     fileRealName: './test.jpg'
            return this.picRender(row)
        }
    }]

    picRender = (row) => {
        return (<div>
            {row.certificatePic1 != null ?
                <Popover placement="left" content={<img width={100} height={100} src={row.certificatePic1!=null?`${remoteHost}/download?fileNo=${row.certificatePic1}`:''}/>}><a>附件1</a></Popover> : ""}
            {row.certificatePic2 != null ?
                <Popover placement="left" content={<img width={100} height={100} src={row.certificatePic2!=null?`${remoteHost}/download?fileNo=${row.certificatePic2}`:''}/>}><a>附件2</a></Popover> : ""}
        </div>)
    }

    saveFormRef = (form) => {
        this.form = form
    }

    formCancel = () => {
        const {approve} = this.state
        this.setState({approve: {...approve, modalVisible: false}});
    }

    handleCancel = () => {
        this.setState({ modalVisible: false})
    }

    handleCreate = () => {
        const form = this.form;
        form.validateFields(async (err, values) => {
            // values.date = values.date.format("YYYY-MM-DD")
            if (err) {
                return;
            }
            this.setState({confirmLoading: true});
            fetch(`${remoteHost}/user/saveUpdate`, {...values, fPostid: values.fPostid.replace('post_', '')})
            form.resetFields();
            this.setState({modalVisible: false, confirmLoading: false});
        });
    }

    onRowClick = (record, index) => {
        this.setState({selectedRowKeys: record.guid + ''})
        this.selectRow([record])
    }

    selectRow = (row) => {
        this.setState({selectedRows: [...row], subTableData: row[0].detail != null ? row[0].detail : []})
    }

    openApplyModal = async () => {
        const fileNo= '18993cc2-9ac6-4abb-ab4c-408f83faff03'

        let {approve, selectedRows} = this.state
        const row = selectedRows[0]
        console.log(row)
            // result = [{fileName:'test.txt',status:'done',fileNo:`${fileNo}`}]
        let result = await fetch(`${remoteHost}/loanapply/getStepDetail`, {step: 'shenhe', guid: selectedRows[0].guid})
        let result1 = await  fetch(`${remoteHost}/loanapply/getRatesSelection`,{fLoanTermId:row.fLoanTermId,fLoanTypeId:row.fLoanTypeId,fRepayMethodCode:row.fRepayMethodCode})

        const ratesOptions = result1.map(item=>{
            return {rates:item.rates,rateName:item.rateName}
        })
        this.setState({
            ratesOptions:ratesOptions,
            approve: {
                ...approve,

                modalVisible: true,
                fileList: result.files.map((item) => {
                    return {name: item.fileName, status: 'done', uid: item.fileNo,url: `${remoteHost}/download?fileNo=${item.fileNo}`}
                })
            }
        })
        this.form.setFieldsValue(result.stepDetail)
    }

    uploadChange =async({file, fileList}) => {
        const {approve} =this.state
        fileList = []
        if (!file.status) {

        } else if (file.status == 'removed') {
            // todo 移除文件
            let result = await fetch('')
            if (result.success) {
                fileList = []
            }
        }else if(file.status =='done'){
            if(file.response.success){
                file.uid=file.response.fileNo
                file.url=`${remoteHost}/download?fileNo=${file.response.fileNo}`
                fileList=[file]
            }
        }
        this.setState({approve: {...approve, fileList: fileList}})

    }

    formResovle =async ()=>{
        this.form.validateFields(async(err,values)=>{
            if(err){
                return
            }
            let result = await fetch(`${remoteHost}/loanapply/step`,{...values,applyStatus:30})
            if(result.success){
                this.formCancel()
                this.getData()
            }
        })
    }
    formReject =async()=>{
        this.form.validateFields(async(err,values)=>{
            if(err){
                return
            }
            let result = await fetch(`${remoteHost}/loanapply/step`,{...values,applyStatus:31})
            if(result.success){
                this.formCancel()
                this.getData()
            }
        })
    }
    confirmRateChange=(value)=>{
        this.setState({selectValue:value})
    }
    render() {
        const {data, loading, modalVisible, selectedRowKeys, pagination, modalTitle, subTableData, approve, selectedRows,selectValue,

        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRowKeys})
                this.selectRow(selectedRows)
            }
        };
        return (
            <div>
                <div style={{marginBottom: 16}}>
                    <Button type="primary" onClick={this.openApplyModal}
                            disabled={this.state.selectedRows.length == 0}>审核</Button>
                </div>

                <Table
                    className='masterTable'
                    rowKey="guid"
                    bordered={true}
                    scroll={{x: 1200, y: 320}}
                    columns={this.columns}
                    rowSelection={rowSelection}
                    pagination={pagination}
                    dataSource={data}
                    loading={loading}
                    onChange={this.pageChange}
                    onRowClick={this.onRowClick}
                />
                <Modal
                    visible={approve.modalVisible}
                    title='贷款申请评估'
                    footer={<div>
                        <Button type='primary' onClick={this.formResovle}>评估通过</Button>
                        <Button type='danger' onClick={this.formReject}>评估终止</Button>
                        <Button onClick={this.formCancel}>取消</Button>
                    </div>}
                    width={600}
                    onCancel={() => {
                        this.setState({approve: {...approve, modalVisible: false}})
                    }}
                >
                    <div>
                        <Upload
                            action={`${remoteHost}/loanapply/upload`}
                            fileList={approve.fileList}
                            onChange={this.uploadChange}
                            //上传文件携带的参数  申请id 以及申请阶段标识
                            data={{guid: selectedRows[0] == null ? '' : selectedRows[0].guid,step:'auditing'}}
                            headers={{token: localStorage.getItem("token")}}
                            accept='application/pdf '
                            beforeUpload={(file) => {
                                if(!file.name.includes('.pdf')){
                                    message.warning('仅允许上传pdf文件')
                                    return false
                                }
                            }}
                        >
                            {/*<Button>*/}
                                {/*/!*<Icon type="upload" /> 上传审核报告*!/*/}
                            {/*</Button>*/}

                        </Upload>
                        <CollectionCreateForm
                            ref={this.saveFormRef}
                            ratesOptions={this.state.ratesOptions}
                            selectValue={selectValue}
                            confirmRateChange={this.confirmRateChange}
                        />
                    </div>
                </Modal>

                <Modal
                    visible={modalVisible}
                    title={modalTitle}
                    width={750}
                    footer={null}
                    onCancel={this.handleCancel}>
                    <Table
                        rowKey="guid"
                        size="small"
                        columns={this.subTableColumns}
                        dataSource={subTableData}
                        pagination={false}
                    />
                </Modal>
            </div>
        )
    }
}

module.exports = connect()(LoanAssess)
