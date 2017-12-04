import React, {Component} from 'react' // 引入React
import {connect} from 'react-redux'
import {Table, Button, Modal, Form, Input, Popover, Upload, Icon, message,Tabs} from 'antd'
import {fetch, remoteHost, toThousands} from '../util/common'
import moment from 'moment'
import './masterTable.css'
const FormItem = Form.Item
const TabPane = Tabs.TabPane;

const CollectionCreateForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form ,title,confirmLoading,postTree,changePostValue,postValue} = props;
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
            <Form style={{marginTop:10}}>
                {getFieldDecorator('guid')(
                    <Input type="hidden" />
                )}
                <FormItem label="估值" {...formItemLayout}>
                    {getFieldDecorator('assessMoney',{ rules: [{ required: true, message: '请输入估值'},{ pattern:/^[1-9]\d{0,6}(\.\d{0,2})?$/, message: '请输入正确估值'}],})(
                        <Input suffix='元'/>
                    )}
                </FormItem>
                <FormItem label="说明" {...formItemLayout}>
                    {getFieldDecorator('assessRemark',{ rules: [{ required: true, message: '请输入说明信息'}]})(
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
        approve: {modalVisible: false, params: {}, fileList: [],remarkValue:'',tabActive:1}
    }
    //组件加载完毕后触发
    componentDidMount() {
        this.getData()
        // this.setState({data: data})
    }

    getData = async (param) => {
        this.setState({loading: true})
        let data = await fetch(`${remoteHost}/loanapply/page`, {...param,step:'pinggu'})
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
        },{
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
    }, ]

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
        this.setState({approve: {...approve, modalVisible: false,tabActive:'1'}});
    }

    handleCancel = () => {
        this.setState({ modalVisible: false})
    }

    onRowClick = (record, index) => {
        this.setState({selectedRowKeys: record.guid + ''})
        this.selectRow([record])
    }

    selectRow = (row) => {
        this.setState({selectedRows: [...row], subTableData: row[0].detail != null ? row[0].detail : []})
    }

    openApplyModal = async () => {
        let {approve} = this.state
        this.setState({
            approve: {
                ...approve,
                modalVisible: true
            }
        })
    }

    uploadChange =async({file, fileList}) => {
        const {approve} =this.state
        fileList = [file]
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
            let result = await fetch(`${remoteHost}/loanapply/step`,{...values,applyStatus:20})
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
            let result = await fetch(`${remoteHost}/loanapply/step`,{...values,applyStatus:21})
            if(result.success){
                this.formCancel()
                this.getData()
            }
        })
    }

    tabChange = async(tabKey)=>{
        let {approve, selectedRows} = this.state
        this.setState({
            approve: {
                ...approve,
                tabActive:tabKey,
            }
        })
        if(tabKey!='2'){
            return
        }

        const row = selectedRows[0]
        // result = [{fileName:'test.txt',status:'done',fileNo:`${fileNo}`}]
        let result = await fetch(`${remoteHost}/loanapply/getStepDetail`, {step: 'pinggu', guid: selectedRows[0].guid})
        this.setState({
            approve: {
                ...approve,
                modalVisible: true,
                tabActive:tabKey,
                fileList: result.files.map((item) => {
                    return {name: item.fileName, status: 'done', uid: item.fileNo,url: `${remoteHost}/download?fileNo=${item.fileNo}`}
                })
            }
        })
        this.form.setFieldsValue(result.stepDetail)
    }

    render() {
        const {data, loading, modalVisible, selectedRowKeys, pagination, modalTitle, subTableData, approve, selectedRows} = this.state;
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
                            disabled={this.state.selectedRows.length == 0}>评估</Button>
                </div>

                <Table
                    className='masterTable'
                    rowKey="guid"
                    bordered={true}
                    scroll={{x: 1300, y: 320}}
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
                        <Button type='primary' onClick={this.formResovle} disabled={approve.tabActive!=2}>评估通过</Button>
                        <Button type='danger' onClick={this.formReject} disabled={approve.tabActive!=2}>评估终止</Button>
                        <Button onClick={this.formCancel}>取消</Button>
                    </div>}
                    width={700}
                    onCancel={() => {
                        this.setState({approve: {...approve, modalVisible: false}})
                    }}
                >
                    <div>
                        <Tabs defaultActiveKey = '1' size="small"
                            onChange={this.tabChange}
                        >
                            <TabPane tab="质押详情" key="1">
                                <Table
                                    rowKey="guid"
                                    size="small"
                                    columns={this.subTableColumns}
                                    dataSource={subTableData}
                                    pagination={false}
                                />
                            </TabPane>
                            <TabPane tab="评估" key="2">
                                <Upload
                                    action={`${remoteHost}/loanapply/upload`}
                                    fileList={approve.fileList}
                                    onChange={this.uploadChange}
                                    //上传文件携带的参数  申请id 以及申请阶段标识
                                    data={{guid: selectedRows[0] == null ? '' : selectedRows[0].guid,step:'pinggu'}}
                                    headers={{token: localStorage.getItem("token")}}
                                    accept='application/pdf '
                                    beforeUpload={(file) => {
                                        if(!file.name.includes('.pdf')){
                                            message.warning('仅允许上传pdf文件')
                                            return false
                                        }
                                    }}
                                >
                                    <Button>
                                        <Icon type="upload" /> 上传评估报告
                                    </Button>
                                </Upload>
                                <CollectionCreateForm ref={this.saveFormRef}/>
                            </TabPane>
                        </Tabs>
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
