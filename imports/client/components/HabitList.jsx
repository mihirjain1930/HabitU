import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {compose} from 'react-komposer';
import getTrackerLoader from '../lib/getTrackerLoader';
import {Loading} from './Loading';
import autoBind from 'react-autobind';
import {Habit} from '/lib/models/Habit';
import {DailyGoal} from '/lib/models/DailyGoal';
// import {Card, CardTitle, CardText, CardActions} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import Dialog from 'material-ui/Dialog';
import NewHabitDialog from './NewHabitDialog';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

const style = {
	height: 50,
	width: 50,
	margin: 20,
	textAlign: 'center',
	display: 'inline-block',
	paddingTop: 5,
	fontSize: 40
};

class HabitList extends Component {
	constructor(props) {
		super(props);
		autoBind(this);
	}

	render() {
		return (
			<div className="habitList">
				<Card style={
					{margin:"20px 0"}
				}>
					<CardHeader
						title=""
						subtitle=""
						actAsExpander={false}
						showExpandableButton={false}
					/>
					<CardMedia
						overlay={<CardTitle title={this.props.completedHabitsTotal}  subtitle="Today's Score" />}
					>
						<img src="img/leftBrainLogo.svg" style={{
							height: 40,
							position: "relative",
							top: 70,
							opacity: 0

						}} />
					</CardMedia>
					<CardTitle title={this.props.goal} subtitle="Today's Goal" />
				</Card>

				{this.props.habits.map((habit)=>{
					return <HabitCard key={habit._id}
					                  habit={habit}
					                  selectedDay={this.props.selectedDay} />
				})}



			</div>
		);
	}
}

class HabitCard extends Component{
	constructor(props) {
		super(props);

		this.state = {
			deleteDialogOpen: false,
			stopDialogOpen: false,
			newHabitDialogOpen: false,
			saveInProgress: false
		};

		autoBind(this);
	}

	completeHabit(){
		this.setState({saveInProgress: true});
		Meteor.call("habit.complete", this.props.habit, this.props.selectedDay, function(error){
			if (error){
				console.log(error);
			} else {
				this.setState({saveInProgress: false});
			}
		}.bind(this));
	}

	uncheckHabit(){
		Meteor.call("habit.uncheck", this.props.habit, this.props.selectedDay, function(error){
			if (error){
				console.log(error);
			}
		})
	}

	toggleDeleteDialog(){
		this.setState({deleteDialogOpen: !this.state.deleteDialogOpen});
	}

	toggleStopDialog(){
		this.setState({stopDialogOpen: !this.state.stopDialogOpen});
	}

	toggleEditDialog(){
		this.setState({newHabitDialogOpen: !this.state.newHabitDialogOpen});
	}

	deleteHabit(){
		Meteor.call("habit.delete", this.props.habit, function(error){
			if (error){
				console.log(error)
			} else {
				this.toggleDeleteDialog();
			}
		}.bind(this))
	}

	stopHabit(){
		Meteor.call("habit.stop", this.props.habit, function(error){
			if (error){
				console.log(error)
			}
		});
	}

	render(){
		let completed = false;
		const selectedDayIsToday = moment(this.props.selectedDay).startOf('day').isSame(moment(), 'day');

		if (this.props.habit.dayCompleted.map(Number).indexOf(+moment(this.props.selectedDay).startOf('day').toDate())>-1){
			//moment(this.props.habit.dayCompleted[this.props.habit.dayCompleted.length-1]).isSame(moment(), 'day')) {
			completed = true;
		}

		const deleteDialogOptions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.toggleDeleteDialog}
			/>,
			<FlatButton
				label="Delete"
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.deleteHabit}
			/>,
		];

		const stopDialogOptions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.toggleStopDialog}
			/>,
			<FlatButton
				label="Stop"
				primary={true}
				keyboardFocused={true}
				onTouchTap={this.stopHabit}
			/>,
		];

		return (
			<div>
				<Card className="habitCard">

					<CardText style={{width:"15%"}}>

						<Paper style={style} zDepth={1} circle={true} >
							{this.props.habit.pointValue}
						</Paper>

					</CardText>
					<CardTitle style={{
						padding:"0",
						width: "50%",
						top: "-80px",
						left: "180px"
					}}
					           title={this.props.habit.name}
					           titleStyle={completed ? {
							           color: "#aaa",
							           textDecoration: "line-through"
						           } : {color: "#000"}}
					/>
					{/*<CardActions>*/}
					{this.state.saveInProgress ?
						<FlatButton disabled={true}>
							<i className="fa fa-spinner fa-spin"/>
						</FlatButton> :
						completed ?
							<FlatButton
								onClick={this.uncheckHabit}
								label="Uncheck"
							/>
							:
							<FlatButton
								onClick={this.completeHabit}
								label="Complete"
							/>
					}
					{selectedDayIsToday ? <span>
								<FlatButton
									label="Delete"
									onClick={this.toggleDeleteDialog}
								/>
								<FlatButton
									label="Stop"
									onClick={this.toggleStopDialog}
								/>
								<FlatButton
									label="Edit"
									onClick={this.toggleEditDialog}
								/>
							</span> : null}
					{/*</CardActions>*/}
				</Card>
				<Dialog
					title="Are you sure you want to delete this habit?"
					actions={deleteDialogOptions}
					modal={false}
					open={this.state.deleteDialogOpen}
					onRequestClose={this.toggleDeleteDialog}
				/>
				<Dialog
					title="Are you sure you want to stop this habit?"
					actions={stopDialogOptions}
					modal={false}
					open={this.state.stopDialogOpen}
					onRequestClose={this.toggleStopDialog}
				/>
				<NewHabitDialog
					newHabitDialogOpen={this.state.newHabitDialogOpen}
					toggleNewHabitDialog={this.toggleEditDialog}
					habit={this.props.habit}
				/>
			</div>
		);
	}
}


export default HabitListContainer = compose(getTrackerLoader((props, onData) => {
	if(Meteor.subscribe('habits').ready() && Meteor.subscribe('dailyGoals').ready()){

		const habits = Habit.find({
			$or: [
				{stoppedDate: null},
				{stoppedDate: {$gt: moment(props.selectedDay).add(1, 'day').startOf('day').toDate()}}
			]
		}).fetch();

		let completedHabitsTotal = 0;
		const completedHabits = Habit.find({
			dayCompleted: {
				$elemMatch: {
					$gte: moment(props.selectedDay).startOf('day').toDate(),
					$lt: moment(props.selectedDay).add(1, 'day').startOf('day').toDate()
				}
			}
		}).fetch();

		completedHabits.map((habit)=>{
			completedHabitsTotal += habit.pointValue;
		});

		const goalDB = DailyGoal.findOne({goalDate: moment(props.selectedDay).startOf('day').toDate()});

		if (goalDB){
			onData(null, {
				habits: habits ? habits : [],
				completedHabits: completedHabits ? completedHabits : [],
				completedHabitsTotal: completedHabitsTotal,
				selectedDay: props.selectedDay,
				goal: goalDB.goal + goalDB.randNum > 0 ? goalDB.goal+goalDB.randNum : 0
			});
		} else {
			Meteor.call("goal.calculate", moment(props.selectedDay).startOf('day').toDate(), function (err, result){
				//calling this will cause a DB update which will trigger a DB update which will trigger the goalDB code above
				if (err){
					console.log(err);
				}
			});
		}



	}
}), {loadingHandler: () => Loading})(HabitList);
