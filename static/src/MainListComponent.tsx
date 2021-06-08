import { Avatar, Button, List, PageHeader, Select } from 'antd';
import React from 'react';
import { ICourse, IScout } from '../../src/models';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons'
import { SCOUT_URL, Screen } from './Constants';


export default function MainListComponent(props: any) {
    const user: IScout = props.user;
    const selectedCourse: ICourse = props.course;
    const courseList: ICourse[] = props.courses;

    const onSelectCourse = async function (courseId: string) {
        await props.onSelectCourse(courseList.find(c => c._id === courseId)!, Screen.MAIN_LIST);
    }

    return (
        <div>
            <PageHeader title={selectedCourse.unitName} onBack={props.onBack} extra={user.permissionLevel > 3 ? [
                <Select value={selectedCourse._id} onChange={onSelectCourse}>
                    {courseList.map(course => {
                        return <Select.Option value={course._id} key={course._id}>{course.unitName}</Select.Option>
                    })}
                </Select>,
                <Button onClick={props.onLoadAdmin} icon={<SettingOutlined/>}>Admin</Button>,
                <Button onClick={props.refreshMain} icon={<ReloadOutlined/>} type="primary"/>
            ] : [<Button onClick={props.refreshMain} icon={<ReloadOutlined/>} type="primary"/>]}/>
            <List itemLayout="horizontal" dataSource={selectedCourse.participants} header={`Participants (${selectedCourse.participants.length})`} renderItem={item => {
                return <List.Item key={item._id} onClick={() => {
                    if (user._id !== item._id) {
                        props.onLoadScout(item._id)
                    }
                }}>
                    <List.Item.Meta avatar={<Avatar size='large'
                                                    src={`${SCOUT_URL}/${item._id}/image`}/>}
                                    title={`${item.firstName} ${item.lastName}`} description={item.team}/>
                    {user.permissionLevel > 2 ?
                        <div>{item.evaluationsAsSubject ? item.evaluationsAsSubject.length : '0'} total
                            evaluations</div> : null}

                </List.Item>
            }}/>
            <List itemLayout="horizontal" dataSource={selectedCourse.staff} header={`Staff (${selectedCourse.staff.length})`} renderItem={(item: IScout) => {
                return <List.Item key={item._id} onClick={() => {
                    if (user._id !== item._id) {
                        props.onLoadScout(item._id)
                    }
                }}>
                    <List.Item.Meta avatar={<Avatar size='large'
                                                    src={`${SCOUT_URL}/${item._id}/image`}/>}
                                    title={`${item.firstName} ${item.lastName}`}
                                    description={`${item.position}${item.team ? ` - ${item.team}` : ''}`}/>
                    {user.permissionLevel > 2 ?
                        <div>{item.evaluationsAsAuthor ? item.evaluationsAsAuthor.length : '0'} evaluations
                            written</div> : null}
                </List.Item>
            }}/>
        </div>
    )
}