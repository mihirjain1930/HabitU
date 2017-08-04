Meteor.publish("users", function(){
	const user = Meteor.users.find({_id: this.userId});
	return user ? user : this.ready();
});

