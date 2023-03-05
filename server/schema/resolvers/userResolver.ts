import User from "../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server";
import { validateRegisterInput, validateLoginInput } from "../../utils/validate"

type RegisterUserInput = {
    input: {
        username: string;
        password: string;
        confirmPassword: string;
        email: string;
    };
};
type LoginUserInput = {
    input: {
        username: string;
        password: string;
    };
};

const secret = "test";

export const userResolver = {
    Query: {
        getUser: async () => {
            try {
                const users = await User.find()
                return users
            } catch (error) {
                console.log("Error Occurred", error);
            }
        }
    },
    Mutation: {
        registerUser: async (
            _: object,
            args: RegisterUserInput
        ) => {
            const { username, password, confirmPassword, email } = args.input;

            const { valid, errors } = validateRegisterInput(
                username,
                email,
                password,
                confirmPassword
            );
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }

            const user = await User.findOne({ username })

            if (user) {
                throw new UserInputError("Username is taken", {
                    errors: {
                        username: "Username is already in use."
                    }
                });
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            const newUser = new User({
                email,
                username,
                password: hashedPassword,
            })
            const result = await newUser.save();
            const token = jwt.sign({
                username: result.username,
                id: result._id
            }, secret, { expiresIn: "2h" })
            return {
                ...result.toObject(),
                id: result._id,
                token

            }
        },
        loginUser: async (_: object, args: LoginUserInput) => {
            const { username, password } = args.input
            const { valid, errors } = validateLoginInput(username, password)
            if (!valid) {
                throw new UserInputError('Errors', { errors });
            }
            const user = await User.findOne({ username })
            if (!user) {
                throw new UserInputError("Username doesn't exist", {
                    errors: {
                        username: "Username doesn't exists."
                    }
                });
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong crendetials';
                throw new UserInputError('Wrong crendetials', { errors });
            }
            const token = jwt.sign({
                username: user.username,
                id: user._id
            }, secret, { expiresIn: "2h" })
            return {
                ...user.toObject(),
                id: user._id,
                token

            }
        }
    },
};
