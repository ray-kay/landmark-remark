var db = require('sqlite');


module.exports = {
  getAllLocation: function(request, response, next) {
    var query = 'SELECT l.latitude, l.longitude, l.text, l.updatedAt, u.user_name, ' +
      '(CASE WHEN u.id = ? THEN 1 ELSE 0 END) AS `currentUser` ' +
      'FROM `location` l ' +
      'INNER JOIN `user` u ON (u.id = l.userId)';
    db.all(query,request.currentUserId).then(function(result){
      return response.json({
        success: true,
        data: result
      });
    },function(error){
      return response.json({
        success: false,
        message: error.message || 'Ups something went wrong!'
      });
    });
  },
  saveLocation: function(request, response, next) {
    var location = request.body.location;
    var userId = request.currentUserId; //set by middleware
    var currentTimeStamp = Math.floor(Date.now() / 1000); //we don't need milliseconds here

    db.run("INSERT INTO `location` (`userId`,`latitude`,`longitude`,`text`,`createdAt`,`updatedAt`) VALUES (?,?,?,?,?,?)",
      {
        1: userId,
        2: location.latitude,
        3: location.longitude,
        4: location.text,
        5: currentTimeStamp,
        6: currentTimeStamp
      })
      .then(function (result) { //result.stmt.lastID
        return response.status(201).json({
          success: true,
          data: {
            id: '1'
          }
        });
      }, function (error) {
        return response.json({
          success: false,
          message: error.message || 'Ups something went wrong!'
        });
      });
  }
};
