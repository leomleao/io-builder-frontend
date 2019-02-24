import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import edit from './edit';
import list from './list';

const Applications = ({ match }) => (
	<div className="dashboard-wrapper">
		<Switch>
			<Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
			<Route path={`${match.url}/edit`} component={edit} />
			<Route path={`${match.url}/list`} component={list} />
			<Redirect to="/error" />
		</Switch>
	</div>
);

export default Applications;
