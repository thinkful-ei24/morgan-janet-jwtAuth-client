import React from 'react';
import {connect} from 'react-redux';
import TimeoutModal from './timeout-modal';

import {clearAuth} from '../actions/auth';
import {clearAuthToken} from '../local-storage';

export class HeaderBar extends React.Component {
    logOut() {
        this.props.dispatch(clearAuth());
        clearAuthToken();
    }

    render() {
        // Only render the log out button if we are logged in
        let logOutButton;
        if (this.props.loggedIn) {
            logOutButton = (
                <button onClick={() => this.logOut()}>Log out</button>
                );
            }
            return (
            <div className="header-bar">
                {this.props.inactiveUser && <TimeoutModal />}
                <h1>Foo App</h1>
                {logOutButton}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loggedIn: state.auth.currentUser !== null,
    inactiveUser: state.auth.inactiveUser
});

export default connect(mapStateToProps)(HeaderBar);
