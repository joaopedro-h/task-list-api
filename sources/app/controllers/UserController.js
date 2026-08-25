import connection from "../../database/connection";
import encryptPassword from "../../utils/encryptPassword";

class UserController {

    async store(req, res){

        const {name, email, password} = req.body;

        const [userExists] = await connection.execute(
        `SELECT email FROM users
        WHERE email = ?`, [email]);
        
        if (userExists.length > 0) {
            return res.status(401).json({
                error: "Email já em uso!"
            });
        }
        
        const hashPassword = await encryptPassword(password);

        const sqlUserCreate = 
        `INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)`;

        const [result] = await connection.execute(sqlUserCreate,[name, email, hashPassword]);

        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            "ID do usurário": result.insertId
        });
    }

}

export default new UserController();