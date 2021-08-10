const UsuarioDB = require('../DB/usuariosDb');
const usuarioDB = new UsuarioDB();
/* ------------------ PASSPORT -------------------- */
const passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
/* ------------------ PASSPORT FACEBOOK -------------------- */
const facebook_client_id = process.argv[3] || process.env.FACEBOOK_CLIENT_ID;
const facebook_client_secret = process.argv[4] || process.env.FACEBOOK_CLIENT_SECRET;

passport.use(new FacebookStrategy({
    clientID: facebook_client_id.toString(),
    clientSecret: facebook_client_secret.toString(),
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'emails'],
    scope: ['email']
  }, async function (accessToken, refreshToken, userProfile, done) {
  
    // console.log(userProfile.displayName)
    let usuarios = await usuarioDB.listar();
  
    const usuario = usuarios.find(usuario => usuario.username == userProfile.displayName)
    // usuarioGlobal = userProfile.displayName;
    // console.log(userProfile.displayName);
  
    if (usuario) {
      
      usuario.contador = 0
  
      return done(null, usuario);
    }
    else{
      const user = {
        username: userProfile.displayName,
        facebookId: userProfile.id,
        email: userProfile.emails[0].value,
        foto: userProfile.photos[0].value,
      }
      usuarios.push(user)
      await usuarioDB.insertar(usuarios);
      
      return done(null, user);
    }
  
  }));
  
  passport.serializeUser(function (user, done) {
    done(null, user.username);
  });
  
  passport.deserializeUser(async function (username, done) {
    let usuarios = await usuarioDB.listar();
    const usuario = usuarios.find(usuario => usuario.username == username)
    done(null, usuario);
  });

  module.exports = {
    passport
  };