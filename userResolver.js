import User from '../../models/userModel.js';



import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import  validateUser from '../../validations/userValidations.js';


const userResolver = {

    Mutation: {
        createUser: async(_,{ name, email, password }) => {
            try {
                // Comprobar que el email no existe ya
                const existingUser = await User.findOne({ email });
                if(existingUser) {
                    throw new Error('No autorizado');

                    return {
                        token: null,
                        user: null,
                        errors: { email: "El email ya existe"}
                    }
                }

                // Comprobar que los datos sean validos
                const { isValid, errors }  = validateUser(name, email, password);

                if(!isValid){
                    return {
                      token: null,
                      user: null,
                      errors: errors,
                    }
                }

                // Hashear la contraseña
                const saltRound = 10;
                const passwordHashed = await bcrypt.hash(password, saltRound);

                const newUser = await User.create({name, email, password: passwordHashed});

                const token = jwt.sign(
                  { id: newUser._id, email: newUser.email },
                  process.env.JWT_SECRET,
                  { expiresIn: "7d" }
                );
                console.log("Usuario creado con token:", token);
                return { 
                  token: token,
                  user: newUser,
                  errors: null
                };
            } catch (error) {
                throw new Error("Error al crear usuario");
            }
        },
 
        login: async (_, { email, password }) => {
          try {
            console.log("Intentando login con:", email);
            // Buscar usuario por email
            const user = await User.findOne({ email }).select("+password");
            console.log(user)
            if (!user) {
              return {
                token: null,
                user: null,
                errors: { email: "Usuario no encontrado" }
              };
            }

            // Comparar contraseña
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
              return {
                token: null,
                user: null,
                errors: { email: "Email o contraseña incorrectos" }
              };
            }

            // Generar JWT
            const token = jwt.sign(
              { id: user._id, email: user.email },
              process.env.JWT_SECRET,
              { expiresIn: "7d" }
            );
            console.log("token generado:", token);
            return {
              token,
              user,
              errors: null
            };
          } catch (error) {
            console.error("Error en login:", error);
            throw new Error("Error al iniciar sesión");
          }
        }

    }
}
export default userResolver;
