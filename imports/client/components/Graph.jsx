import React, {Component} from 'react';
import {Meteor} from 'meteor/meteor';
import {compose} from 'react-komposer';
import getTrackerLoader from '../lib/getTrackerLoader';
import {Loading} from './Loading';
import autoBind from 'react-autobind';
// import {MODELNAME} from '/lib/models/MODELNAME';
// import { browserHistory } from 'react-router'
// import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { browserHistory } from 'react-router'
import { Chart } from 'react-google-charts';
import {Habit} from '/lib/models/Habit';
import {DailyGoal} from '/lib/models/DailyGoal';

import moment from 'moment';

class Graph extends Component {
	constructor(props) {
		super(props);

		// this.state = {
		// };

		autoBind(this);
	}

	// formChange(field, event){
	// 	this.setState({[field]: event.target.value});
	// }

	dashboardClicked(){
		browserHistory.push('/dashboard');
	}

	render() {
		return (
			<div id="graph">
				<div className="row nav">
					<div className="col-xs-4">
						<i style={{float: "left", marginTop: 15, marginLeft: 15, color: "white", fontSize: 18}}
						   className="fa fa-chevron-left"
						   onClick={this.dashboardClicked}

						/>
					</div>
					<div className="col-xs-4">
						<img src="/img/habitUWhite.svg" />
					</div>
					<div className="col-xs-4">
						<a onClick={this.logout}>Logout</a>
					</div>
				</div>
				<div>
					<div className={'my-pretty-chart-container'}>
						<Chart
							chartType="ComboChart"
							data={this.props.graphData}
							options={{
								//title : '',
								vAxis: {title: 'Score'},
								hAxis: {title: 'Date'},
								seriesType: 'bars',
								series: {0: {type: 'line'}},
							}}
							graph_id="ComboChart"
							width="100%"
							height="400px"
							legend_toggle
						/>
					</div>
				</div>
			</div>
		);
	}
}


export default GraphContainer = compose(getTrackerLoader((props, onData) => {
	if(Meteor.subscribe('habits').ready() && Meteor.subscribe('dailyGoals').ready()){
		let graphData = [
			['Day', 'Goal', 'Score', {role: 'style'}]

		];
		for (let i=7; i>0; i--){
			const dailyGoalDB = DailyGoal.findOne({
				goalDate: {
					$eq: moment().subtract(i, 'days').startOf('day').toDate(),
				}
			});

			const goal = dailyGoalDB ? dailyGoalDB.goal + dailyGoalDB.randNum : 0;

			let completedHabitsTotal = 0;
			const completedHabits = Habit.find({
				dayCompleted: {
					$elemMatch: {
						$eq: moment().subtract(i, 'days').startOf('day').toDate(),
					}
				}
			}).fetch();

			completedHabits.map((habit)=>{
				completedHabitsTotal += habit.pointValue;
			});

			const color = 'color: ' + (completedHabitsTotal>=goal ? 'blue' : 'red');

			graphData.push([moment().subtract(i, 'days').format('dd M/D'), goal, completedHabitsTotal, color]);
		}

		onData(null, {
			graphData: graphData,
		});
	}
}), {loadingHandler: () => Loading})(Graph);
