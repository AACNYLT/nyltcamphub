import { Avatar, Button, List, PageHeader } from 'antd';
import React from 'react';
import { ICourse, IScout } from '../../src/models';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons'
import { SCOUT_URL } from './Constants';


export default function MainListComponent(props: any) {
    const user: IScout = props.user;
    const course: ICourse = user.course;

    return (
        <div>
            <PageHeader title={user.course.unitName} onBack={props.onBack} extra={user.permissionLevel > 3 ? [
                <Button onClick={props.onLoadAdmin} icon={<SettingOutlined/>}>Admin</Button>,
                <Button onClick={props.refreshMain} icon={<ReloadOutlined/>} type="primary"/>
            ] : [<Button onClick={props.refreshMain} icon={<ReloadOutlined/>} type="primary"/>]}/>
            <List itemLayout="horizontal" dataSource={course.participants} header="Participants" renderItem={item => {
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
            <List itemLayout="horizontal" dataSource={course.staff} header="Staff" renderItem={(item: IScout) => {
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