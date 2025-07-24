const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Email must be valid',
  }),
  username: Joi.string().min(3).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters',
  }),
  fullName: Joi.string().min(3).required().messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 3 characters',
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
  }),
  authProvider: Joi.string().valid('local', 'google', 'github').required(),
  birthday: Joi.string().isoDate().required().messages({
    'string.empty': 'Birthday is required',
    'string.isoDate': 'Birthday must be a valid ISO date',
  }),
  location: Joi.object({
    country: Joi.string().required(),
    city: Joi.string().required(),
  }).required(),
  interests: Joi.array().items(Joi.string()).min(1).required().messages({
    'array.min': 'Please select at least one interest',
  }),
  language: Joi.string().optional(),
  bio: Joi.string().allow('').optional(),
});

module.exports = {registerSchema}