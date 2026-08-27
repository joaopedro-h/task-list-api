import jwt from "jsonwebtoken"; // Importa o jsonwebtoken para trabalhar com a criação e validação dos tokens.
import {promisify} from "util"; // Importa o promisify para transformar o jwt.verify em uma Promise e poder utilizar com async/await.
import authConfig from "../../config/auth"; // Importa as configurações de autenticação, como o "secret" utilizado para validar o token.

export default async (req, res, next) => {

    const authHeader = req.headers.authorization; // Recebe o token enviado pelo usuário na requisição através do cabeçalho "Authorization".

    if (!authHeader) { // Verifica se o cabeçalho "Authorization" foi enviado e se o token existe.
        return res.status(401).json({
            error: "Token não existe!"
        });
    }

    const [, token] = authHeader.split(" "); // Separa o "Bearer" do token utilizando o split e guarda somente o token na variável.

    try {

        const decoded = await promisify(jwt.verify)(token, authConfig.secret); // Verifica se o token é válido utilizando o secret e, caso seja válido, decoded recebe as informações que estavam no payload do token.

        req.userId = decoded.id; // Pega o ID que estava no payload do token e coloca esse ID dentro da requisição para ser utilizado nas próximas etapas. "ex: (req.userId = 15)"

        return next(); // Confirma que a validação do token deu certo e passa a requisição para a próxima etapa, como os controllers por exemplo.

    } catch (error) {

        return res.status(401).json({ // Retorna para o usuário que o token é inválido caso a validação falhe.
            error: "Token inválido!"
        });
    }

}