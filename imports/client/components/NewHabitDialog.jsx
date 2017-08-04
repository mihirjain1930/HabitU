import React, {Component} from 'react';
import autoBind from 'react-autobind';
import { Meteor } from 'meteor/meteor';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';

import {Habit} from '/lib/models/Habit';

export default class NewHabitDialog extends Component{
	constructor(props){
		super(props);

		this.state = {
			pointValue: 5,
			habitName: "",
			habitCreatedSnackbarOpen: false
		};

		autoBind(this);
	}

	componentWillMount(){
		if (this.props.habit){
			this.setState({
				pointValue: this.props.habit.pointValue,
				habitName: this.props.habit.name
			})
		}
	}

	componentWillReceiveProps(){
		this.setState({habitCreatedSnackbarOpen: false});
		if (this.props.habit){
			this.setState({
				pointValue: this.props.habit.pointValue,
				habitName: this.props.habit.name
			})
		}
	}

	formChange(field, event){
		this.setState({[field]: event.target.value});
	}

	selectChange(field, event, key, payload){
		this.setState({[field]:payload});
	}

	cancel(){
		this.setState({
			pointValue: 5,
			habitName: ""
		});
		this.props.toggleNewHabitDialog();
	}

	save(){
		if (!this.props.habit) {
			let habit = new Habit();

			habit.name = this.state.habitName;
			habit.pointValue = this.state.pointValue;

			Meteor.call("habit.new", habit, function(error){
				if (error){
					console.log(error);
				} else {
					this.cancel();
					this.setState({habitCreatedSnackbarOpen: true});
				}
			}.bind(this));
		} else {
			let habit = this.props.habit;

			habit.name = this.state.habitName;
			habit.pointValue = this.state.pointValue;

			Meteor.call("habit.edit", habit, function(error){
				if (error){
					console.log(error);
				} else {
					this.cancel();
					this.setState({habitCreatedSnackbarOpen: true});
				}
			}.bind(this));
		}
	}

	render() {
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.cancel}
			/>,
			<FlatButton
				label="Save"
				primary={true}
				onTouchTap={this.save}
			/>,
		];

		return (<div>
				<Dialog
					title="New/Edit Habit"
					actions={actions}
					modal={false}
					open={this.props.newHabitDialogOpen}
					onRequestClose={this.props.toggleNewHabitDialog}
				>
					<TextField
						floatingLabelText="Name"
						value={this.state.habitName}
						onChange={this.formChange.bind(this, "habitName")}
					/><br/>
					<SelectField
						floatingLabelText="Point Value"
						value={this.state.pointValue}
						onChange={this.selectChange.bind(this, "pointValue")}
					>
						<MenuItem value={2} primaryText="2" />
						<MenuItem value={5} primaryText="5" />
						<MenuItem value={10} primaryText="10" />
					</SelectField>
				</Dialog>

				<Snackbar
					open={this.state.habitCreatedSnackbarOpen}
					message="Habit Created/Edited"
					autoHideDuration={2000}
				/>
			</div>
		)
	}
}
