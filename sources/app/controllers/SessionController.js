import jwt from "jsonwebtoken";
import connection from "../../database/connection";
import decryptPassword from "../../utils/decryptPassword";
import authConfig from "../../config/auth";

class SessionController {

    async store(req, res){ // Método responsável por realizar o login do usuário.

        const {email, password} = req.body; // Pega o email e a senha enviados pelo usuário na requisição.
        
        const [resultUsers] = await connection.execute( // Executa a consulta para buscar o usuário pelo email.
        `SELECT * FROM users
        WHERE email = ?`, [email]); 
        
        if (!resultUsers.length > 0) { // Verifica se nenhum usuário foi encontrado com o email informado.
            return res.status(401).json({
                error: "Usuário não encontrado!"
            });
        }
        
        const user = resultUsers[0]; // Pega o primeiro usuário encontrado no resultado da consulta.

        const hashPassword = await decryptPassword(password, user); // Compara a senha informada com a senha armazenada no banco de dados.

        if (!hashPassword) { // Verifica se a senha informada está incorreta.
            return res.status(401).json({
                error: "Senha incorreta!"
            });            
        }

        const {id, name} = user; // Pega o ID e o nome do usuário encontrado.

        return res.status(200).json({ // Retorna uma resposta informando que o login foi realizado com sucesso.
            message: "Login realizado com sucesso!",
            user:{
                id,
                name,
                email
            },
            token: jwt.sign({id}, authConfig.secret, { // Cria o token JWT utilizando o ID do usuário como payload.
                expiresIn: authConfig.expiresIn // Define o tempo de duração do token.
            }),
        });
    }
}

export default new SessionController();