import bcrypt from "bcrypt";

async function encryptPassword(password) {
    
    const hashPassword = await bcrypt.hash(password, 10);

    return hashPassword;

}

export default encryptPassword;