module.exports = function(app) {
  var express = require('express');
  var presenceRouter = express.Router();

  presenceRouter.post('/', function(req, res) {
    if (req.body.value === 'fail') {
      res.status(422).json({
        "errors": [
          {
            "status": "422",
            "title": "Validation Failed",
            "detail": "The validation failed.."
          }
        ]
      });
    } else {
      res.status(204).send();
    }
  });

  app.use('/api/presence', presenceRouter);
};
