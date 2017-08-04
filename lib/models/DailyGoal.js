import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';

const DailyGoals = new Mongo.Collection('dailyGoals');

export const DailyGoal = Class.create({
	name: 'DailyGoal',
	collection: DailyGoals,
	fields: {
		userId: String,
		goalDate: Date,
		goal: Number,
		randNum: Number
	}
});

if (Meteor.server){
	Meteor.publish('dailyGoals', function(){
		return DailyGoal.find({
			userId: this.userId
		});
	});
}