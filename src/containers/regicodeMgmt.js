import React, { Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input,Icon ,Select } from 'antd';
import { fetch ,remoteHost,transfer2tree} from '../util/common'
// import { getRegionData } from '../actions/regicodeMgmt';

const FormItem = Form.Item;
const ButtonGrid = Button.Group;
const Option = Select.Option;

const columns = [{
    title: '行政区划名称',
    dataIndex: 'reginame',
    key: 'reginame',
    width: '60%',
}, {
    title: '行政区划编码',
    dataIndex: 'regicode',
    key: 'regicode',
}];

// const data = [{
//     reginame: '河北省',
//     regicode: 130000,
//     children: [{
//         reginame: '长安区',
//         regicode: 130002,
//         pRegicode: 130000
//     }, {
//         reginame: '桥西区',
//         regicode: 130004,
//         pRegicode: 130000
//     }]
// }, {
//     reginame: '天津市',
//     regicode: 120000,
//     children:[{
//         reginame: '和平区',
//         regicode: 120001,
//         pRegicode: 120000
//         },{
//         reginame: '河东区',
//         regicode: 120002,
//         pRegicode: 120000
//     }]
// }];

const ReginAddForm = Form.create()(
    (props) => {
        const { visible, onCancel,confirmLoading, onCreate, form ,title,selectedRowData,data,tagEidt,tagCreate} = props;
        const {getFieldDecorator} = form;

        // 根据选择（省，市级别）不同以及操作不同，提供的选择排序总数不同
        const sortSelectOption = []
        if(tagEidt === 'edit'){
            if(selectedRowData[0].pRegicode != null){
                data.forEach((e)=>{
                    if(e.regicode == selectedRowData[0].pRegicode){
                        if(e.children){
                            for(let i=0;i<e.children.length;i++){
                                sortSelectOption.push(<Option key={i.toString()}>{i}</Option>)
                            }
                        }
                    }
                })
            }else{
                for(let i=0;i<data.length;i++){
                    sortSelectOption.push(<Option key={i.toString()}>{i}</Option>)
                }
            }
        }else if(tagCreate === 'create'){
            if(selectedRowData[0].pRegicode != null){
                data.forEach((e)=>{
                    if(e.regicode == selectedRowData[0].pRegicode){
                        if(e.children){
                            for(let i=0;i<=e.children.length;i++){
                                sortSelectOption.push(<Option key={i.toString()}>{i}</Option>)
                            }
                        }
                    }
                })
            }else{
                data.forEach((e)=>{
                    if(e.children){
                        for(let i=0;i<=e.children.length;i++){
                            sortSelectOption.push(<Option key={i.toString()}>{i}</Option>)
                        }
                    }
                })
            }
        }

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
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
                        {getFieldDecorator('pRegicode',
                            {initialValue: tagCreate === 'create' ? selectedRowData[0].regicode : selectedRowData[0].pRegicode})
                        (
                            <Input type="hidden"/>
                        )}
                        <FormItem label="行政区划编号" {...formItemLayout}>
                            {getFieldDecorator('regicode', {
                                rules: [{ required: true, message: '请输入行政区划编号' }],
                            })(
                                <Input placeholder="行政区划编号"/>
                            )}
                        </FormItem>
                        <FormItem label="行政区划名称" style={{marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('reginame', {
                                rules: [{ required: true, message: '请输入行政区划名称' }],
                            })(
                                <Input placeholder="行政区划名称"/>
                            )}
                        </FormItem>
                        <FormItem label="顺序" style={{marginTop:10}} {...formItemLayout}>
                            {getFieldDecorator('sort', {
                                rules: [{ required: false}],
                                initialValue:'0'
                            })(
                                <Select style={{width: 110 }}>
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

class RegicodeMgmt extends Component{
    state = {
        data:[],
        pagination: {pageSize:10,current:1},
        modalAddTitle: '',
        modalAddVisible: false,
        confirmLoading: false,
        selectedRows:[],
        selectedRowData:[{}],
        tagEidt:'',  //标记修改操作
        tagCreate:'',　//标记新增操作
        delete:'',  //记录删除操作
        defaultExpandedRowKeys:[] //默认展开的行
    }

    componentDidMount(){
        this.getData({...this.state.pagination})
    }
    getData = async(param) =>{
        if(this.state.delete === 'delete'){  //删除某条记录后禁用除了新增外的按钮
            this.setState({selectedRows:[]})
        }
        this.setState({confirmLoading:true})
        let result = await fetch(`${remoteHost}/region/list`,param)
        let data = transfer2tree(result,{rootId:'regi_0'})
        console.log("================")
        console.log(data)
        data.sort(this.compareUp(data,'sort'))
        data.forEach((e)=>{
            if(e.children && e.children.length>0){
                e.children.sort(this.compareUp(e.children,'sort'))
            }
        })
        this.setState({data:data,confirmLoading:false,defaultExpandedRowKeys:[data[0].regicode.toString()]})
    }
    // 升序排序
    compareUp = (arr,propertyName) => {
        if(arr[0][propertyName] != null){
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
            modalAddTitle: '新增行政区划',
            tagEidt:'',
            tagCreate:'create'
        });
        this.form.resetFields()
    }
    editRegin = () =>{
        this.setState({tagCreate:'',tagEidt:'edit'})
        this.setState({modalAddVisible: true, modalAddTitle:'修改行政区划'});
        let data = {...this.state.selectedRows[0]}
        if(!data.sort){
            data.sort = '0'
        }
        console.log("==============")
        console.log(data.sort)

        this.form.resetFields()
        this.form.setFieldsValue({...data})
    }
    deleteRegin = () =>{
        Modal.confirm({
            title: '警告',
            content: '请确认是否需要删除该行政区划?',
            onOk:  () => {
                this.setState({delete:'delete'})
                fetch(`${remoteHost}/region/remove`,{regicode:this.state.selectedRows[0].regicode})
                this.getData({...this.state.pagination})
            }
        })
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields(async(err, values) => {
            // console.log("values===="+values.reginame+values.regicode+"pcode="+values.pRegicode)
            if (err) {
                return;
            }
            this.setState({ confirmLoading:true});
            fetch(`${remoteHost}/region/saveUpdate`,{...values});
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
        this.setState({selectedRowKeys:[record.regicode.toString()]})
        this.selectRow([record])
    }

    selectRow = (row)=>{
        this.setState({selectedRows:[...row]})
        this.setState({selectedRowData:[...row]})
    }

    render(){
        const {data, modalAddTitle, modalAddVisible, confirmLoading, selectedRowKeys, pagination,
            selectedRowData,tagEidt,tagCreate,defaultExpandedRowKeys} = this.state;
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
                <Button type="primary" icon="plus" onClick={this.addRegin} disabled={this.state.selectedRows.length==0}>新增</Button>
                <Button type="primary" icon="edit" onClick={this.editRegin} disabled={this.state.selectedRows.length==0} style={{marginLeft:10}}>修改</Button>
                <Button type="danger" icon="minus" onClick={this.deleteRegin} disabled={this.state.selectedRows.length==0} style={{marginLeft:10,marginBottom:10}}>删除</Button>
                {data.length>0?<Table
                    columns={columns}
                    rowSelection={rowSelection}
                    dataSource={data}
                    rowKey ='regicode'
                    // pagination={pagination}
                    onChange={this.pageChange}
                    onRowClick={this.onRowClick}
                    // defaultExpandAllRows={true}
                    defaultExpandedRowKeys={defaultExpandedRowKeys}
                    scroll={{ x: true, y: 300 }}
                    loading={confirmLoading}
                    bordered
                />:<div><Icon type="frown-o" />暂无数据</div>}
                <ReginAddForm
                    ref={this.saveFormRef}
                    title={modalAddTitle}
                    visible={modalAddVisible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    selectedRowData={selectedRowData}
                    data={data}
                    tagEidt={tagEidt}
                    tagCreate={tagCreate}
                />
            </div>
        )
    }
}

// const getData = state =>{
//     return {data : state.regicodeMgmt.data}
// }

// module.exports = connect(getData,{getRegionData})(RegicodeMgmt)
module.exports = RegicodeMgmt