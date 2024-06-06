const User = require("../models/User");

async function handleCheckUser(req, res) {
    try{
        const {userName} = req.query;

      const isUser = await User.findOne({userName});


      if(isUser){
        res.json({exists: true});
      } else{
        res.json({exists: false});
      }
  } catch(error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function handleCheckEmail(req, res) {
    try{
        const {email} = req.query;

      const user = await User.findOne({email});

      if(user){
        res.json({exists: true});
      } else{
        res.json({exists: false});
      }
  } catch(error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


async function handleUserSingup(req, res) {
    const {userName, email, password} = req.body;

  await User.create({
    userName,
    email,
    password,
  }).then(() => {
    req.flash('success', 'User registered successfully. Please sign in.');
    res.redirect("/");
  }).catch((err) => {
    req.flash('error', 'Error registering user. Please try again.');
    res.redirect("/"); // Redirect to signup page if registration fails
  });
};


async function handleUserSignin(req, res) {
    const {userName, password} = req.body;

    try{
      const token = await User.matchPasswordAndGenerateToken(userName, password);

      // console.log(token);

      if(token === 404){
        req.flash('error', 'User not Found, Please registered first.');
        return res.redirect("/");
      }

      if(token === 402){
        req.flash('error', 'Incorrect Password!');
        return res.redirect("/");
      }

      // res.json({token});
      return res.cookie("token", token).redirect('/dashboard');
      

      
    }catch(error) {
      return res.redirect("/", {
          error: "Incorrect Email or Password",
      });
  }
};
// async function handleCheckEmail(req, res) {
    
// }

module.exports={
    handleCheckUser,
    handleCheckEmail,
    handleUserSingup,
    handleUserSignin,
};