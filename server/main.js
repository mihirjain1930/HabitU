import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'

Meteor.startup(() => {
	process.env.MAIL_URL = 'smtp://noreply@mg.habituapp.com:V293Kbrz53JH@smtp.mailgun.org:2525';
});
