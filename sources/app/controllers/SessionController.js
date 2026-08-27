import jwt from "jsonwebtoken";
import connection from "../../database/connection";
import decryptPassword from "../../utils/decryptPassword";
import authConfig from "../../config/auth";

class SessionController {

    async store(req, res){

        const {email, password} = req.body;
        
        const [resultUsers] = await connection.execute(
        `SELECT * FROM users
        WHERE email = ?`, [email]); 
        
        if (!resultUsers.length > 0) {
            return res.status(401).json({
                error: "Usuário não encontrado!"
            });
        }
        
        const user = resultUsers[0];

        const hashPassword = await decryptPassword(password, user);

        if (!hashPassword) {
            return res.status(401).json({
                error: "Senha incorreta!"
            });            
        }

        const {id, name} = user;

        return res.status(200).json({
            message: "Login realizado com sucesso!",
            user:{
                id,
                name,
                email
            },
            token: jwt.sign({id}, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            }),
        });
    }
}

export default new SessionController();