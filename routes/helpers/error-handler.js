class ErrorHandler{

  constructor (){}

  static errorCustomMessage(message, res){
    let error = {
      message: message
    };
    return res.status(422).send(error);
  }

  static processBadRequestError(errors, res){
    res.status(422).json({errors: errors.array()});
  }

  static processError(err, res){
    console.log('File: error-handler.js, Line 17', err);
    let error = {
      message: JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    };
    error.response = err.response ?
      err.response.data ?
        err.response.data : error.response
      : undefined;
    return res.status(400).send(error);
  }

}

module.exports = ErrorHandler;