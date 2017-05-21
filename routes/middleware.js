var db = require('sqlite');


var checkUserSession = function (request, response, next) {
  if (request.query.sessionKey) {
    db.get("SELECT `id` FROM `user` WHERE `sessionKey` = ? LIMIT 1", request.query.sessionKey)
      .then(function (currentUser) {
        if (currentUser) {
          request.currentUserId = currentUser.id;
          next();
        }
      }, function(error) {
        return response.status(403).send({
          success: false,
          relogin: true,
          message: 'Unauthorised access. Please login.'
        });
      });
  }
  else {
    return response.status(403).send({
      success: false,
      relogin: true,
      message: 'Unauthorised access. Please login.'
    });
  }
};

module.exports = {
  checkUserSession: checkUserSession
};
