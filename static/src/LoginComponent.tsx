import React from 'react';
import { Button, DatePicker, Form, Input, message } from 'antd';
import { IScout } from '../../src/models';
import { getTokenForUser } from './Api';
import { MESSAGES, FORM_BUTTON_LAYOUT, FORM_LAYOUT } from './Constants';

export default function LoginComponent(props: any) {

    const onLogInClick = async function (formUser: IScout) {
        try {
            const token = await getTokenForUser(formUser);
            if (token) {
                props.onLogIn(token);
            } else {
                message.warn(MESSAGES.LOGIN_NOT_FOUND);
            }
        } catch (e) {
            console.error(e);
            message.error(MESSAGES.LOGIN_ERROR);
        }
    }

    return (
        <div>
            <h1>Welcome to NYLT CampHub</h1>
            <Form {...FORM_LAYOUT} onFinish={onLogInClick}>
                <Form.Item name="firstName" label="First Name" rules={[{required: true}]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item name="lastName" label="Last Name" rules={[{required: true}]}>
                    <Input size="large"/>
                </Form.Item>
                <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{required: true}]}>
                    <DatePicker format="MM/DD/YYYY" size="large"/>
                </Form.Item>
                <Form.Item {...FORM_BUTTON_LAYOUT}>
                    <Button type="primary" size="large" htmlType="submit">Log In</Button>
                </Form.Item>
            </Form>
        </div>
    );
}