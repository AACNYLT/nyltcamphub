import {
    Button,
    Card,
    DatePicker,
    Divider,
    Form,
    Input,
    List,
    message,
    PageHeader,
    Popconfirm,
    Popover,
    Row,
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
    MESSAGES, Screen,
    TEMPLATE_URL
} from './Constants';
import { DeleteOutlined, DownloadOutlined, PlusOutlined, UploadOutlined, PictureOutlined } from '@ant-design/icons'

export default function AdminComponent(props: any) {
    const populateCourseDropdown = function (): JSX.Element[] | undefined {
        return props.courses.map((course: ICourse) => {
            return <Select.Option value={course._id}>{course.unitName}</Select.Option>
        });
    }

    const populateCreateCourseForm = function (): JSX.Element {
        return (
            <Form {...FORM_LAYOUT} onFinish={onCreateCourse}>
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

    const onChangeCourseDropdown = async function (courseId: string) {
        await props.onSelectCourse(props.courses.find((c: ICourse) => c._id === courseId)!, Screen.ADMIN);
    }

    const onChangeFileUploadStatus = function (info: any) {
        switch (info.file.status) {
            case 'done':
                message.success(MESSAGES.UPLOAD_CSV_SUCCESS);
                break;
            case 'error':
                message.error(MESSAGES.UPLOAD_CSV_ERROR);
                break;
        }
    }

    const onDeleteCourse = async function (courseId: string) {
        try {
            await deleteCourse(courseId, props.token);
            props.refreshAdmin();
        } catch (e) {
            message.error(MESSAGES.DELETE_COURSE_ERROR);
        }
    }

    const onCreateCourse = async function (course: ICourse) {
        try {
            await createCourse(course, props.token);
            props.refreshAdmin();
        } catch (e) {
            message.error(MESSAGES.CREATE_COURSE_ERROR);
        }
    }

    return (
        <div>
            <PageHeader title="Admin" onBack={props.onBack}
                        extra={[<Select className="dropdown" value={props.selectedCourse._id}
                                        onChange={onChangeCourseDropdown}>
                            {populateCourseDropdown()}
                        </Select>]}/>
            <Divider>Manage {props.selectedCourse.unitName}</Divider>
            <Space><Card title='Course Uploads' size='small'>
                <Space>
                    <Upload name='file'
                            action={`${DATA_UPLOAD_URL}/${props.selectedCourse._id}`}
                            headers={{authorization: `Bearer ${props.token}`}}
                            onChange={onChangeFileUploadStatus}><Button
                        icon={<UploadOutlined/>} type='primary'>Upload CSV</Button></Upload>
                    <a href={TEMPLATE_URL} download><Button icon={<DownloadOutlined/>}>Download Template</Button></a>
                </Space>
            </Card>
                <Card title='Course Downloads' size='small'>
                    <Space>
                        <a href={`${DATA_URL}?token=${props.token}`} download><Button type='primary'
                                                                                      icon={<DownloadOutlined/>}>Download
                            Evaluations</Button></a>
                        <a href={`${COURSE_URL}/${props.selectedCourse._id}/images?token=${props.token}`}
                           download><Button
                            icon={<PictureOutlined/>}>Download
                            Images</Button></a>
                    </Space>
                </Card></Space>
            <Divider>Manage All Courses</Divider>
            <List itemLayout="horizontal" dataSource={props.courses}
                  renderItem={(course: any) => {
                      return <List.Item actions={[
                          <Popconfirm
                              title="Are you sure you want to delete this course? All scouts and evaluations belonging to this course will also be deleted."
                              okText="Yes" cancelText="No" onConfirm={async () => {
                              await onDeleteCourse(course._id);
                          }}><Button icon={<DeleteOutlined/>}/></Popconfirm>
                      ]}>
                          <List.Item.Meta title={course.unitName}
                                          description={course.startDate ? new Date(course.startDate).toDateString() : ''}/>
                      </List.Item>
                  }}/>
            <Popover content={populateCreateCourseForm()} trigger='click' title='Add Course'><Button
                icon={<PlusOutlined/>}>Add
                Course</Button></Popover>
        </div>
    )

}