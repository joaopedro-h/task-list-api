import connection from "../../database/connection";
import * as Yup from "yup";
import encryptPassword from "../../utils/encryptPassword";
import decryptPassword from "../../utils/decryptPassword";

class UserController {

    async store(req, res){ // Método responsável por cadastrar um usuário.

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: "Dados inválidos!"
            });            
        }

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

    async update(req, res){ // Método responsável por atualizar o cadastro de um usuário.

        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when("oldPassword", (oldPassword, field) => 
                oldPassword ? field.required() : field
            ),
            confirmPassword: Yup.string().when("password", (password, field) => 
                password ? field.required().oneOf([Yup.ref("password")]) : field
            ),
        });
        
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: "Dados inválidos!"
            });            
        }

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