const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
	// Authentication middleware for protected customer routes
	try {
		if (req.session && req.session.authorization && req.session.authorization.accessToken) {
			const token = req.session.authorization.accessToken;
			try {
				const decoded = jwt.verify(token, 'access');
				// Attach username to request for downstream handlers
				req.user = decoded.username;
				return next();
			} catch (err) {
				return res.status(401).json({message: 'Invalid or expired token'});
			}
		} else {
			return res.status(403).json({message: 'Unauthorized: No token provided'});
		}
	} catch (err) {
		return res.status(500).json({message: 'Auth middleware error'});
	}
});
 
const PORT = process.env.PORT || 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
