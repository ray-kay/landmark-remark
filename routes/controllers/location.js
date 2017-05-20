var db = require('sqlite');


module.exports = {
  getAllLocation: function(request, response, next) {
    db.all('SELECT * FROM `Location`').then(function(result){
      return response.json({
        success: true,
        data: result
      });
    });
  },
  saveLocation: function(request, response, next) {
    console.log(request.body.location);

    return response.json({
      success: true,
      data: 'test'
    });
  }
};
