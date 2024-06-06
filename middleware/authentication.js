const {validateToken} = require("../services/authentication");

function checkForAuthenticationCookie(cookieName){
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];

        if(!tokenCookieValue){
            return res.redirect('/');
            // return next()
        }

        try{
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            return next();  
        }catch(error) {
            console.log("token not generated");
            return res.redirect('/');
        }
    };   
}

module.exports ={
    checkForAuthenticationCookie,
};