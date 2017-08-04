import { Meteor } from 'meteor/meteor';
import {Habit} from '../../lib/models/Habit';
import {DailyGoal} from '../../lib/models/DailyGoal';
import moment from 'moment';

function totalForDay(date){
	let completedHabitsTotal = 0;
	const completedHabits = Habit.find({
		dayCompleted: {
			$elemMatch: {
				$gte: moment(date).startOf('day').toDate(),
				$lt: moment(date).add(1, 'day').startOf('day').toDate()
			}
		},
		userId: Meteor.userId()
	}).fetch();

	completedHabits.map((habit)=>{
		completedHabitsTotal += habit.pointValue;
	});

	return completedHabitsTotal;
}

function daysGoal(date){
	const goalDB = DailyGoal.findOne({
		goalDate: moment(date).startOf('day').toDate(),
		userId: Meteor.userId()
	});

	let calculatedGoal = null;
	if (goalDB) {
		const goalWithRandNum = goalDB.goal + goalDB.randNum;
		calculatedGoal = goalWithRandNum>0 ? goalWithRandNum : 0;
	} else {
		// calculatedGoal = Meteor.call("goal.calculate", date);
	}

	return calculatedGoal;
}

function isRecoveryDay(date){
	const yesterdaysDate = moment(date).subtract(1, 'day');

	const totalForPreviousDay = totalForDay(yesterdaysDate);
	let goalForPreviousDay = daysGoal(yesterdaysDate);

	if (!goalForPreviousDay){
		goalForPreviousDay = 0;
	}

	return totalForPreviousDay===0 || totalForPreviousDay<goalForPreviousDay;
}

Meteor.methods({
	"habit.new": function (habit){
		habit.userId = Meteor.userId();
		habit.save();
	},
	"habit.edit": function (editedHabit){
		// const originalHabit = Habit.findOne(editedHabit._id);
		//
		// if (originalHabit.pointValue!==editedHabit.pointValue){
		// 	const newHabit = new Habit({
		// 		name: editedHabit.name,
		// 		pointValue: editedHabit.pointValue,
		// 		previousHabitId: originalHabit._id,
		// 		userId: Meteor.userId(),
		// 	});
		//
		// 	newHabit.save();
		//
		// 	originalHabit.stoppedDate = new Date();
		// 	originalHabit.save();
		// } else {
		editedHabit.userId = Meteor.userId();
		editedHabit.save();
		// }
	},
	"habit.complete": function(habit, selectedDay){
		habit.timeCompleted.push(new Date());
		habit.dayCompleted.push(selectedDay);
		habit.save();
	},
	"habit.uncheck": function(habit, selectedDay){
		const dayCompletedIndex = habit.dayCompleted.map(Number).indexOf(+selectedDay);

		habit.dayCompleted.splice(dayCompletedIndex, 1);
		habit.timeCompleted.splice(dayCompletedIndex, 1);

		habit.save();
	},
	"habit.delete": function(habit){
		habit.softRemove();
	},
	"habit.stop": function(habit){
		habit.stoppedDate = new Date();
		habit.save();
	},
	"goal.calculate": function(date){
		if (isRecoveryDay(date)){
			const randNumArr = [-3,-2,-1,-1,0,0,1,1,2,3];
			const randNum = randNumArr[Math.floor(Math.random()*randNumArr.length)];

			let previousDaysTotal = totalForDay(moment(date).subtract(1, 'day').toDate());

			new DailyGoal({
				userId: Meteor.userId(),
				goal: previousDaysTotal,
				randNum: randNum,
				goalDate: date
			}).save();

			return previousDaysTotal + randNum > 0 ? previousDaysTotal + randNum : 0;
		} else {
			const randNumArr = [-2,-1,-1,0,0,1,1,2,3,4,6,8];
			const randNum = randNumArr[Math.floor(Math.random()*randNumArr.length)];

			let arrOfNonRecoveryDayTotals = [];
			for (let i=1; i<31 && arrOfNonRecoveryDayTotals.length<7; i++){
				const dayToCheck = moment(date).subtract(i, 'days').toDate();

				if (!isRecoveryDay(dayToCheck)){
					arrOfNonRecoveryDayTotals.push(totalForDay(dayToCheck));
				}
			}

			for (let i=arrOfNonRecoveryDayTotals.length; i<7; i++){
				arrOfNonRecoveryDayTotals.push(0);
			}

			let totalOfPastSevenNonRecoveryDays = 0;
			arrOfNonRecoveryDayTotals.forEach((totalForDay)=>{
				totalOfPastSevenNonRecoveryDays += totalForDay;
			});

			const goalFromAverage = Math.round(totalOfPastSevenNonRecoveryDays/7);

			new DailyGoal({
				userId: Meteor.userId(),
				goal: goalFromAverage,
				randNum: randNum,
				goalDate: date
			}).save();

			return goalFromAverage + randNum > 0 ? goalFromAverage + randNum : 0;

		}
	},
	"feedback.save": function(feedbackText){
		Email.send({
			to: 'info@habituapp.com',
			from: 'noreply@habituapp.com',
			subject: 'Feedback Received',
			text: feedbackText
		});
	}
});