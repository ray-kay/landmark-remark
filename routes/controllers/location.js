var db = require('sqlite');


module.exports = {
  getAllLocation: function (request, response, next) {
    var query = 'SELECT l.id, l.latitude, l.longitude, l.text, l.updatedAt, u.user_name as userName, ' +
      '(CASE WHEN u.id = ? THEN 1 ELSE 0 END) AS `isCurrentUser` ' +
      'FROM `location` l ' +
      'INNER JOIN `user` u ON (u.id = l.userId)';
    db.all(query, request.currentUserId).then(function (result) {
      return response.json({
        success: true,
        data: result
      });
    }, function (error) {
      return response.json({
        success: false,
        message: error.message || 'Ups something went wrong!'
      });
    });
  },
  saveLocation: function (request, response, next) {
    var location = request.body.location;
    var userId = request.currentUserId; //set by middleware
    var currentTimeStamp = Math.floor(Date.now() / 1000); //we don't need milliseconds here

    //check if this location already exists for current user = update
    db.get("SELECT `id` FROM `location` WHERE `userId` = ? AND `latitude` = ? AND `longitude` = ? LIMIT 1",
      {
        1: userId,
        2: location.latitude,
        3: location.longitude
      })
      .then(function (existingLocation) {
        if (existingLocation) {
          //update
          db.run("UPDATE `location` SET `text` = ?, `updatedAt` = ? WHERE `id` = ?",
            {
              1: location.text,
              2: currentTimeStamp,
              3: existingLocation.id
            })
            .then(function (result) {
              return response.json({
                success: true,
                data: {
                  id: existingLocation.id
                }
              });
            }, function (error) {
              return response.json({
                success: false,
                message: error.message || 'Ups something went wrong!'
              });
            });
        }
        else {
          //insert new location
          db.run("INSERT INTO `location` (`userId`,`latitude`,`longitude`,`text`,`createdAt`,`updatedAt`) VALUES (?,?,?,?,?,?)",
            {
              1: userId,
              2: location.latitude,
              3: location.longitude,
              4: location.text,
              5: currentTimeStamp,
              6: currentTimeStamp
            })
            .then(function (result) {
              return response.status(201).json({
                success: true,
                data: {
                  id: result.stmt.lastID
                }
              });
            }, function (error) {
              return response.json({
                success: false,
                message: error.message || 'Ups something went wrong!'
              });
            });
        }
      }, function (error) {
        return response.json({
          success: false,
          message: error.message || 'Ups something went wrong!'
        });
      });
  }
};
