import connection from "../../database/connection";
import * as Yup from "yup";
import encryptPassword from "../../utils/encryptPassword";
import decryptPassword from "../../utils/decryptPassword";

class UserController {

    async store(req, res){ // Método responsável por cadastrar um usuário.

        const schema = Yup.object().shape({ // Cria um schema para validar os dados enviados pelo usuário.
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        });

        if (!(await schema.isValid(req.body))) { // Verifica se os dados enviados pelo usuário estão de acordo com o schema.
            return res.status(400).json({
                error: "Dados inválidos!"
            });            
        }

        const {name, email, password} = req.body; // Pega o nome, email e senha enviados pelo usuário.

        const [userExists] = await connection.execute( // Executa a consulta para verificar se o email já está cadastrado.
        `SELECT email FROM users
        WHERE email = ?`, [email]);
        
        if (userExists.length > 0) { // Verifica se foi encontrado algum usuário com o email informado.
            return res.status(401).json({
                error: "Email já em uso!"
            });
        }
        
        const hashPassword = await encryptPassword(password); // Cria o hash da senha antes de salvar no banco de dados, (criptografa a senha antes de salvar).

        const sqlUserCreate = // Cria a query para cadastrar o novo usuário.
        `INSERT INTO users (name, email, password_hash)
        VALUES (?, ?, ?)`;

        const [result] = await connection.execute(sqlUserCreate,[name, email, hashPassword]); // Executa a consulta para cadastrar o usuário no banco de dados.

        return res.status(201).json({
            message: "Usuário criado com sucesso!",
            "ID do usurário": result.insertId
        });
    }

    async update(req, res){ // Método responsável por atualizar o cadastro de um usuário.

        const schema = Yup.object().shape({ // Cria um schema para validar os dados enviados pelo usuário.
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
        
        if (!(await schema.isValid(req.body))) { // Verifica se os dados enviados pelo usuário estão de acordo com o schema.
            return res.status(400).json({
                error: "Dados inválidos!"
            });            
        }

        const {name, email, oldPassword, password} = req.body; // Pega os dados enviados pelo usuário para atualização do cadastro.

        const [resultUser] = await connection.execute( // Executa a consulta e guarda o resultado em "resultUser".
        `SELECT * FROM users
        WHERE id = ?`, [req.userId]);

        const user = resultUser[0]; // Guarda os dados atuais do usuário.
        
        if (email !== user.email) { // Verifica se o usuário está tentando alterar o email atual.
            
            const [userExists] = await connection.execute(
            `SELECT email FROM users
            WHERE email = ?`, [email]);

            if (userExists.length > 0) { // Verifica se o email informado já pertence a outro usuário.
                return res.status(400).json({
                    error: "Email já em uso!"
                });
            }
        }

        if (password) { // Verifica se o usuário está tentando alterar a senha.
            
            if (!oldPassword) { // Verifica se a senha atual foi informada.
                return res.status(401).json({
                    error: "Informe sua senha atual!"
                });
            }
            
            const hashPassword = await decryptPassword(oldPassword,user); // Verifica se a senha atual informada confere com a senha cadastrada.

            if (!hashPassword) { // Verifica se a senha atual informada está incorreta.
                return res.status(401).json({
                    error: "Senha incorreta!"
                });
            }
        }

        const fields = [];
        const values = [];

        if (name) { // Adiciona o nome à atualização, caso tenha sido informado.
            fields.push("name = ?");
            values.push(name);
        }

        if (email) { // Adiciona o email à atualização, caso tenha sido informado.
            fields.push("email = ?");
            values.push(email);
        }

        if (password) { // Adiciona a nova senha à atualização, caso tenha sido informada.

            const hashPassword = await encryptPassword(password); // Cria o hash da nova senha antes de salvar no banco de dados (criptografa a senha antes de salvar).

            fields.push("password_hash = ?");
            values.push(hashPassword);
        }

        values.push(req.userId); // Adiciona o ID do usuário para identificar qual registro será atualizado.

        const sqlUpdate =
        `UPDATE users
        SET ${fields.join(", ")}
        WHERE id = ?`
        
        await connection.execute(sqlUpdate,values); // Executa a atualização do usuário no banco de dados.

        return res.json({ // Retorna os dados atualizados do usuário.
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