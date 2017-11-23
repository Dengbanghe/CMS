import React from 'react'
import {connect} from 'react-redux'
import {Table, Button, Form, Modal, Input, Checkbox} from 'antd'
import {fetch, remoteHost} from '../util/common'
const FormItem = Form.Item
const ButtonGrid = Button.Group
const confirm = Modal.confirm

const RoleForm = Form.create()(
    (props) => {
        const {getFieldDecorator} = props.form
        const {modalVisible, modalTitle, checkBoxState, checkBoxOnChange, onCancel, onCreate} = props
        return (
            <Modal
                visible={modalVisible}
                title={modalTitle}
                okText="保存"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <div>
                    <Form>
                        {getFieldDecorator('guid')(
                            <Input type='hidden'/>
                        )}
                        <FormItem label='角色名称'>
                            {getFieldDecorator('rolename')(
                                <Input/>
                            )}
                        </FormItem>
                        <FormItem label="启用状态">
                            {getFieldDecorator('enable')(
                                <Checkbox
                                    checkedChildren="启用"
                                    unCheckedChildren="禁用"
                                    checked={checkBoxState}
                                    onChange={checkBoxOnChange}
                                    // disabled={disabled}
                                >{checkBoxState == true ? '启用' : '禁用'}</Checkbox>
                            )}
                        </FormItem>
                        <FormItem label='备注'>
                            {getFieldDecorator('remark')(
                                <Input type='textarea'/>
                            )}
                        </FormItem>
                    </Form>
                </div>
            </Modal>
        )
    }
)


const columns = [{
    title: '角色名称',
    dataIndex: 'rolename',
    width: 150
}, {
    title: '状态',
    dataIndex: 'enable',
    width: 150,
    render: text => text == 1 ? '启用' : '禁用'
}, {
    title: '创建时间',
    dataIndex: 'addtime',
    width: 150
}, {
    title: '备注',
    dataIndex: 'remark',
    width: 400,
}];
class Role extends React.Component {
    state = {
        data: [],
        loading: false,
        modalVisible: false,
        modalTitle: '',
        selectedRows: [],
        formData: {},
        confirmLoading: false,
        checkBoxState: false,
    }

    componentDidMount() {
        this.getData()
    }

    getData = async (param) => {
        this.setState({loading: true})
        let data = await fetch(`${remoteHost}/role/list`, param)
        this.setState({data: data, loading: false})
    }
    getForm = form => {
        this.form = form
    }

    add = () => {
        this.setState({modalVisible: true, modalTitle: '新增角色'})
        this.form.resetFields()
    }
    edit = () => {
        this.setState({modalVisible: true, modalTitle: '修改角色'})
        const rowData = this.state.selectedRows[0]
        this.setState({checkBoxState: rowData.enable == 1})
        this.form.setFieldsValue({...rowData})

    }
    remov = () => {
        confirm({
            title: '警告',
            content: '请确认是否需要删除该角色?',
            onOk: async () => {
                let result = await fetch(`${remoteHost}/role/remove`, {guid: this.state.selectedRows[0].guid})

            }
        })
    }
    selectRow = (selectedRows) => {
        this.setState({selectedRows: selectedRows})
    }
    handleCancel = () => {
        this.setState({modalVisible: false});
    }
    checkBoxOnChange = e => {
        this.setState({
            checkBoxState: e.target.checked
        });
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields(async (err, values) => {
            // values.date = values.date.format("YYYY-MM-DD")
            if (err) {
                return;
            }
            this.setState({confirmLoading: true});
            fetch(`${remoteHost}/user/saveUpdate`, values)
            form.resetFields();
            this.setState({modalVisible: false, confirmLoading: false});
        });
    }
    onRowClick = (record, index) => {
        this.setState({selectedRowKeys: record.guid + ''})
        this.selectRow([record])
    }

    render() {
        const {data, loading, modalVisible, modalTitle, checkBoxState, selectedRowKeys, selectedRows} = this.state
        const rowSelection = {
            selectedRowKeys,
            type: 'radio',
            onChange: (selectedRowKeys, selectedRows) => {
                this.setState({selectedRowKeys})
                this.selectRow(selectedRows)
            }
        }
        return (<div>
            <ButtonGrid size="large" style={{marginBottom: 10}}>
                <Button
                    type='primary'
                    onClick={this.add}
                >新增</Button>
                <Button
                    type={selectedRows.length == 0 ? 'default' : 'primary'}
                    disabled={selectedRows.length == 0}
                    onClick={this.edit}
                >修改</Button>
                <Button type="danger"
                        disabled={selectedRows.length == 0}
                        onClick={this.remov}>删除</Button>
            </ButtonGrid>
            <Table
                rowKey='guid'
                loading={loading}
                dataSource={data}
                columns={columns}
                rowSelection={rowSelection}
                onRowClick={this.onRowClick}
            />
            <RoleForm
                ref={this.getForm}
                modalVisible={modalVisible}
                modalTitle={modalTitle}
                checkBoxOnChange={this.checkBoxOnChange}
                checkBoxState={checkBoxState}
                onCancel={this.handleCancel}
                onCreate={this.handleCreate}
            />
        </div>)
    }
}

module.exports = connect()(Role)