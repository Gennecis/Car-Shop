const validator = require('../helpers/validate');

const saveUser = (req, res, next) => {
  const validationRule = {
    email: 'required|email',
    username: 'required|string',
    name: 'required|string',
    ipaddress: 'required',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

const saveCar = (req, res, next) => {
  const validationRule = {
    carName: 'required|string',
    brand: 'required|string',
    year: 'required|integer',
    color: 'required|string',
    price: 'required|integer',
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: 'Validation failed',
        data: err
      });
    } else {
      next();
    }
  });
};

module.exports = {
  saveUser,
  saveCar
};