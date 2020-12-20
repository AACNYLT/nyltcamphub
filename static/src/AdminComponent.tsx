import { Button, Divider, List, message, Modal, PageHeader, Popconfirm, Select, Upload } from 'antd';
import React from 'react';
import { ICourse } from '../../src/models';
import { deleteCourse } from './Api';
import { DATA_UPLOAD_URL, MESSAGES } from './Constants';
import { UploadOutlined } from '@ant-design/icons'

export default class AdminComponent extends React.Component<any, any> {
    private courses: ICourse[] | null = null;

    constructor(props: any) {
        super(props);
        this.courses = props.courses;

        this.state = {selectedCourse: ''};

        this.uploadCsv = this.uploadCsv.bind(this);
        this.populateCourseDropdown = this.populateCourseDropdown.bind(this);
        this.onChangeCourseDropdown = this.onChangeCourseDropdown.bind(this);
        this.onChangeFileUploadStatus = this.onChangeFileUploadStatus.bind(this);
        this.onDeleteCourse = this.onDeleteCourse.bind(this);
    }

    uploadCsv() {

    }

    populateCourseDropdown(): JSX.Element[] | undefined {
        return this.courses?.map(course => {
            return <Select.Option value={course._id}>{course.unitName}</Select.Option>
        });
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

    }

    render() {
        return (
            <div>
                <PageHeader title="Admin" onBack={this.props.onBack}/>
                <Select className="dropdown" onChange={this.onChangeCourseDropdown}>
                    {this.populateCourseDropdown()}
                </Select>
                <Upload name='file' action={`${DATA_UPLOAD_URL}/${this.state.selectedCourse}`}
                        headers={{authorization: `Bearer ${this.props.token}`}}
                        onChange={this.onChangeFileUploadStatus}><Button
                    icon={<UploadOutlined/>}>Upload CSV</Button></Upload>
                <Divider>Manage Courses</Divider>
                <List itemLayout="horizontal" dataSource={this.props.courses}
                      renderItem={(course: any) => {
                          return <List.Item actions={[
                              <Popconfirm
                                  title="Are you sure you want to delete this course? All scouts and evaluations belonging to this course will also be deleted."
                                  okText="Yes" cancelText="No" onConfirm={async () => {
                                  await this.onDeleteCourse(course._id);
                              }}><Button>Delete</Button></Popconfirm>
                          ]}>
                              <List.Item.Meta title={course.unitName} description={course.startDate}/>
                          </List.Item>
                      }}/>
            </div>
        )
    }
}