import React, { Component, Fragment } from 'react';
import IntlMessages from 'Util/IntlMessages';
import {
	Row,
	Card,
	CardTitle,
	Form,
	Label,
	Input,
	Button,
	UncontrolledDropdown,
	DropdownItem,
	DropdownToggle,
	DropdownMenu,
} from 'reactstrap';
import { NavLink } from 'react-router-dom';

import { Colxx } from 'Components/CustomBootstrap';

import { connect } from 'react-redux';
import { loginUser, changeLocale } from 'Redux/actions';

import { localeOptions } from 'Constants/defaultValues';

class LoginLayout extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: 'demo@gogo.com',
			password: 'gogo123',
		};
		this.locale = props.locale;
		this.handleChange = this.handleChange.bind(this);
		this.handleChangeLocale = this.handleChangeLocale.bind(this);
		console.info(props);
	}
	onUserLogin() {
		if (this.state.email !== '' && this.state.password !== '') {
			this.props.loginUser(this.state, this.props.history);
		}
	}

	handleChange(e) {
		this.setState({ [e.target.type]: e.target.value });
	}

	handleChangeLocale = locale => {
		this.props.changeLocale(locale);
	};

	componentDidMount() {
		document.body.classList.add('background');
	}
	componentWillUnmount() {
		document.body.classList.remove('background');
	}
	render() {
		return (
			<Fragment>
				<div className="fixed-background" />
				<main>
					<div className="container">
						<Row className="h-100">
							<Colxx xxs="12" md="10" className="mx-auto my-auto">
								<Card className="auth-card">
									<div className="position-relative image-side ">
										<p className="h2">
											<IntlMessages id="general.appName" />
										</p>
										<p className="">
											<IntlMessages id="user.login-message" />
											<br />
											<IntlMessages id="user.login-messageSeq" />{' '}
											<NavLink to={`/register`} className="">
												<IntlMessages id="user.login-register" />
											</NavLink>
											.
										</p>
									</div>
									<div className="form-side">
										<p style={{ 'margin-left': '70%' }}>
											<IntlMessages id="general.change-locale" />
										</p>
										<UncontrolledDropdown
											className=""
											style={{ 'margin-left': '85%' }}
										>
											<DropdownToggle
												caret
												color="light"
												size="sm"
												className="language-button"
											>
												<span className="name">
													{this.props.locale.toUpperCase()}
												</span>
											</DropdownToggle>
											<DropdownMenu className="mt-3" right>
												{localeOptions.map(l => {
													return (
														<DropdownItem
															onClick={() => this.handleChangeLocale(l.id)}
															key={l.id}
														>
															{l.name}
														</DropdownItem>
													);
												})}
											</DropdownMenu>
										</UncontrolledDropdown>
										<NavLink to={`/`} className="white">
											<span className="logo-single" />
										</NavLink>
										<CardTitle className="mb-4">
											<IntlMessages id="user.login-title" />
										</CardTitle>
										<Form>
											<Label className="form-group has-float-label mb-4">
												<Input
													type="email"
													defaultValue={this.state.email}
													onChange={this.handleChange}
												/>
												<IntlMessages id="user.email" />
											</Label>
											<Label className="form-group has-float-label mb-4">
												<Input type="password" onChange={this.handleChange} />
												<IntlMessages
													id="user.password"
													defaultValue={this.state.password}
												/>
											</Label>
											<div className="d-flex justify-content-between align-items-center">
												<NavLink to={`/forgot-password`}>
													<IntlMessages id="user.forgot-password-question" />
												</NavLink>
												<Button
													color="primary"
													className="btn-shadow"
													size="lg"
													onClick={() => this.onUserLogin()}
												>
													<IntlMessages id="user.login-button" />
												</Button>
											</div>
										</Form>
									</div>
								</Card>
							</Colxx>
						</Row>
					</div>
				</main>
			</Fragment>
		);
	}
}
const mapStateToProps = ({ authUser, settings }) => {
	const { user, loading } = authUser;
	const { locale } = settings;
	return { user, loading, locale };
};

export default connect(
	mapStateToProps,
	{
		loginUser,
		changeLocale,
	},
)(LoginLayout);
