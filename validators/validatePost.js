const { body } = require("express-validator");

const emptyErr = "is required";

const getRangeLengthErr = (min, max) => `must be between ${min} and ${max} characters.`;
const getMinLengthErr = min => `must be atleast ${min} characters.`;
const getMaxLengthErr = max => `must be ${max} or less characters.`;

const validatePost = [
     body("posttitle").trim()
          .notEmpty().withMessage(`Post title ${emptyErr}`)
          .isLength({ min: 1, max: 50 }).withMessage(`Post title ${getRangeLengthErr(1, 50)}`),
     body("postbody").trim()
          .notEmpty().withMessage(`Post title ${emptyErr}`)
          .isLength({ min: 1 }).withMessage(`Password ${getMinLengthErr(1)}`)
          .isLength({ max: 400 }).withMessage(`Password ${getMaxLengthErr(400)}`),

];

module.exports = {
     validatePost,
};
