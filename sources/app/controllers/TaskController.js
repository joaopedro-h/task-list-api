import connection from "../../database/connection";
import * as Yup from "yup";

class TaskController {

    async index(req, res) { // Método responsável por listar as tarefas do usuário.

        const schema = Yup.object().shape({ // Cria um schema para validar os dados enviados pelo usuário.
            check: Yup.boolean().required()
        });

        if (!(await schema.isValid(req.query))) { // Verifica se os dados enviados pelo usuário estão de acordo com o schema.
            return res.status(400).json({
                error: "Dados inválidos!"
            });             
        }

        const {check} = req.query; // Pega o status da tarefa informado nos parâmetros da query.

        const [userTasks] = await connection.execute( // Cria a query para buscar as tarefas do usuário de acordo com o status informado.
            `SELECT * FROM tasks
            WHERE user_id = ? AND check_task = ?`, [req.userId,check]
        );

        return res.status(200).json({ // Retorna as tarefas encontradas de acordo com o status selecionado.
            message: "Tarefas com o status selecionado",
            tarefas: userTasks
        });

    }

    async store(req, res) { // Método responsável por criar uma tarefa.

        const schema = Yup.object().shape({ // Cria um schema para validar os dados enviados pelo usuário.
            task: Yup.string().required()
        });

        if (!(await schema.isValid(req.body))) { // Verifica se os dados enviados pelo usuário estão de acordo com o schema.
            return res.status(400).json({
                error: "Falha ao cadastrar!"
            });              
        }

        const {task} = req.body; // Pega a descrição da tarefa enviada pelo usuário.

        const sqlCreateTask = await connection.execute( // Cria a query para cadastrar a nova tarefa.
        `INSERT INTO tasks (task, user_id)
        VALUES (?,?)`, [task,req.userId]);

        return res.status(201).json({ // Retorna a confirmação do cadastro com o ID da tarefa criada.
            message: "Tarefa criada com sucesso!",
            "ID da tarefa": sqlCreateTask[0].insertId
        });
        
    }

    async update(req, res) { // Método responsável por concluir uma tarefa.

        const schema = Yup.object().shape({ // Cria um schema para validar os dados enviados pelo usuário.
            task_id: Yup.string().required()
        });

        if (!(await schema.isValid(req.params))) { // Verifica se os dados enviados pelo usuário estão de acordo com o schema.
            return res.status(400).json({
                error: "Tarefa não selecionada!"
            });              
        }

        const {task_id} = req.params; // Pega o ID da tarefa informado na URL da requisição.

        const [task] = await connection.execute( // Cria a query para verificar se a tarefa existe.
        `SELECT * FROM tasks
        WHERE id = ?`, [task_id]);

        if (!task.length > 0) { // Verifica se não foi encontrada nenhuma tarefa com o ID informado.
            return res.status(400).json({
                error: "Tarefa não existe!"
            })
        }
        
        const [sqlCheckTask] = await connection.execute( // Cria a query para marcar a tarefa como concluída.
            `UPDATE tasks
            SET check_task = 1
            WHERE id = ? AND user_id = ?`, [task_id, req.userId]
        )

        if (sqlCheckTask.affectedRows === 0) { // Verifica se a tarefa não pertence ao usuário logado.
            return res.status(401).json({
                error: "Não é possível concluir tarefas de outros usuários!"
            })
        }

        return res.status(200).json({ // Retorna a confirmação da conclusão da tarefa.
            message: "Tarefa concluída com sucesso!",
            tarefa: task
        });

    }

    async destroy(req, res) { // Método responsável por deletar uma tarefa.

        const schema = Yup.object().shape({ // Cria um schema para validar os dados enviados pelo usuário.
            task_id: Yup.string().required()
        });

        if (!(await schema.isValid(req.params))) { // Verifica se os dados enviados pelo usuário estão de acordo com o schema.
            return res.status(400).json({
                error: "Tarefa não selecionada!"
            });              
        }

        const {task_id} = req.params; // Pega o ID da tarefa informado na URL da requisição.

        const [task] = await connection.execute( // Cria a query para verificar se a tarefa existe.
        `SELECT * FROM tasks
        WHERE id = ?`, [task_id]);

        if (!task.length > 0) { // Verifica se não foi encontrada nenhuma tarefa com o ID informado.
            return res.status(400).json({
                error: "Tarefa não existe!"
            })
        }

        const [sqlDeleteTask] = await connection.execute( // Cria a query para excluir a tarefa.
            `DELETE FROM tasks
            WHERE id = ? AND user_id = ?`, [task_id, req.userId]
        )

        if (sqlDeleteTask.affectedRows === 0) { // Verifica se a tarefa não pertence ao usuário logado.
            return res.status(401).json({
                error: "Não é possível remover tarefas de outros usuários!"
            })
        }

        return res.status(200).json({ // Retorna a confirmação da exclusão da tarefa.
            message: "Tarefa removida com sucesso!",
            tarefa: task
        });

    }

}

export default new TaskController();