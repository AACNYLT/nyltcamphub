import React from 'react';
import './App.css';
import LoginComponent from './LoginComponent';
import { MESSAGES, Screen } from './Constants';
import MainListComponent from './MainListComponent';
import { getAllCourses, getScoutForToken } from './Api';
import { message, Spin } from 'antd';
import AdminComponent from './AdminComponent';

export default class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {token: '', loading: false, screen: Screen.LOGIN, user: {}, scout: {}, allcourses: []};
        this.onLogIn = this.onLogIn.bind(this);
        this.onLoadAdmin = this.onLoadAdmin.bind(this);
        this.onLoadMain = this.onLoadMain.bind(this);
        this.onBackToLogin = this.onBackToLogin.bind(this);
        this.onBackToMain = this.onBackToMain.bind(this);
    }

    async onLogIn(token: string) {
        this.setState({
            token: token
        });
        await this.onLoadMain();
    }

    async onLoadMain() {
        this.setState({
            loading: true
        });
        try {
            const user = await getScoutForToken(this.state.token);
            this.setState({
                loading: false,
                user: user,
                screen: Screen.MAIN_LIST
            });
        } catch (e) {
            console.error(e);
            message.error(MESSAGES.LOAD_COURSE_ERROR);
            this.setState({
                loading: false
            });
        }
    }

    async onLoadAdmin() {
        this.setState({
            loading: true
        });
        try {
            const courses = await getAllCourses(this.state.token);
            this.setState({
                courses: courses,
                loading: false,
                screen: Screen.ADMIN
            });
        } catch (e) {
            console.error(e);
            message.error(MESSAGES.LOAD_ALL_COURSES_ERROR);
            this.setState({
                loading: false
            });
        }
    }

    onBackToLogin() {
        this.setState({
            user: {},
            token: '',
            screen: Screen.LOGIN
        });
    }

    onBackToMain() {
        this.setState({
            screen: Screen.MAIN_LIST
        });
    }

    render() {
        switch (this.state.screen) {
            case Screen.LOGIN:
                return (
                    <Spin spinning={this.state.loading}><LoginComponent onLogIn={this.onLogIn}/></Spin>
                );
            case Screen.MAIN_LIST:
                return <Spin spinning={this.state.loading}><MainListComponent onBack={this.onBackToLogin}
                                                                              onLoadAdmin={this.onLoadAdmin}
                                                                              refreshMain={this.onLoadMain}
                                                                              user={this.state.user}/></Spin>;
            case Screen.ADMIN:
                return <Spin spinning={this.state.loading}><AdminComponent onBack={this.onBackToMain}
                                                                           courses={this.state.courses}
                                                                           refreshAdmin={this.onLoadAdmin}
                                                                           token={this.state.token}/></Spin>
        }
    }
}