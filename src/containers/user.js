import React, { Component } from 'react' // 引入React
import { connect } from 'react-redux'
import { Table ,Button, Modal, Form, Input  } from 'antd'
import fetch from 'isomorphic-fetch'
const FormItem = Form.Item;

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    render: text => <a href="#">{text}</a>,
}, {
    title: 'Age',
    dataIndex: 'age',
}, {
    title: 'Address',
    dataIndex: 'address',
}];

const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
}, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
}, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
}, {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
}];

const CollectionCreateForm = Form.create()(
    (props) => {
        const { visible, onCancel, onCreate, form ,title} = props;
        const { getFieldDecorator } = form;

        return (
            <Modal
                visible={visible}
                title={title}
                okText="保存"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">
                    <FormItem label="Title">
                        {getFieldDecorator('title', {
                            rules: [{ required: true, message: 'Please input the title of collection!' }],
                        })(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="Description">
                        {getFieldDecorator('description')(<Input type="textarea" />)}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);



class User extends Component{
    state = {
        data:[],
        loading:false,
        modalVisible:false,
        checkedRows:["1"]
    }
    async componentDidMount(){
        this.setState({data:data})
        //todo remote data
    }

    rowSelection = {
        selectedRowKeys,
        type : 'radio',
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        onSelect: (record, selected, selectedRows) => {
            console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            console.log(selected, selectedRows, changeRows);
        },
        getCheckboxProps: record => ({
            checked: record.name  === 'Disabled User',    // Column configuration not to be checked
        }),
        // selectedRowKeys : [...this.state.checkedRows]
    };
    saveFormRef = (form) =>{
        this.form =form
    }
    showModal = () => {
        this.setState({ modalVisible: true });
    }
    handleCancel = () => {
        this.setState({ modalVisible: false });
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);
            form.resetFields();
            this.setState({ modalVisible: false });
        });
    }

    onRowClick = function(record,index){
        console.log(this)
    this.setState({checkedRows:["2"]})
}

    render(){
        const {loading,modalVisible} = this.state;
        // const {data} = this.props
        return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <Button type="primary"  onClick={this.showModal}>新增</Button>
            </div>
            <Table
                columns={columns}
                rowSelection={this.rowSelection}
                dataSource={data}
                onRowClick={this.onRowClick.bind(this)}
                 />
            <CollectionCreateForm
                ref={this.saveFormRef}
                visible={modalVisible}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
            />
        </div>

        )
    }
}

module.exports = connect()(User)
