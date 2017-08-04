import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import autoBind from 'react-autobind';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

export default class FeedbackDialog extends Component {
	constructor(props) {
		super(props);

		this.state = {
			feedbackText: ""
		};

		autoBind(this);
	}

	formChange(field, event){
		this.setState({[field]: event.target.value});
	}

	save(){
		Meteor.call("feedback.save", this.state.feedbackText, function(error){
			if (error){
				console.log(error);
			} else {
				this.setState({feedbackText: ""});
				this.props.toggleFeedbackDialog();
			}
		}.bind(this))
	}

	render() {
		const actions = [
			<FlatButton
				label="Cancel"
				primary={true}
				onTouchTap={this.props.toggleFeedbackDialog}
			/>,
			<FlatButton
				label="Send"
				primary={true}
				onTouchTap={this.save}
			/>,
		];

		return (
			<div>
				<Dialog
					title="Provide Feedback"
					actions={actions}
					modal={false}
					open={this.props.feedbackDialogOpen}
					onRequestClose={this.props.toggleFeedbackDialog}
				>
					<h1>Please provide feedback below:</h1>
					<TextField
						multiLine={true}
						style={{width: "100%"}}
						hintText="We're listening"
						value={this.state.feedbackText}
						onChange={this.formChange.bind(this, "feedbackText")}
					/>
				</Dialog>
			</div>
		);
	}
}