import { Meteor } from 'meteor/meteor';
import { Class } from 'meteor/jagi:astronomy';

export const UserProfile = Class.create({
	name: 'UserProfile',
	fields: {
		firstName: String
	}
});

export const User = Class.create({
	name: 'User',
	collection: Meteor.users,
	fields: {
		createdAt: Date,
		emails: {
			type: [Object],
			default: function() {
				return [];
			}
		},
		profile: {
			type: UserProfile,
			default: function() {
				return {};
			}
		}
	}
});

if (Meteor.isServer) {
	User.extend({
		fields: {
			services: Object
		}
	});
}