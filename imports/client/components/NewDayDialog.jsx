import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import autoBind from 'react-autobind';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


export default class NewDayDialog extends Component {
	constructor(props) {
		super(props);

		// this.state = {
		// };

		autoBind(this);
	}

	// formChange(field, event){
	// 	this.setState({[field]: event.target.value});
	// }

	render() {
		const actions = [
			<FlatButton
				label="OK"
				primary={true}
				onTouchTap={this.props.toggleNewDayDialog}
			/>,
		];

		return (
			<div>
				<Dialog
					title="It's a brand new day!"
					actions={actions}
					modal={false}
					open={this.props.newDayDialogOpen}
					onRequestClose={this.props.toggleNewDayDialog}
				>
					Your habits and goal have been reset. Remember, you can always go back to complete habits in the past.
				</Dialog>
			</div>
		);
	}
}