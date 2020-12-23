import {
    Button,
    DatePicker,
    Divider,
    Form,
    Input,
    List,
    message,
    PageHeader,
    Popconfirm,
    Popover,
    Select,
    Space,
    Upload
} from 'antd';
import React from 'react';
import { ICourse } from '../../src/models';
import { createCourse, deleteCourse } from './Api';
import {
    COURSE_URL,
    DATA_UPLOAD_URL,
    DATA_URL,
    FORM_BUTTON_LAYOUT,
    FORM_LAYOUT,
    MESSAGES,
    TEMPLATE_URL
} from './Constants';
import { DeleteOutlined, DownloadOutlined, PlusOutlined, UploadOutlined, PictureOutlined } from '@ant-design/icons'

export default class AdminComponent extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = {selectedCourse: ''};

        this.uploadCsv = this.uploadCsv.bind(this);
        this.populateCourseDropdown = this.populateCourseDropdown.bind(this);
        this.populateCreateCourseForm = this.populateCreateCourseForm.bind(this);
        this.onChangeCourseDropdown = this.onChangeCourseDropdown.bind(this);
        this.onChangeFileUploadStatus = this.onChangeFileUploadStatus.bind(this);
        this.onCreateCourse = this.onCreateCourse.bind(this);
        this.onDeleteCourse = this.onDeleteCourse.bind(this);
    }

    uploadCsv() {

    }

    populateCourseDropdown(): JSX.Element[] | undefined {
        return this.props.courses.map((course: ICourse) => {
            return <Select.Option value={course._id}>{course.unitName}</Select.Option>
        });
    }

    populateCreateCourseForm(): JSX.Element {
        return (
            <Form {...FORM_LAYOUT} onFinish={this.onCreateCourse}>
                <Form.Item name='unitName' label='Unit Name' rules={[{required: true}]}>
                    <Input/>
                </Form.Item>
                <Form.Item name='startDate' label='Start Date'>
                    <DatePicker format="MM/DD/YYYY"/>
                </Form.Item>
                <Form.Item {...FORM_BUTTON_LAYOUT}>
                    <Button type="primary" htmlType="submit">Create Course</Button>
                </Form.Item>
            </Form>
        )
    }

    onChangeCourseDropdown(courseId: string) {
        this.setState({
            selectedCourse: courseId
        });
    }

    onChangeFileUploadStatus(info: any) {
        switch (info.file.status) {
            case 'done':
                message.success(MESSAGES.UPLOAD_CSV_SUCCESS);
                break;
            case 'error':
                message.error(MESSAGES.UPLOAD_CSV_ERROR);
                break;
        }
    }

    async onDeleteCourse(courseId: string) {
        try {
            await deleteCourse(courseId, this.props.token);
            this.props.refreshAdmin();
        } catch (e) {
            message.error(MESSAGES.DELETE_COURSE_ERROR);
        }
    }

    async onCreateCourse(course: ICourse) {
        try {
            await createCourse(course, this.props.token);
            this.props.refreshAdmin();
        } catch (e) {
            message.error(MESSAGES.CREATE_COURSE_ERROR);
        }
    }

    render() {
        return (
            <div>
                <PageHeader title="Admin" onBack={this.props.onBack}/>
                <Space>
                    <Select className="dropdown" onChange={this.onChangeCourseDropdown}>
                        {this.populateCourseDropdown()}
                    </Select>
                    <Upload name='file' disabled={!this.state.selectedCourse}
                            action={`${DATA_UPLOAD_URL}/${this.state.selectedCourse}`}
                            headers={{authorization: `Bearer ${this.props.token}`}}
                            onChange={this.onChangeFileUploadStatus}><Button
                        icon={<UploadOutlined/>} type='primary'>Upload CSV</Button></Upload>
                    <a href={TEMPLATE_URL} download><Button icon={<DownloadOutlined/>}>Download Template</Button></a>
                </Space>
                <Divider>Manage Courses</Divider>
                <List itemLayout="horizontal" dataSource={this.props.courses}
                      renderItem={(course: any) => {
                          return <List.Item actions={[
                              <Popconfirm
                                  title="Are you sure you want to delete this course? All scouts and evaluations belonging to this course will also be deleted."
                                  okText="Yes" cancelText="No" onConfirm={async () => {
                                  await this.onDeleteCourse(course._id);
                              }}><Button icon={<DeleteOutlined/>}/></Popconfirm>
                          ]}>
                              <List.Item.Meta title={course.unitName}
                                              description={course.startDate ? new Date(course.startDate).toDateString() : ''}/>
                          </List.Item>
                      }}/>
                <Popover content={this.populateCreateCourseForm()} trigger='click' title='Add Course'><Button
                    icon={<PlusOutlined/>}>Add
                    Course</Button></Popover>
                <Divider>Manage Data</Divider>
                <Space>
                    <a href={`${DATA_URL}?token=${this.props.token}`} download><Button type='primary'
                                                                                       icon={<DownloadOutlined/>}>Download
                        Evaluations</Button></a>
                    {this.state.selectedCourse ?
                        <a href={`${COURSE_URL}/${this.state.selectedCourse}/images?token=${this.props.token}`}
                           download><Button
                                            icon={<PictureOutlined/>}>Download
                            Images</Button></a> : null}
                </Space>
            </div>
        )
    }
}