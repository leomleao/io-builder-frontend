import React, { Component, Fragment } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import {
	Row,
	Card,
	CustomInput,
	Button,
	ButtonDropdown,
	UncontrolledDropdown,
	Collapse,
	DropdownMenu,
	DropdownToggle,
	DropdownItem,
	Input,
	CardBody,
	CardSubtitle,
	CardImg,
	Label,
	CardText,
	Badge,
	FormGroup,
	CardTitle,
	Form,
	FormText,
} from 'reactstrap';
// import Autosuggest from 'react-autosuggest';
// import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
// import AutosuggestHighlightParse from 'autosuggest-highlight/parse';

import ReactAutosuggest from 'Components/ReactAutosuggest';

import { NavLink } from 'react-router-dom';
import Select from 'react-select';
import CustomSelectInput from 'Components/CustomSelectInput';
import classnames from 'classnames';

import IntlMessages from 'Util/IntlMessages';
import { Colxx, Separator } from 'Components/CustomBootstrap';
import { BreadcrumbItems } from 'Components/BreadcrumbContainer';

import Pagination from 'Components/List/Pagination';
import mouseTrap from 'react-mousetrap';
import axios from 'axios';

import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

import { firestoreConnect } from 'react-redux-firebase';
import { compose } from 'redux';

import { addProject, getMaterial } from 'Redux/actions';
import { carriers, materials } from '../../../data/currentDB.json';

import uuid from 'uuid/v4';

function collect(props) {
	return { data: props.data };
}
const apiUrl = 'http://api.crealeaf.com/cakes/paging';

class DataListLayout extends Component {
	constructor(props) {
		super(props);
		this.toggleDisplayOptions = this.toggleDisplayOptions.bind(this);
		this.toggleSplit = this.toggleSplit.bind(this);
		this.dataListRender = this.dataListRender.bind(this);
		this.getIndex = this.getIndex.bind(this);
		this.onContextMenuClick = this.onContextMenuClick.bind(this);

		this.state = {
			displayMode: 'list',
			pageSizes: [10, 20, 30, 50, 100],
			selectedPageSize: 10,
			categories: [
				{ label: 'Cakes', value: 'Cakes', key: 0 },
				{ label: 'Cupcakes', value: 'Cupcakes', key: 1 },
				{ label: 'Desserts', value: 'Desserts', key: 2 },
			],
			orderOptions: [
				{ column: 'title', label: 'Product Name' },
				{ column: 'category', label: 'Category' },
				{ column: 'status', label: 'Status' },
			],
			selectedOrderOption: { column: 'title', label: 'Product Name' },
			dropdownSplitOpen: false,
			currentPage: 1,
			totalItemCount: 0,
			totalPage: 1,
			search: '',
			selectedItems: [],
			lastChecked: null,
			displayOptionsIsOpen: false,
			isLoading: false,
			items: [],
			materials: [],
			newMaterial: null,
		};
	}
	componentWillMount() {
		this.props.bindShortcut(['ctrl+a', 'command+a'], () =>
			this.handleChangeSelectAll(false),
		);
		this.props.bindShortcut(['ctrl+d', 'command+d'], () => {
			this.setState({
				selectedItems: [],
			});
			return false;
		});
	}
	toggleDisplayOptions() {
		this.setState({ displayOptionsIsOpen: !this.state.displayOptionsIsOpen });
	}
	toggleSplit() {
		this.setState(prevState => ({
			dropdownSplitOpen: !prevState.dropdownSplitOpen,
		}));
	}
	changeOrderBy(column) {
		this.setState(
			{
				selectedOrderOption: this.state.orderOptions.find(
					x => x.column === column,
				),
			},
			() => this.dataListRender(),
		);
	}
	changePageSize(size) {
		this.setState(
			{
				selectedPageSize: size,
				currentPage: 1,
			},
			() => this.dataListRender(),
		);
	}
	changeDisplayMode(mode) {
		this.setState({
			displayMode: mode,
		});
		return false;
	}
	onChangePage(page) {
		this.setState(
			{
				currentPage: page,
			},
			() => this.dataListRender(),
		);
	}

	handleKeyPress(e) {
		if (e.key === 'Enter') {
			this.setState(
				{
					search: e.target.value.toLowerCase(),
				},
				() => this.dataListRender(),
			);
		}
	}

	handleCheckChange(event, id) {
		if (
			event.target.tagName === 'A' ||
			(event.target.parentElement && event.target.parentElement.tagName === 'A')
		) {
			return true;
		}
		if (this.state.lastChecked == null) {
			this.setState({
				lastChecked: id,
			});
		}

		let selectedItems = this.state.selectedItems;
		if (selectedItems.includes(id)) {
			selectedItems = selectedItems.filter(x => x !== id);
		} else {
			selectedItems.push(id);
		}
		this.setState({
			selectedItems,
		});

		if (event.shiftKey) {
			var items = this.state.items;
			var start = this.getIndex(id, items, 'id');
			var end = this.getIndex(this.state.lastChecked, items, 'id');
			items = items.slice(Math.min(start, end), Math.max(start, end) + 1);
			selectedItems.push(
				...items.map(item => {
					return item.id;
				}),
			);
			selectedItems = Array.from(new Set(selectedItems));
			this.setState({
				selectedItems,
			});
		}
		document.activeElement.blur();
	}

	getIndex(value, arr, prop) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][prop] === value) {
				return i;
			}
		}
		return -1;
	}
	handleChangeSelectAll(isToggle) {
		if (this.state.selectedItems.length >= this.state.items.length) {
			if (isToggle) {
				this.setState({
					selectedItems: [],
				});
			}
		} else {
			this.setState({
				selectedItems: this.state.items.map(x => x.id),
			});
		}
		document.activeElement.blur();
		return false;
	}
	componentDidMount() {
		this.dataListRender();
		this.props.addProject(this.props.user);
	}

	dataListRender() {
		const {
			selectedPageSize,
			currentPage,
			selectedOrderOption,
			search,
		} = this.state;
		axios
			.get(
				`${apiUrl}?pageSize=${selectedPageSize}&currentPage=${currentPage}&orderBy=${
					selectedOrderOption.column
				}&search=${search}`,
			)
			.then(res => {
				return res.data;
			})
			.then(data => {
				this.setState({
					totalPage: data.totalPage,
					items: data.data,
					selectedItems: [],
					totalItemCount: data.totalItem,
					isLoading: true,
				});
			});
	}

	onContextMenuClick = (e, data, target) => {
		console.log(
			'onContextMenuClick - selected items',
			this.state.selectedItems,
		);
		console.log('onContextMenuClick - action : ', data.action);
	};

	onContextMenu = (e, data) => {
		const clickedProductId = data.data;
		if (!this.state.selectedItems.includes(clickedProductId)) {
			this.setState({
				selectedItems: [clickedProductId],
			});
		}

		return true;
	};

	onSuggestionChange = (event, { newValue }) => {
		console.info(newValue);
		this.setState({
			suggestionValue: newValue,
		});
	};

	render() {
		const { projects, loading, error, newProject } = this.props.projectApp;
		const { material } = this.props.materials;
		const startIndex =
			(this.state.currentPage - 1) * this.state.selectedPageSize;
		const endIndex = this.state.currentPage * this.state.selectedPageSize;
		const { messages } = this.props.intl;
		return (
			<Fragment>
				<div className="disable-text-selection">
					<Row>
						<Colxx xxs="12">
							<div className="mb-2">
								<h1>
									<IntlMessages id="menu.new" />
								</h1>
								<BreadcrumbItems match={this.props.match} />
							</div>

							<div className="mb-8">
								<Button
									color="empty"
									className="pt-0 pl-0 d-inline-block d-md-none"
									onClick={this.toggleDisplayOptions}
								>
									<IntlMessages id="layouts.display-options" />{' '}
									<i className="simple-icon-arrow-down align-middle" />
								</Button>
								<Collapse
									isOpen={this.state.displayOptionsIsOpen}
									className="d-md-block"
									id="displayOptions"
								>
									<span className="mr-3 mb-2 d-inline-block float-md-left">
										<a
											className={`mr-2 view-icon ${
												this.state.displayMode === 'list' ? 'active' : ''
											}`}
											onClick={() => this.changeDisplayMode('list')}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 19 19"
											>
												<path
													className="view-icon-svg"
													d="M17.5,3H.5a.5.5,0,0,1,0-1h17a.5.5,0,0,1,0,1Z"
												/>
												<path
													className="view-icon-svg"
													d="M17.5,10H.5a.5.5,0,0,1,0-1h17a.5.5,0,0,1,0,1Z"
												/>
												<path
													className="view-icon-svg"
													d="M17.5,17H.5a.5.5,0,0,1,0-1h17a.5.5,0,0,1,0,1Z"
												/>
											</svg>
										</a>
										<a
											className={`mr-2 view-icon ${
												this.state.displayMode === 'thumblist' ? 'active' : ''
											}`}
											onClick={() => this.changeDisplayMode('thumblist')}
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 19 19"
											>
												<path
													className="view-icon-svg"
													d="M17.5,3H6.5a.5.5,0,0,1,0-1h11a.5.5,0,0,1,0,1Z"
												/>
												<path
													className="view-icon-svg"
													d="M3,2V3H1V2H3m.12-1H.88A.87.87,0,0,0,0,1.88V3.12A.87.87,0,0,0,.88,4H3.12A.87.87,0,0,0,4,3.12V1.88A.87.87,0,0,0,3.12,1Z"
												/>
												<path
													className="view-icon-svg"
													d="M3,9v1H1V9H3m.12-1H.88A.87.87,0,0,0,0,8.88v1.24A.87.87,0,0,0,.88,11H3.12A.87.87,0,0,0,4,10.12V8.88A.87.87,0,0,0,3.12,8Z"
												/>
												<path
													className="view-icon-svg"
													d="M3,16v1H1V16H3m.12-1H.88a.87.87,0,0,0-.88.88v1.24A.87.87,0,0,0,.88,18H3.12A.87.87,0,0,0,4,17.12V15.88A.87.87,0,0,0,3.12,15Z"
												/>
												<path
													className="view-icon-svg"
													d="M17.5,10H6.5a.5.5,0,0,1,0-1h11a.5.5,0,0,1,0,1Z"
												/>
												<path
													className="view-icon-svg"
													d="M17.5,17H6.5a.5.5,0,0,1,0-1h11a.5.5,0,0,1,0,1Z"
												/>
											</svg>
										</a>
									</span>

									<div className="d-block d-md-inline-block">
										<div className="search-sm d-inline-block float-md-left mr-1 mb-1 align-top">
											<input
												type="text"
												name="keyword"
												id="search"
												placeholder={messages['menu.search']}
												onKeyPress={e => this.handleKeyPress(e)}
											/>
										</div>
									</div>
								</Collapse>
							</div>
							<FormGroup row />
							<Separator className="mb-5" />
						</Colxx>
					</Row>
					<Row className="mb-4">
						<Colxx xxs="12">
							<Card>
								<CardBody>
									<CardTitle>
										<IntlMessages id="project-basic-data" />
									</CardTitle>
									<FormGroup row>
										<Colxx sm={6}>
											<FormGroup>
												<Label for="carrierArticle">
													<IntlMessages id="project-carrier-article" />
												</Label>
												{loading ? (
													<ReactAutosuggest
														className="float-md-left"
														id="carrierArticle"
														placeholder={
															newProject.carrier.articleNo ||
															messages['project-missing-carrier-article']
														}
														getField="materialId"
														data={carriers}
														autocomplete="off"
														onChange={value => {
															console.info(value);
														}}
													/>
												) : (
													<div />
												)}
											</FormGroup>
										</Colxx>
									</FormGroup>
									<FormGroup row>
										<Colxx sm={6}>
											<FormGroup>
												<Label for="projectName">
													<IntlMessages id="project-label-name" />
												</Label>
												<Input
													type="text"
													name="projectName"
													id="projectName"
													placeholder={messages['project-placeholder-name']}
												/>
											</FormGroup>
										</Colxx>

										<Colxx sm={12}>
											<FormGroup>
												<Label for="projectDescription">
													<IntlMessages id="project-label-description" />
												</Label>
												<Input
													type="textarea"
													name="projectDescription"
													id="projectDescription"
													placeholder={
														messages['project-placeholder-description']
													}
												/>
											</FormGroup>
										</Colxx>
									</FormGroup>
								</CardBody>
							</Card>
						</Colxx>
					</Row>

					<Separator className="mb-5" />
					<Row>
						{this.state.displayMode === 'thumblist' ? (
							<Colxx xxs="12" key="header">
								<Card
									// onClick={event =>
									// 	this.handleCheckChange(event, material.guid)
									// }
									style={{
										borderRadius: 0,
										boxShadow: 'none',
									}}
									className="d-flex flex-row"
								>
									<div className="pl-2 d-flex flex-grow-1 min-width-zero">
										<div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
											<p className="mb-1 text-muted text-small w-15 w-sm-15">
												<span className="mb-2">#</span>
											</p>
											<p className="list-item-heading mb-1 truncate w-60 w-sm-100">
												<IntlMessages id="project-header-material" />
											</p>
											<p className="mb-1 text-muted text-small w-15 w-sm-100">
												<IntlMessages id="project-header-qty" />
											</p>
											<p className="mb-1 text-muted text-small w-15 w-sm-100">
												<IntlMessages id="project-header-data" />
											</p>
											<p className="mb-1 text-muted text-small w-15 w-sm-100">
												<IntlMessages id="project-header-amp" />
											</p>
											<p className="mb-1 text-muted text-small w-15 w-sm-100">
												<IntlMessages id="project-header-relay" />
											</p>
										</div>
									</div>
								</Card>
							</Colxx>
						) : (
							<Colxx xxs="12" key="header">
								<Card
									className="d-flex flex-row"
									style={{
										borderRadius: 0,
										boxShadow: 'none',
									}}
								>
									<div className="pl-2 d-flex flex-grow-1 min-width-zero">
										<div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
											<p className="list-item-heading mb-1 truncate w-35 w-sm-100">
												<IntlMessages id="project-header-material" />
											</p>
											<p className="mb-1 text-muted text-small w-10 w-sm-100">
												<IntlMessages id="project-header-qty" />
											</p>
											<p className="mb-1 text-muted text-small w-10 w-sm-100">
												<IntlMessages id="project-header-data" />
											</p>
											<p className="mb-1 text-muted text-small w-10 w-sm-100">
												<IntlMessages id="project-header-amp" />
											</p>
											<p className="mb-1 text-muted text-small w-10 w-sm-100">
												<IntlMessages id="project-header-relay" />
											</p>
											<p className="mb-1 text-muted text-small w-10 w-sm-100">
												<span className="mb-2" />
											</p>
										</div>
									</div>
								</Card>
							</Colxx>
						)}
						{loading ? (
							newProject &&
							newProject.carrier &&
							newProject.carrier.projectArticles ? (
								newProject.carrier.projectArticles.map(material => {
									if (this.state.displayMode === 'thumblist') {
										return (
											<Colxx xxs="12" key={material.guid} className="mb-3">
												<ContextMenuTrigger
													id="menu_id"
													data={material.guid}
													collect={collect}
												>
													<Card
														onClick={event =>
															this.handleCheckChange(event, material.guid)
														}
														className={classnames('d-flex flex-row', {
															active: this.state.selectedItems.includes(
																material.guid,
															),
														})}
													>
														<NavLink
															to={`/app/projects/edit?p=${material.guid}`}
															className="d-flex"
														>
															<img
																alt={material.name}
																src="https://cataas.com/cat?type=sq"
																className="list-thumbnail responsive border-0"
															/>
														</NavLink>
														<div className="pl-2 d-flex flex-grow-1 min-width-zero">
															<div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
																<NavLink
																	to={`/app/projects/edit?p=${material.guid}`}
																	className="w-40 w-sm-100"
																>
																	<p className="list-item-heading mb-1 truncate">
																		{material.name}
																	</p>
																</NavLink>
																<p className="mb-1 text-muted text-small w-15 w-sm-100">
																	{material.name}
																</p>
																<p className="mb-1 text-muted text-small w-15 w-sm-100">
																	{material.name}
																</p>
																<div className="w-15 w-sm-100">
																	<Badge color={material.statusColor} pill>
																		{material.name}
																	</Badge>
																</div>
															</div>
															<div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
																<CustomInput
																	className="itemCheck mb-0"
																	type="checkbox"
																	id={`check_${material.guid}`}
																	checked={this.state.selectedItems.includes(
																		material.guid,
																	)}
																	onChange={() => {}}
																	label=""
																/>
															</div>
														</div>
													</Card>
												</ContextMenuTrigger>
											</Colxx>
										);
									} else {
										return (
											<Colxx xxs="12" key={material.guid} className="mb-3">
												<ContextMenuTrigger
													id="menu_id"
													data={material.guid}
													collect={collect}
													key={material.guid}
												>
													<Card
														onClick={event =>
															this.handleCheckChange(event, material.guid)
														}
														className={classnames('d-flex flex-row', {
															active: this.state.selectedItems.includes(
																material.guid,
															),
														})}
													>
														<div className="pl-2 d-flex flex-grow-1 min-width-zero">
															<div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
																<NavLink
																	to={`/app/projects/edit?p=${material.guid}`}
																	className="w-40 w-sm-100"
																>
																	<p className="list-item-heading mb-1 truncate">
																		{material.name}
																	</p>
																</NavLink>
																<p className="mb-1 text-muted text-small w-15 w-sm-100">
																	{material.name}
																</p>
																<p className="mb-1 text-muted text-small w-15 w-sm-100">
																	{material.name}
																</p>
																<div className="w-15 w-sm-100">
																	<Badge color={material.statusColor} pill>
																		{material.name}
																	</Badge>
																</div>
															</div>
															<div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
																<CustomInput
																	className="itemCheck mb-0"
																	type="checkbox"
																	id={`check_${material.guid}`}
																	checked={this.state.selectedItems.includes(
																		material.guid,
																	)}
																	onChange={() => {}}
																	label=""
																/>
															</div>
														</div>
													</Card>
												</ContextMenuTrigger>
											</Colxx>
										);
									}
								})
							) : (
								<h2>{'No data!'}</h2>
							)
						) : (
							<div className="loading" />
						)}
						{this.state.displayMode === 'thumblist' ? (
							<Colxx xxs="12" key="addMaterial" className="mb-3">
								<Card
									// onClick={event =>
									// 	this.handleCheckChange(event, material.guid)
									// }
									className="d-flex flex-row"
								>
									<NavLink
										to={`/app/projects/edit?p=${'material.guid'}`}
										className="d-flex"
									>
										<img
											alt={'material.name'}
											src="https://cataas.com/cat?type=sq"
											className="list-thumbnail responsive border-0"
										/>
									</NavLink>
									<div className="pl-2 d-flex flex-grow-1 min-width-zero">
										<div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
											<NavLink
												to={`/app/projects/edit?p=${'material.guid'}`}
												className="w-40 w-sm-100"
											>
												<p className="list-item-heading mb-1 truncate">
													{'material.dsdfname'}
												</p>
											</NavLink>
											<p className="mb-1 text-muted text-small w-15 w-sm-100">
												{'material.name'}
											</p>
											<p className="mb-1 text-muted text-small w-15 w-sm-100">
												{'material.name'}
											</p>
											<div className="w-15 w-sm-100">
												<Badge color={'material.statusColor'} pill>
													{'material.name'}
												</Badge>
											</div>
											<div className="custom-control custom-checkbox pl-1 align-self-center pr-4">
												<CustomInput
													className="itemCheck mb-0"
													type="checkbox"
													id={`check_${'material.guid'}`}
													// checked={this.state.selectedItems.includes(
													// 	material.guid,
													// )}
													onChange={() => {}}
													label=""
												/>
											</div>
										</div>
									</div>
								</Card>
							</Colxx>
						) : (
							<Colxx xxs="12" key="addMaterial" className="mb-3">
								<Card className="d-flex flex-row">
									<div className="pl-2 d-flex flex-grow-1 min-width-zero">
										<div className="card-body align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero align-items-lg-center">
											{/* <p className="list-item-heading mb-1 truncate w-40 w-sm-100">
												{'material.naasdasdme'}
											</p> */}
											<FormGroup className="mb-1 w-35 w-sm-100">
												<Label for="newMaterial">
													<IntlMessages id="project-new-material-label-article" />
												</Label>
												<ReactAutosuggest
													className="float-md-left"
													id="newMaterial"
													placeholder={
														messages['project-new-material-placeholder-article']
													}
													getField="materialId"
													data={materials}
													autocomplete="off"
													onComplete={value => {
														console.info('YAY', value);
														this.props.getMaterial(value);
													}}
												/>
											</FormGroup>
											<FormGroup className="mb-1 text-muted text-smallmb-1 w-10 w-sm-100">
												<Label for="newMaterialQuantity">
													<IntlMessages id="project-new-material-label-quantity" />
												</Label>
												<Input
													type="number"
													id="newMaterialQuantity"
													step="1"
													min="0"
												/>
											</FormGroup>
											{material ? (
												<p className="mb-1 text-muted text-small w-10 w-sm-100">
													{material.dataAmpConsuption}
												</p>
											) : (
												<p className="mb-1 text-muted text-small w-10 w-sm-100">
													-
												</p>
											)}
											{material ? (
												<p className="mb-1 text-muted text-small w-10 w-sm-100">
													{material.ampConsuption}
												</p>
											) : (
												<p className="mb-1 text-muted text-small w-10 w-sm-100">
													-
												</p>
											)}
											<div className="custom-control custom-checkbox pl-1 align-self-center pr-4 w-10 w-sm-100">
												<CustomInput
													className="itemCheck mb-0"
													type="checkbox"
													id={`check_${'material.guid'}`}
													// checked={this.state.selectedItems.includes(
													// 	material.guid,
													// )}
													onChange={() => {}}
													label=""
												/>
											</div>
											<div className="custom-control custom-checkbox pl-1 align-self-center pr-4 w-10 w-sm-100">
												<Button
													color="primary"
													size="lg"
													className="top-right-button"
													onClick={this.toggleModal}
												>
													<IntlMessages id="project-new-material-label-add" />
												</Button>
											</div>
										</div>
									</div>
								</Card>
							</Colxx>
						)}
					</Row>
				</div>

				<ContextMenu
					id="menu_id"
					onShow={e => this.onContextMenu(e, e.detail.data)}
				>
					<MenuItem onClick={this.onContextMenuClick} data={{ action: 'copy' }}>
						<i className="simple-icon-docs" /> <span>Copy</span>
					</MenuItem>
					<MenuItem onClick={this.onContextMenuClick} data={{ action: 'move' }}>
						<i className="simple-icon-drawer" /> <span>Move to archive</span>
					</MenuItem>
					<MenuItem
						onClick={this.onContextMenuClick}
						data={{ action: 'delete' }}
					>
						<i className="simple-icon-trash" /> <span>Delete</span>
					</MenuItem>
				</ContextMenu>
			</Fragment>
		);
	}
}
const mapStateToProps = ({
	authUser,
	settings,
	projectApp,
	materials /*, firestore*/,
}) => {
	const { user } = authUser;
	const { locale } = settings;
	return { user, locale, projectApp, materials /*, firestore */ };
};

export default compose(
	connect(
		mapStateToProps,
		{
			addProject,
			getMaterial,
		},
	),
	// firestoreConnect(props => {
	// 	return [{ collection: 'projects', doc: props.user }];
	// }),
)(injectIntl(mouseTrap(DataListLayout)));
