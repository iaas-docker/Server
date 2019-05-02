class ErrorHandler{

  constructor (){}

  static processBadRequestError(errors, res){
    res.status(422).json({errors: errors.array()});
  }

  static processError(err, res){
    let error = {
      message: JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    };
    error.response = err.response ?
      err.response.data ?
        err.response.data : error.response
      : undefined;
    res.status(400).send(error);
  }

}

module.exports = ErrorHandler;