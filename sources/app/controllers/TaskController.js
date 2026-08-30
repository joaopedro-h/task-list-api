import connection from "../../database/connection";
import * as Yup from "yup";

class TaskController {

    async index(req, res) {

        const schema = Yup.object().shape({
            check: Yup.boolean().required()
        });

        if (!(await schema.isValid(req.query))) {
            return res.status(400).json({
                error: "Dados inválidos!"
            });             
        }

        const {check} = req.query;

        const [userTasks] = await connection.execute(
            `SELECT * FROM tasks
            WHERE user_id = ? AND check_task = ?`, [req.userId,check]
        );

        return res.status(200).json({
            message: "Tarefas com o status selecionado",
            tarefas: userTasks
        });

    }

    async store(req, res) {

        const schema = Yup.object().shape({
            task: Yup.string().required()
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({
                error: "Falha ao cadastrar!"
            });              
        }

        const {task} = req.body;

        const sqlCreateTask = await connection.execute(
        `INSERT INTO tasks (task, user_id)
        VALUES (?,?)`, [task,req.userId]);

        return res.status(201).json({
            message: "Tarefa criada com sucesso!",
            "ID da tarefa": sqlCreateTask[0].insertId
        });
        
    }

    async update(req, res) {

        const schema = Yup.object().shape({
            task_id: Yup.string().required()
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({
                error: "Tarefa não selecionada!"
            });              
        }

        const {task_id} = req.params;

        const [task] = await connection.execute(
        `SELECT * FROM tasks
        WHERE id = ?`, [task_id]);

        if (!task.length > 0) {
            return res.status(400).json({
                error: "Tarefa não existe!"
            })
        }
        
        const [sqlCheckTask] = await connection.execute(
            `UPDATE tasks
            SET check_task = 1
            WHERE id = ? AND user_id = ?`, [task_id, req.userId]
        )

        if (sqlCheckTask.affectedRows === 0) {
            return res.status(401).json({
                error: "Não é possível concluir tarefas de outros usuários!"
            })
        }

        return res.status(200).json({
            message: "Tarefa concluída com sucesso!",
            tarefa: task
        });

    }

    async destroy(req, res) {

        const schema = Yup.object().shape({
            task_id: Yup.string().required()
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({
                error: "Tarefa não selecionada!"
            });              
        }

        const {task_id} = req.params;

        const [task] = await connection.execute(
        `SELECT * FROM tasks
        WHERE id = ?`, [task_id]);

        if (!task.length > 0) {
            return res.status(400).json({
                error: "Tarefa não existe!"
            })
        }

        const [sqlDeleteTask] = await connection.execute(
            `DELETE FROM tasks
            WHERE id = ? AND user_id = ?`, [task_id, req.userId]
        )

        if (sqlDeleteTask.affectedRows === 0) {
            return res.status(401).json({
                error: "Não é possível remover tarefas de outros usuários!"
            })
        }

        return res.status(200).json({
            message: "Tarefa removida com sucesso!",
            tarefa: task
        });

    }

}

export default new TaskController();