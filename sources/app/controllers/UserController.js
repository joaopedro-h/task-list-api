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

        const {name, email, oldPassword, password} = req.body;

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

        if (password) {
            
            if (!oldPassword) {
                return res.status(401).json({
                    error: "Informe sua senha atual!"
                });
            }
            
            const hashPassword = await decryptPassword(oldPassword,user);

            if (!hashPassword) {
                return res.status(401).json({
                    error: "Senha incorreta!"
                });
            }
        }

        const fields = [];
        const values = [];


        if (name) {
            fields.push("name = ?");
            values.push(name);
        }

        if (email) {
            fields.push("email = ?");
            values.push(email);
        }

        if (password) {

            const hashPassword = await encryptPassword(password);

            fields.push("password_hash = ?");
            values.push(hashPassword);
        }

        values.push(req.userId);

        const sqlUpdate =
        `UPDATE users
        SET ${fields.join(", ")}
        WHERE id = ?`
        
        await connection.execute(sqlUpdate,values);

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