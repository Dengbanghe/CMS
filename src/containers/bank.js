import React, { Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,Icon,Select,TreeSelect,DatePicker, Upload, message,Popover } from 'antd';
import { fetch ,remoteHost,transfer2tree} from '../util/common'
import moment from 'moment'
import './bank.css'

const FormItem = Form.Item;
const ButtonGrid = Button.Group;
const Option = Select.Option;
const TreeNode = TreeSelect.TreeNode;
var imgsrc = ''
var modalvis = false

const columns = [{
    title: '非上市银行名称',
    dataIndex: 'bankName',
    key: 'bankName',
    width: '200',
    fixed: 'left'
}, {
    title: '所属行政区划',
    dataIndex: 'regiName',
    key: 'regiName',
    width:'150'
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width:'50',
    render: function (text,record,index) {
        if(text == 0){
            return '正常'
        }else if(text == 1){
            return '停用'
        }
    }
},{
    title: '图标',
    dataIndex: 'bankImg',
    key: 'bankImg',
    width:'50',
    render:function (text,record) {
        let src = <img alt='Not Found' style={{width:140,height:140}} src={`${remoteHost}/download?fileNo=${text}`} />
        return (<Popover content={src}>
                     <a href='#'>logo</a>
                </Popover >)
    }
},{
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width:200
},{
    title: '法人代表',
    dataIndex: 'corporation',
    key: 'corporation',
    width:100
},{
    title: '注册资本',
    dataIndex: 'registeredcapital',
    key: 'registeredcapital',
    width:200
},{
    title: '成立日期',
    dataIndex: 'founddate',
    key: 'founddate',
    width:200
},{
    title: '营业期限',
    dataIndex: 'businessterm',
    key: 'businessterm',
    width:200
},{
    title: '经营范围',
    dataIndex: 'business',
    key: 'business',
    width:200
},{
    title: '登记机关',
    dataIndex: 'regauthority',
    key: 'regauthority',
    width:200
},{
    title: '备注',
    dataIndex: 'remark',
    width:250,
    key: 'remark',
    fixed: 'right'
}];



// const data = [{
//     guid:1,
//     bankName:'北京中关村银行',
//     remark:'北京中关村银行',
//     bankImg:'img',
//     status:0,
//     fRegicode:130002,
//     reginame:'长安区'
//     },{
//     guid:2,
//     bankName:'北京农村商业银行',
//     remark:'北京农村商业银行',
//     bankImg:'img',
//     status:1,
//     fRegicode:130004,
//     reginame:'桥西区'
//     },{
//     guid:3,
//     bankName:'天津银行',
//     remark:'天津银行',
//     bankImg:'img',
//     status:0,
//     fRegicode:120001,
//     reginame:'和平区'
//     }];

const provinceData = []
const cityData = {}
let cityClickTag = false
let provClickTag = false



const BankForm = Form.create()(
    (props) => {
        const { visible, onCancel,confirmLoading, onCreate, form ,title,reginData,cities,showCity,showProv,
            handleProvinceChange,onCityChange,handleImgChange,beforeUpload,backImg,imageUrl,create} = props;
        const {getFieldDecorator} = form;

        const provinceOptions = provinceData.map(province => <Option key={province.regicode}>{province.reginame}</Option>);
        const cityOptions = cities.map(city => <Option key={city.regicode}>{city.reginame}</Option>);

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
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
                        {getFieldDecorator('guid')(
                            <Input type="hidden"/>
                        )}
                        {getFieldDecorator('bankImgBase64')(
                            <Input type="hidden"/>
                        )}
                        <FormItem label="非上市银行名称" {...formItemLayout}>
                            {getFieldDecorator('bankName', {
                                rules: [{ required: true, message: '请输入非上市银行名称' }],
                            })(
                                <Input placeholder="输入非上市银行名称"/>
                            )}
                        </FormItem>
                        <FormItem label="所属行政区划" style={{ marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('fRegicode',{
                                rules: [{ required: false, message: '请选择所属行政区划' }],
                            })(
                                <div>
                                    <Select placeholder='---请选择---' value={showProv}  style={{ width: 150 }} onChange={handleProvinceChange}>
                                        {provinceOptions}
                                    </Select>
                                    <Select placeholder='---请选择---' value={showCity} onChange={onCityChange} style={{marginLeft:25,width: 150 }}>
                                        {cityOptions}
                                    </Select>
                                </div>
                            )}
                        </FormItem>
                        <FormItem label="状态" style={{ marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('status', {
                                rules: [{ required: false,message: '请选择非上市银行状态' }],
                            })(
                                <Select placeholder=" ---请选择---" >
                                    <Option value="0">正常</Option>
                                    <Option value="1">停用</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem label="地址" {...formItemLayout}>
                            {getFieldDecorator('address', {
                                rules: [{ required: false, message: '请输入地址' }],
                            })(
                                <Input placeholder="输入地址"/>
                            )}
                        </FormItem>
                        <FormItem label="法人代表" {...formItemLayout}>
                            {getFieldDecorator('corporation', {
                                rules: [{ required: false, message: '请输入法人代表' }],
                            })(
                                <Input placeholder="输入法人代表"/>
                            )}
                        </FormItem>
                        <FormItem label="注册资本" {...formItemLayout}>
                            {getFieldDecorator('registeredcapital', {
                                rules: [{ required: false, message: '请输入注册资本' }],
                            })(
                                <Input type="number" min="0" step="0.001" placeholder="输入注册资本"/>
                            )}
                        </FormItem>
                        <FormItem label="成立日期" {...formItemLayout}>
                            {getFieldDecorator('founddate', {
                                rules: [{ required: false, message: '请输入法人代表' }],
                            })(
                                <DatePicker
                                    showToday={false}
                                    style={{width:200}}
                                />
                            )}
                        </FormItem>
                        <FormItem label="登记机关" {...formItemLayout}>
                            {getFieldDecorator('regauthority', {
                                rules: [{ required: false, message: '请输入登记机关' }],
                            })(
                                <Input placeholder="输入登记机关"/>
                            )}
                        </FormItem>
                        <FormItem label="经营期限" {...formItemLayout}>
                            {getFieldDecorator('businessterm', {
                                rules: [{ required: false, message: '请输入经营期限' }],
                            })(
                                <Input placeholder="输入经营期限"/>
                            )}
                        </FormItem>
                        <FormItem label="经营范围" {...formItemLayout}>
                            {getFieldDecorator('business', {
                                rules: [{ required: false, message: '请输入经营范围' }],
                            })(
                                <Input type='textarea' placeholder="输入经营范围"/>
                            )}
                        </FormItem>
                        <FormItem label="图标" {...formItemLayout}>
                            {getFieldDecorator('bankImg', {})(
                                <input type='hidden'/>
                            )}
                        </FormItem>
                        <Upload
                            name="bankImg"
                            showUploadList={false}
                            action="//jsonplaceholder.typicode.com/posts/"
                            beforeUpload={beforeUpload}
                            // onChange={handleImgChange}
                            className='upload'
                        >
                            {
                                (create === 'create')&&(imageUrl!='') ?
                                    <img  src={imageUrl} alt='img' style={{width:80,height:80}}/>
                                    :
                                    create === 'create' && imageUrl==''?
                                        <div>
                                            <Icon type="plus" className='upload-plus'/>
                                            <div className='upload-text'>上传图片</div>
                                        </div>
                                        :
                                        backImg && !imageUrl ?
                                            <img  src={`${remoteHost}/download?fileNo=${backImg}`} alt='img' style={{width:80,height:80}}/>
                                            :
                                            imageUrl!='' ?
                                                <img  src={imageUrl} alt='img' style={{width:80,height:80}}/>
                                                :
                                                <div>
                                                    <Icon type="plus" className='upload-plus'/>
                                                    <div className='upload-text'>上传图片</div>
                                                </div>
                            }
                        </Upload>
                        <FormItem label="备注" style={{marginTop:70}} {...formItemLayout}>
                            {getFieldDecorator('remark', {
                                rules: [{ required: false, message: '请输入非上市银行备注' }],
                            })(
                                <Input type="textarea" placeholder="输入非上市银行备注"/>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }
)

class Bank extends Component{
    state = {
        data:[],
        pagination: {pageSize:10,current:1},
        modalAddTitle: '',
        modalAddVisible: false,
        confirmLoading: false,
        selectedRows:[],
        reginData:[{}],
        cities:[],
        create:'',  //记录新增状态
        edit:'', //记录修改状态
        delete:'', //记录删除
        previewVisible:false,
        previewImage:'',
        imageUrl:'',  //img base64
        bankImg:''  //接收的bankImg
    }

    async componentDidMount(){
        this.getData({...this.state.pagination})

        let reginData = await fetch(`${remoteHost}/region/list`)

        let data = transfer2tree(reginData,{rootId:'regi_0'})
        this.setState({reginData:data})

        this.handleReginData(data)
    }

    // 处理行政区划数据用于省市联动
    handleReginData = (data) =>{
        data.forEach((e)=>{
            let provi = {}
            provi['regicode'] = e.regicode
            provi['reginame'] = e.reginame
            provinceData.push(provi)
            if(e.children && e.children.length > 0){
                let value = []
                e.children.forEach((e)=>{
                    let cit = {}
                    cit['regicode'] = e.regicode
                    cit['reginame'] = e.reginame
                    value.push(cit)
                })
                cityData[e.regicode] = value
            }
        })
    }

    handleProvinceChange = (value) => {
        provClickTag = true
        let name = ''
        provinceData.forEach((e)=>{
            if(value == e.regicode){
                name = e.reginame
            }
        })
        this.setState({
            showProv: name,
            cities: cityData[value],
            showCity: cityData[value][0].reginame,
            cityCode: cityData[value][0].regicode
        });
    }

    onCityChange = (value) => {
        cityClickTag = true
        let name = ''
        this.state.cities.forEach((e)=>{
            if(e.regicode == value){
                name = e.reginame
            }
        })
        this.setState({
            showCity: name,
            cityCode:value
        });
        // this.form.setFieldsValue({'fRegicode':this.state.cityCode})
    }

    // 修改状态设置省市值
    setProvCityValue=()=>{
        this.state.reginData.forEach((e)=>{
            if(e.children && e.children.length > 0){
                let parentcode = ''
                e.children.forEach((e)=>{
                    if(this.state.selectedRows[0].fRegicode == e.regicode){
                        this.setState({showCity:e.reginame})
                        parentcode = e.pRegicode
                    }
                })
                if(parentcode == e.regicode){
                    this.setState({showProv:e.reginame,cities: cityData[e.regicode]})
                }
            }else {
                if(this.state.selectedRows[0].fRegicode == e.regicode){
                    this.setState({showProv:e.reginame})
                }
            }
        })
    }

    getData = async(param) =>{
        if(this.state.delete === 'delete'){  //删除某条记录后禁用除了新增外的按钮
            this.setState({selectedRows:[]})
        }
        this.setState({confirmLoading:true})
        let result = await fetch(`${remoteHost}/bankinfo/page`,param)
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
            bankImg:'',
            edit:'',
            create:'create',
            imageUrl:'',
            showProv:undefined,
            showCity:undefined,
            modalAddVisible: true,
            modalAddTitle: '新增非上市银行'
        });
        this.form.resetFields()
    }


    editRegin = () =>{
        this.setState({imageUrl:'',bankImg:'',create:'',edit:'edit',modalAddVisible: true, modalAddTitle:'修改非上市银行'});
        let data = {...this.state.selectedRows[0]}
        if(data.founddate){
            data.founddate = moment(data.founddate,'YYYY-MM-DD')
        }
        this.form.resetFields()
        this.form.setFieldsValue({...data,status:data.status.toString()})
        this.setProvCityValue()
        this.setState({backImg:this.state.selectedRows[0].bankImg})
    }


    deleteRegin = () =>{
        Modal.confirm({
            title: '警告',
            content: '请确认是否需要删除该非上市银行?',
            onOk:  async() => {
                this.setState({delete:'delete'})
                await fetch(`${remoteHost}/bankinfo/remove`,{guid:this.state.selectedRows[0].guid})
                this.getData({...this.state.pagination})
            }
        })
    }
    handleCreate = () => {
        const form = this.form;
        if(this.state.edit === 'edit' && this.state.imageUrl != ''){  //修改时点击了更换图标
            form.setFieldsValue({'bankImgBase64':this.state.imageUrl})
            form.setFieldsValue({'bankImg':this.state.selectedRows[0].bankImg})
        }
        if(this.state.edit === 'edit' && this.state.imageUrl == ''){ //修改时没有点击更换图标
            form.setFieldsValue({'bankImg':this.state.selectedRows[0].bankImg})
        }
        if(this.state.create === 'create'){  //新增时设置选中的市级编码
            form.setFieldsValue({'fRegicode':this.state.cityCode})
            if(this.state.imageUrl != ''){  //新增时选择了图片
                form.setFieldsValue({'bankImgBase64':this.state.imageUrl})
                console.log('======',this.state.imageUrl)
            }
        }
        if(this.state.edit === 'edit' && cityClickTag == true){
            form.setFieldsValue({'fRegicode':this.state.cityCode})
        }
        if(this.state.edit === 'edit' && provClickTag == true && cityClickTag == false){
            form.setFieldsValue({'fRegicode':this.state.cityCode})
        }
        provClickTag = false
        cityClickTag = false
        form.validateFields(async(err, values) => {
            if (err) {
                return;
            }
            this.setState({ confirmLoading:true});
            if(values.founddate){
                let date = new Date(values.founddate)
                let formatDate = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
                await fetch(`${remoteHost}/bankinfo/saveUpdate`,{...values,founddate:formatDate});
            }else {
                await fetch(`${remoteHost}/bankinfo/saveUpdate`,{...values});
            }

            form.resetFields();
            this.setState({
                modalAddVisible: false ,
                confirmLoading:false,
            })

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

    //----------图片处理--------------
    getBase64 = (img, callback) =>{
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    beforeUpload =(file) =>{
        const isJPG = file.type === 'image/jpeg';
        const isNPG = file.type === 'image/npg';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG && !isNPG){
            message.error('只能上传JPG/NPG格式图片!');
        }
        if (!isLt2M) {
            message.error('图片大小必须小于2MB!');
        }
        if((isJPG && isLt2M)||(isNPG && isLt2M)){
            this.getBase64(file, imageUrl => this.setState({imageUrl:imageUrl}));
            // this.setState({bankImgBase64:this.state.imageUrl})
        }
        return false
    }
    // handleImgChange = (info) => {
    //     if (info.file.status === 'done') {
    //         // this.getBase64(info.file.originFileObj, imageUrl => this.setState({ imageUrl }));
    //         message.success('上传成功')
    //     }
    //     if(info.file.status === 'error'){
    //         message.error(`${info.file.name}上传失败！`)
    //     }
    // }

    render(){
        const {data, modalAddTitle, modalAddVisible, confirmLoading, selectedRowKeys,selectedRows, pagination,
            reginData,cities,showCity,showProv,imageUrl,backImg,create} = this.state;
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
                    scroll={{x:1200,y:700}}
                    pagination={pagination}
                    onChange={this.pageChange}
                    onRowClick={this.onRowClick}
                    loading={confirmLoading}
                    bordered
                />:<div><Icon type="frown-o" />暂无数据</div>}
                <BankForm
                    ref={this.saveFormRef}
                    title={modalAddTitle}
                    visible={modalAddVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    reginData={reginData}
                    handleProvinceChange={this.handleProvinceChange}
                    cities={cities}
                    showCity={showCity}
                    showProv={showProv}
                    onCityChange={this.onCityChange}
                    beforeUpload={this.beforeUpload}
                    handleImgChange={this.handleImgChange}
                    backImg={backImg}
                    create={create}
                    imageUrl={imageUrl}
                />
            </div>
        )
    }
}


module.exports = Bank