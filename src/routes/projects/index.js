import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import list from './list';

export default ({ match }) => (
	<Switch>
		<Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
		<Route path={`${match.url}/list`} component={list} />
		<Redirect to="/error" />
	</Switch>
);
