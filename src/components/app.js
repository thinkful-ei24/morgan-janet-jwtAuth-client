import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';
import HeaderBar from './header-bar';
import LandingPage from './landing-page';
import Dashboard from './dashboard';
import RegistrationPage from './registration-page';
import {refreshAuthToken, clearAuth, userIsActive, userIsInactive} from '../actions/auth';

export class App extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.loggedIn) {
            this.refreshInactivityTimeout();
        }
        if (!prevProps.loggedIn && this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
        } else if (prevProps.loggedIn && !this.props.loggedIn) {
            // Stop refreshing when we log out
            this.stopPeriodicRefresh();
        }
    }

    componentWillUnmount() {
        this.stopPeriodicRefresh();
    }

    refreshInactivityTimeout() {
        this.props.dispatch(userIsActive());
        // Set a warning modal after a set interval of inactivity
        clearTimeout(this.timeoutWarningCountdown);
        this.timeoutWarningCountdown = setTimeout(
            () => this.props.dispatch(userIsInactive()),
            4 * 60 * 1000 // 4 minutes
            )
        // Logout after a set interval of inactivity
        clearTimeout(this.timeoutCountdown);
        this.timeoutCountdown = setTimeout(
            () => this.props.dispatch(clearAuth()),
            5 * 60 * 1000 // 5 minutes
        )
    }

    startPeriodicRefresh() {
        this.refreshInterval = setInterval(
            () => this.props.dispatch(refreshAuthToken()),
            15 * 60 * 1000 // 15 minutes
        );
    }

    stopPeriodicRefresh() {
        if (!this.refreshInterval) {
            return;
        }

        clearInterval(this.refreshInterval);
    }

    render() {
        return (
            <div className="app">
                <HeaderBar />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/register" component={RegistrationPage} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    hasAuthToken: state.auth.authToken !== null,
    loggedIn: state.auth.currentUser !== null
});

// Deal with update blocking - https://reacttraining.com/react-router/web/guides/dealing-with-update-blocking
export default withRouter(connect(mapStateToProps)(App));
