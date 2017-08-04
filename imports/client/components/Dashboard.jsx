import React, {Component} from 'react';
import { compose } from 'react-komposer';
import getTrackerLoader from '../lib/getTrackerLoader';
import { Meteor } from 'meteor/meteor';
import autoBind from 'react-autobind';
import { browserHistory } from 'react-router'
import {Habit} from '/lib/models/Habit';
import {Loading} from './Loading';
import NewHabitDialog from './NewHabitDialog';
import FeedbackDialog from './FeedbackDialog';
import NewDayDialog from './NewDayDialog';
import HabitListContainer from './HabitList';
import moment from 'moment';

import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';

import DatePicker from 'material-ui/DatePicker';
import Drawer from 'material-ui/Drawer';

// import {Card, CardActions, CardHeader, CardText} from 'material-client/Card';
// import FlatButton from 'material-client/FlatButton';
// import TextField from 'material-client/TextField';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


class Dashboard extends Component {
	constructor(props){
		super(props);

		this.state = {
			email: "",
			password: "",
			newHabitDialogOpen: false,
			feedbackDialogOpen: false,
			newDayDialogOpen: false,
			selectedDay: moment().startOf('day').toDate(),
			open: false





		};

		autoBind(this);
	}

	handleDateChange(event, date) {
		this.setState({
			selectedDay: date,
		});
	};

	toggleNewHabitDialog(){
		this.setState({newHabitDialogOpen: !this.state.newHabitDialogOpen});
	}

	toggleFeedbackDialog(){
		this.setState({feedbackDialogOpen: !this.state.feedbackDialogOpen});
	}

	toggleNewDayDialog(){
		this.setState({newDayDialogOpen: !this.state.newDayDialogOpen});
	}

	logout(){
		Meteor.logout((error)=>{
			if (error){
				console.log(error);
				alert(error);
			} else {
				browserHistory.push('/login');
			}
		});
	}

	disableFutureDates(date){
		if (date < new Date()){
			return false;
		}
		return true;
	}

	componentDidMount(){
		let lastDateCheck = new Date();
		setInterval(()=>{
			const yesterday = moment().clone().subtract(1, 'days').startOf('day');
			if (moment(lastDateCheck).isSame(yesterday, 'd')){
				lastDateCheck = new Date();
				this.setState({
					selectedDay: moment().startOf('day').toDate(),
					newDayDialogOpen: true
				})
			}
		}, 5000);
	}

	graphClicked(){
		browserHistory.push('/graph');
	}

	openDatePicker(){
		this.refs.datePicker.openDialog();
	}

	formatDate(date){
		return moment(date).format("ddd M/D/YY");
	}

	render() {
		return (
			<div id="dashboard">
				<Toolbar style={{overflowX: 'scroll'}}>
					<ToolbarGroup firstChild={true}>
						<img className="logoLBT" src="/img/leftBrainLogoTeal.svg" />

						<DropDownMenu style={{visibility:"hidden"}}>

						</DropDownMenu>
					</ToolbarGroup>
					<ToolbarGroup>
						{moment(this.state.selectedDay).isSame(moment(), 'd') ? <h1 className="today">TODAY</h1> : null }
						<i className="fa fa-calendar toolIcon"
						   onClick={this.openDatePicker}
						/>

						<DatePicker
							hintText="Select Date"
							container="dialog"
							mode="portrait"
							value={this.state.selectedDay}
							onChange={this.handleDateChange}
							shouldDisableDate={this.disableFutureDates}
							style={{float: "left"}}
							firstDayOfWeek={0}
							autoOk={true}
							className="datePicker"
							ref='datePicker'
							formatDate={this.formatDate}
						/>

						{/*<ToolbarTitle text="Options" />*/}
						{/*<i className="fa fa-list-alt toolIcon"*/}
						{/*onClick={this.dashboardClicked}*/}
						{/*/>*/}

						{/*<div>*/}
						{/*<RaisedButton*/}
						{/*label="Open Drawer"*/}
						{/*onTouchTap={this.handleToggle}*/}
						{/*/>*/}
						{/*<Drawer*/}
						{/*docked={false}*/}
						{/*width={200}*/}
						{/*open={this.state.open}*/}
						{/*onRequestChange={(open) => this.setState({open})}*/}
						{/*>*/}
						{/*<MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>*/}
						{/*<MenuItem onTouchTap={this.handleClose}>Menu Item 2</MenuItem>*/}
						{/*</Drawer>*/}
						{/*</div>*/}

						<i className="fa fa-bar-chart toolIcon graphIcon"
						   onClick={this.graphClicked}
						/>

						{/*<i className="fa fa-cog toolIcon" />*/}

						<FontIcon className="muidocs-icon-custom-sort" />
						<ToolbarSeparator />
						<RaisedButton label="Logout"
						              primary={true}
						              onClick={this.logout}
						              className="btnLogout"
						/>

					</ToolbarGroup>
				</Toolbar>

				<HabitListContainer selectedDay={this.state.selectedDay} />
				<FloatingActionButton className="newHabitButton" onClick={this.toggleNewHabitDialog}>
					<ContentAdd />
				</FloatingActionButton>
				<FloatingActionButton className="feedbackButton"
				                      backgroundColor="red"
				                      onClick={this.toggleFeedbackDialog}>
					<i className="fa fa-exclamation-triangle" />
				</FloatingActionButton>
				<NewHabitDialog
					newHabitDialogOpen={this.state.newHabitDialogOpen}
					toggleNewHabitDialog={this.toggleNewHabitDialog}
				/>
				<FeedbackDialog
					feedbackDialogOpen={this.state.feedbackDialogOpen}
					toggleFeedbackDialog={this.toggleFeedbackDialog}
				/>
				<NewDayDialog
					newDayDialogOpen={this.state.newDayDialogOpen}
					toggleNewDayDialog={this.toggleNewDayDialog}
				/>
			</div>
		);
	}
}

export default DashboardContainer = compose(getTrackerLoader((props, onData)=>{
	onData(null, {dataReady: true});
}), {loadingHandler: () => Loading})(Dashboard);
