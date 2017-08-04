import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { browserHistory } from 'react-router'
import { createContainer } from 'meteor/react-meteor-data';

injectTapEventPlugin();

import '../css/reset.scss';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import '../../../node_modules/flexboxgrid/css/flexboxgrid.min.css';
import '../css/style.scss';
import {Loading} from './Loading';

class AppTemplate extends Component {
	render() {
		return (
			<MuiThemeProvider>
				{this.props.loading ? Loading : <AppTemplatePostLoading {...this.props} /> }
			</MuiThemeProvider>
		);
	}
}

class AppTemplatePostLoading extends Component {
	componentDidMount(){
		const currentLocation = browserHistory.getCurrentLocation().pathname;

		if (currentLocation !== '/login' && !Meteor.user()){
			browserHistory.push('/login');
		}
	}

	render(){
		return (
			<div>
				{this.props.children}
			</div>
		);
	}
}

export default App = createContainer(() => {
	const usersHandle = Meteor.subscribe('users');
	const loading = !usersHandle.ready();

	return {
		usersHandle,
		loading
	};
}, AppTemplate);