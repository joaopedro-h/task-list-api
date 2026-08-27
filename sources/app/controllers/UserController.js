import connection from "../../database/connection";
import encryptPassword from "../../utils/encryptPassword";
import decryptPassword from "../../utils/decryptPassword";

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

    async update(req, res){

        const {name, email, oldPassword} = req.body;

        const [resultUser] = await connection.execute(
        `SELECT * FROM users
        WHERE id = ?`, [req.userId]);

        const user = resultUser[0];
        
        if (email !== user.email) {
            
            const [userExists] = await connection.execute(
            `SELECT email FROM users
            WHERE email = ?`, [email]);

            if (userExists.length > 0) {
                return res.status(400).json({
                    error: "Email já em uso!"
                });
            }
        }

        if (oldPassword) {

            const hashPassword = await decryptPassword(oldPassword,user);

            if (!hashPassword) {
                return res.status(401).json({
                    error: "Senha incorreta!"
                })
            }
        }

        await connection.execute(
            "UPDATE users SET name = ?, email = ? WHERE id = ?",
            [name, email, req.userId]
        );

        return res.json({
            message: "Usuário atualizado",
            user:{
                id: req.userId,
                name,
                email
            }
        });
    
    }
}

export default new UserController();