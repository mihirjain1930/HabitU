import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router, Route, browserHistory, IndexRoute } from 'react-router';

import App from '../../client/components/App';
import Login from '../../client/components/Login';
import DashboardContainer from '../../client/components/Dashboard';
import GraphContainer from '../../client/components/Graph';

Meteor.startup( () => {
	render(
		<Router history={ browserHistory }>
			<Route path="/" component={App}>
				<IndexRoute component={DashboardContainer} />
				<Route path="login" component={Login} />
				<Route path="dashboard" component={DashboardContainer} />
				<Route path="graph" component={GraphContainer} />
			</Route>
		</Router>,
		document.getElementById('react-root')
	);
});