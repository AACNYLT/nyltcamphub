import { Button, Dropdown, List, Menu, PageHeader } from 'antd';
import React from 'react';
import { ICourse, IScout } from '../../src/models';

export default function MainListComponent(props: any) {
    const user: IScout = props.user;
    const course: ICourse = user.course;

    return (
        <div>
            <PageHeader title={user.course.unitName} onBack={props.onBack} extra={user.permissionLevel > 3 ? [
                <Button type="primary">Upload Data</Button>,
            ] : []}/>
            <List itemLayout="horizontal" dataSource={course.participants} header="Participants" renderItem={item => {
                return <List.Item>
                    <List.Item.Meta title={`${item.firstName} ${item.lastName}`}/>
                </List.Item>
            }}/>
            <List itemLayout="horizontal" dataSource={course.staff} header="Staff" renderItem={item => {
                return <List.Item>
                    <List.Item.Meta title={`${item.firstName} ${item.lastName}`} description="SPL - Kazoo"/>
                </List.Item>
            }}/>
        </div>
    )
}