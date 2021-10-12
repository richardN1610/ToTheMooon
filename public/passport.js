// const passportStrategy = require('passport').Strategy;
// const bcrypt = require('bcrypt');

// async function authenticateUser(email,password,done){
//     const user = getEmail(email);
//     if(user == null){
//         return done(null, false, {message:"No User Found"});
//     }

//     try{
//         if(await bcrypt.compare(password), user.password){  //if password matches
//             return done(null,user)
//         }else{
//             return done(null,false, {message :"Incorrect Password"})
//         }
//     }catch(error){
//         return done(error)
//     }
// }

// function init(passport){
//     passport.use(new passportStrategy({username:'email'}),authenticateUser)
//     passport.serializeUser((user,done) => {

//     })
//     passport.deserializeUser((id,done) => {
        
//     })
// }

// module.exports = init();