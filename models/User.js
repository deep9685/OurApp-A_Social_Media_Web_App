require("dotenv").config();
const {Schema, model} = require("mongoose");

const {createHmac, randomBytes} = require("crypto");
const {createTokenForUser} = require("../services/authentication");

const userSchema = new Schema({
    userName:{
        type: String,
        required: true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type: String,
        required: true,
    },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {timestamps:true});

userSchema.pre("save", function(next) {
    const user = this;

    if(!user.isModified("password")) {
        return next();
    }

    const salt = randomBytes(16).toString();

    const hashedPassword = createHmac(process.env.SECRET, salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});



userSchema.static("matchPasswordAndGenerateToken", async function(userName, password){
    const user = await this.findOne({userName});

    // if(!user) throw new Error('User not found!');

    if(!user) {
        return 404;
    }

    // console.log("imhere");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac(process.env.SECRET, salt).update(password).digest("hex");

    if(hashedPassword !== userProvidedHash) {
        return 402;
    }

    const token = createTokenForUser(user);
    return token;
})

const User = model('User', userSchema);

console.log(User)

module.exports = User;