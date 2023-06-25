const { UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { validateRegisterInput, validateLoginInput } = require('../../utils/validator')
const { SECRET_KEY } = require('../../config')
const User = require('../../models/Users')

const generateToken = (user) => {
    return jwt.sign({
            id: user.id,
            email: user.email,
            username: user.username
        },
        SECRET_KEY, { expiresIn: '1h' }
    )
}

module.exports = {
    Mutation: {
        async login(_, { username, password },
            context,
            info) {
            const { valid, errors } = validateLoginInput(username, password)
            const user = await User.findOne({ username })

            if (!user) {
                errors.general = 'User not found'
                throw new UserInputError('User not found', { errors })
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong password/username';
                throw new UserInputError('Wrong Password', { errors })
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user._id,
                token
            };
        },
        async register(
            _, {
                registerInput: { username, password, confirmPassword, email }
            },
            context,
            info
        ) {
            const { valid, errors } = validateRegisterInput(username, password, confirmPassword, email)
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }
            // TODO: Make sure user doesn't exist already
            const checkUser = await User.findOne({ username })

            if (checkUser) {
                throw new UserInputError('Username taken', {
                    errors: {
                        username: "Username is already taken"
                    }
                })
            }

            password = await bcrypt.hash(password, 12)
            const newUser = new User({
                email,
                username,
                password,
                createdAt: new Date().toISOString(),

            })
            const res = await newUser.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
}