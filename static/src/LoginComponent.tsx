import React from 'react';
import { Button, DatePicker, Form, Input } from 'antd';
import { IScout } from '../../src/models';
import { getTokenForUser } from './Api';
import { ERROR_MESSAGES } from './Constants';

export default function LoginComponent(props: any) {

    const onLogInClick = async function (formUser: IScout) {
        try {
            const token = await getTokenForUser(formUser);
            if (token) {
                props.logIn(token);
            } else {
                alert(ERROR_MESSAGES.LOGIN_NOT_FOUND);
            }
        } catch (e) {
            console.error(e);
            alert(ERROR_MESSAGES.LOGIN_ERROR);
        }
    }

    const layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16},
    };
    const tailLayout = {
        wrapperCol: {offset: 8, span: 16},
    };

    return (
        <div>
            <h1>Welcome to NYLT CampHub</h1>
            <Form {...layout} onFinish={onLogInClick}>
                <Form.Item name="firstName" label="First Name" rules={[{required: true}]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item name="lastName" label="Last Name" rules={[{required: true}]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{required: true}]}>
                    <DatePicker format="MM/DD/YYYY" size="large"/>
                </Form.Item>
                <Form.Item {...tailLayout}>
                    <Button type="primary" size="large" htmlType="submit">Log In</Button>
                </Form.Item>
            </Form>
        </div>
    );
}