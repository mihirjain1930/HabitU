import React, {Component} from 'react';

import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import autoBind from 'react-autobind';
import { browserHistory } from 'react-router'


export default class Login extends Component {
	constructor(props){
		super(props);

		this.state = {
			email: "",
			password: ""
		};

		autoBind(this);
	}

	componentWillMount(){
		if (Meteor.user()){
			browserHistory.push('/dashboard');
		}
	}

	formChange(field, event){
		this.setState({[field]: event.target.value});
	}

	loginFormSubmitted(event){
		event.preventDefault();
		Meteor.loginWithPassword(this.state.email, this.state.password, (error)=>{
			if (error){
				console.log(error);
				alert('There was an error. Please try a new username & password combo')
			} else {
				browserHistory.push('/dashboard');
			}
		})
	}

	createAccount(event){
		Accounts.createUser({
			email: this.state.email,
			password: this.state.password
		}, (error)=>{
			if (error){
				console.log(error);
				alert('There was an error creating your account. Please try again.')
			} else {
				Meteor.loginWithPassword(this.state.email, this.state.password, (error)=>{
					if (error){
						console.log(error);
						alert('There was an error creating your account. Please try again. ')
					} else {
						browserHistory.push('/dashboard');
					}
				});
			}
		});
	}

	render() {
		return (
			<div id="login" className="row">
				{/*<div className="col-sm-0 col-md-4" />*/}
				<div id="mcard" className="col-sm-4 col-sm-offset-8 col-xs-12 col-xs-offset-0">
					<img src="/img/habitUWhite.svg" />

					<Card
						style={{
							borderRadius: 10,
							backgroundColor:"rgba(255, 255, 255, 0.8)",


						}}>
						<form onSubmit={this.loginFormSubmitted}>

							<CardText>
								<TextField
									floatingLabelText="Email"
									value={this.state.email}
									onChange={this.formChange.bind(this, "email")}
									type="email"
									style={{
										width: "100%"
									}}
								/><br/>
								<TextField
									floatingLabelText="Password"
									type="password"
									value={this.state.password}
									onChange={this.formChange.bind(this, "password")}
									style={{
										width: "100%"
									}}
								/>
							</CardText>
							<CardActions>
								<FlatButton label="Login" type="submit"/>
								<FlatButton
									label="Create Account"
									onClick={this.createAccount}
								/>
							</CardActions>
						</form>
					</Card>
					<div className="mfoot"></div>
				</div>

			</div>
		);
	}
}

