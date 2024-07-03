import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
const secret : string  = process.env.JWT_SECRET || "" ;

const isAuthenticated = (req: Request , res: Response) => {

		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer")) {
			return res
				.status(400)
				.json({ msg: "Access denied, no token provided" });
		}
		const token = authHeader.split(" ")[1];

		try {
            const decoded = jwt.verify(token, secret);
           
		} catch (err) {
			return res
				.status(401)
				.json({ msg: "Authentication failed" });
		}
	}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (isAuthenticated( req , res)) {
        next();
    } else {
        // User is not authenticated, send an error response
        res.status(401).json({ error: 'Unauthorized' });
    }
};

export default authMiddleware;