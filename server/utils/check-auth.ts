import { AuthenticationError } from 'apollo-server';
import jwt from 'jsonwebtoken';
const SECRET_KEY = "test"

type Props = {
    req: {
        headers: {
            authorization: string
        }
    };
}
export default (context: Props) => {
    const authHeader = context.req.headers.authorization;
    
    if (authHeader) {
        const token = authHeader.split('Bearer ')[1];
        if (token) {
            try {
                const decodedToken = jwt.verify(token, SECRET_KEY) as { id: string, username : string };
                const user = { id: decodedToken.id, username : decodedToken.username };
                return user;
              } catch (err) {
                throw new AuthenticationError('Invalid/Expired token');
            }
        }
        throw new Error("Authentication token must be 'Bearer [token]");
    }
    throw new Error('Authorization header must be provided');
};