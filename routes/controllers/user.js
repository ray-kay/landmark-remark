var db = require('sqlite');
var uidV4 = require('uuid/v4');

module.exports = {

  saveUser: function(request, response, next) {
    var user = request.body.user;

    //test if user already exists by user name
    db.get("SELECT * FROM `user` WHERE `user_name` = ? LIMIT 1", user.user_name).then(function (existingUser) {
      if(existingUser){
        return response.json({
          success: true,
          data: {
            session_key: existingUser.sessionKey
          }
        });
      }
      var sessionKey = uidV4(); //generate random uuid
      var currentTimeStamp = Math.floor(Date.now() / 1000); //we don't need milliseconds here

      db.run("INSERT INTO `user` (`user_name`,`sessionKey`,`createdAt`,`updatedAt`) VALUES (?,?,?,?)", {
          1: user.user_name,
          2: sessionKey,
          3: currentTimeStamp,
          4: currentTimeStamp
        })
        .then(function (result) {
          return response.json({
            success: true,
            data: {
              session_key: sessionKey
            }
          });
        }, function (error) {
          return response.json({
            success: false,
            message: error.message || 'Ups something went wrong!'
          });
        });
    }, function (error) {
      return response.json({
        success: false,
        message: error.message || 'Ups something went wrong!'
      });
    });
  }
};
