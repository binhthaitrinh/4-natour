// catch a async func is different from regular
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
    // next() will automatically receive err as arg
    // fn(req, res, next).catch(next);
  };
};
