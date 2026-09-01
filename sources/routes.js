import {Router} from "express";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";
import TaskController from "./app/controllers/TaskController";
import AuthMiddleware from "./app/middlewares/authentication";

const routes = new Router(); // "routes" armazena o Router onde as rotas serão criadas.

routes.post("/users", UserController.store); // Cria a rota para cadastrar um usuário.

routes.get("/sessions", SessionController.store); // Cria a rota para o usuário realizar o login, gerando também um token de acesso.

routes.use(AuthMiddleware); // Middleware responsável por validar o token enviado pelo o usário.

routes.put("/users", UserController.update); // Cria a rota para editar dados do usuário.

routes.post("/tasks", TaskController.store); // Cria a rota para criar tarefas.

routes.get("/tasks", TaskController.index); // Cria a rota para exibir as tarefas, podendo escolher entre pendentes ou realizadas.

routes.put("/tasks/{:task_id}", TaskController.update); // Cria a rota para concluir a tarefa selecionada.

routes.delete("/tasks/{:task_id}", TaskController.destroy); // Cria a rota para deletar a tarefa selecionada.


export default routes; // Exporta o routes para ser usado no "app.js".