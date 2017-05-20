var path = require('path');

module.exports = {
  index: function (req, res) {
    res.sendFile('index.html', {
      root: path.join(__dirname, '../public')
    });
  }
};
