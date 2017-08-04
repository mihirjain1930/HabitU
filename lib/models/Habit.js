import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';

const Habits = new Mongo.Collection('habits');

export const Habit = Class.create({
	name: 'Habit',
	collection: Habits,
	fields: {
		createdDate: Date,
		timeCompleted: {
			type: [Date],
			default: []
		},
		dayCompleted: {
			type: [Date],
			default: []
		},
		name: String,
		pointValue: Number,
		userId: String,
		deleted: {
			type: Boolean,
			default: false
		},
		deletedDate: {
			type: Date,
			optional: true
		},
		stoppedDate: {
			type: Date,
			default: null,
			optional: true
		},
		// previousHabitId: {
		// 	type: String,
		// 	optional: true
		// }
	},
	behaviors: {
		softremove:{
			removedFieldName: 'deleted',
			hasRemovedAtField: true,
			removedAtFieldName: 'deletedDate'
		},
		timestamp: {
			hasCreatedField: true,
			createdFieldName: 'createdDate'
		}
	},
	events: {
		beforeUpdate(e) {
			// const habitBeforeEdit = Habit.findOne(e.target._id);
			// const incomingHabitData = e.target;
			//
			// console.log(habitBeforeEdit, incomingHabitData);

			// 	console.log(!incomingHabitData._isNew,
			// 		incomingHabitData.pointValue !== habitBeforeEdit.pointValue,
			// 		incomingHabitData.stoppedDate!==null);
			//
			// 	if (!incomingHabitData._isNew &&
			// 		incomingHabitData.pointValue !== habitBeforeEdit.pointValue &&
			// 		habitBeforeEdit.stoppedDate !== null) {
			// 		console.log('updating');
			// 		// if (e.Class.)
			// 		try {
			// 			e.preventDefault();
			// 		} catch (e) {
			// 			/*
			// 			 Suck it... (do nothing)
			// 			 Astronomy throws an error when preventing the default update action,
			// 			 but in our case we don't want it to because there's nothing wrong. We just
			// 			 want it to save edited habits as new ones and stop the old one.
			// 			 */
			// 		}
			//
			// 		// console.log(e.target.pointV);
			//
			// 		new Habit({
			// 			name: incomingHabitData.name,
			// 			pointValue: incomingHabitData.pointValue,
			// 			userId: incomingHabitData.userId,
			// 			previousHabitId: incomingHabitData._id
			// 		}).save();
			//
			// 		habitBeforeEdit.stoppedDate = new Date();
			// 		habitBeforeEdit.save();
			// 	}
		}
	}
});

if (Meteor.server){
	Meteor.publish('habits', function(){
		return Habit.find({
			userId: this.userId
		});
	});
}