var LocalStrategy   = require('passport-local').Strategy;

module.exports = function(passport,connection) {

    passport.serializeUser(function(user, done) {
		done(null, user.ID);
    });

    passport.deserializeUser(function(id, done) {
    	console.log(id);
		connection.query("select * from user where ID = "+id+"",function(err,rows){
            var user = rows[0];
            connection.query("select * from "+user.type+" where ID = "+user.profile_id, function(err,rows){
                user.profile = rows[0];
                done(err, user);
            });
		});
    });
	
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        connection.query("select * from user where email = '"+email+"'",function(err,rows){
			console.log(rows);
			console.log("above row object");
			if (err)
                return done(err);
			 if (rows.length) {
                return done(null, false);
            } else {
                var newUserMysql = new Object();
				
				newUserMysql.email    = email;
                newUserMysql.password = password;
			
				var insertQuery = "INSERT INTO user ( email, password ) values ('" + email +"','"+ password +"')";
					console.log(insertQuery);
				connection.query(insertQuery,function(err,rows){
				newUserMysql.id = rows.insertId;
				return done(null, newUserMysql);
				});	
            }	
		});
    }));
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {

         connection.query("SELECT * FROM `user` WHERE `email` = '" + email + "'",function(err,rows){
			if (err)
                return done(err);
			 if (!rows.length) {
                return done(null, false);
            } 
			
            if (!( rows[0].password == password))
                return done(null, false); // create the loginMessage and save it to session as flashdata
			
            return done(null, rows[0]);			
		
		});
		


    }));

};