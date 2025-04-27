const { body } = require("express-validator");
const { userByUsername } = require("../db/queries");

const emptyErr = "is required";
const alphaErr = 'must only contain letters';
const alphaNumErr = 'must only contain letters or numbers';

const getRangeLengthErr = (min, max) => `must be between ${min} and ${max} characters.`;
const getMinLengthErr = min => `must be atleast ${min} characters.`;
const getMaxLengthErr = max => `must be ${max} or less characters.`;

const validateUser = [
     body("username").trim()
          .notEmpty().withMessage(`User name ${emptyErr}`)
          .isAlphanumeric('en-US').withMessage(`User name ${alphaNumErr}`)
          .isLength({ min: 1, max: 30 }).withMessage(`User name ${getRangeLengthErr(1, 30)}`)
          .custom(async (username) => {
               const existingUser = await userByUsername(username); 
               
               if(existingUser) {
                    throw new Error(`Username ${username} has already been taken`);
               }
               return true;
          }),
     body("displayname").trim()
          .notEmpty().withMessage(`Display name ${emptyErr}`)
          .isAlphanumeric('en-US').withMessage(`Display name ${alphaNumErr}`)
          .isLength({ min: 1, max: 30 }).withMessage(`Display name ${getRangeLengthErr(1, 30)}`),
     body("password")
          .isLength({ min: 6 }).withMessage(`Password ${getMinLengthErr(6)}`)
          .isLength({ max: 50 }).withMessage(`Password ${getMaxLengthErr(50)}`)
          .custom((password, { req }) => {
               if(password !== req.body.confirmpassword) {
                    throw new Error("Password fields do not match");
               };   
               return true;
          }),
];

module.exports = {
     validateUser,
};
