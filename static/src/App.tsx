import React from 'react';
import './App.css';
import LoginComponent from './LoginComponent';
import { Screen } from './Constants';
import MainListComponent from './MainListComponent';

export default class App extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {token: '', screen: Screen.LOGIN};
        this.onLogIn = this.onLogIn.bind(this);
    }

    onLogIn(token: string) {
        this.setState({
            token: token,
            screen: Screen.MAIN_LIST
        });
    }

    render() {
        switch (this.state.screen) {
            case Screen.LOGIN:
                return <LoginComponent/>;
            case Screen.MAIN_LIST:
                return <MainListComponent token={this.state.token}/>;
        }
    }
}