module.exports.SuccessResponse = (res, data) => {
    return res.json({
      Success: true,
      body: data,
      error: null,
    });
  };
  
  module.exports.ErrorResponse = (res, error) => {
    return res.json({ Success: false, body: null, error: error });
  };
  