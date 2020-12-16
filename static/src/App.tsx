import React from 'react';
import './App.css';
import LoginComponent from './LoginComponent';
import { ERROR_MESSAGES, Screen } from './Constants';
import MainListComponent from './MainListComponent';
import { getScoutForToken } from './Api';
import { Spin } from 'antd';

export default class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {token: '', loading: false, screen: Screen.LOGIN, user: {}, scout: {}};
        this.onLogIn = this.onLogIn.bind(this);
        this.onBackToLogin = this.onBackToLogin.bind(this);
    }

    async onLogIn(token: string) {
        this.setState({
            token: token,
            loading: true
        });
        try {
            const user = await getScoutForToken(token);
            this.setState({
                loading: false,
                user: user,
                screen: Screen.MAIN_LIST
            });
        } catch (e) {
            console.error(e);
            alert(ERROR_MESSAGES.LOAD_COURSE_ERROR);
        }
    }

    onBackToLogin() {
        this.setState({
            user: {},
            token: '',
            screen: Screen.LOGIN
        });
    }

    render() {
        switch (this.state.screen) {
            case Screen.LOGIN:
                return (
                    <Spin spinning={this.state.loading}><LoginComponent onLogIn={this.onLogIn}/></Spin>
                );
            case Screen.MAIN_LIST:
                return <MainListComponent onBack={this.onBackToLogin} user={this.state.user}/>;
        }
    }
}