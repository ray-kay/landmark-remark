module.exports = {
  saveLocation: function(request, response, next) {
    console.log(request.body.location);

    return response.json({
      success: true,
      data: 'test'
    });

  }
};
