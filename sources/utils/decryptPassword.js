import bcrypt from "bcrypt";

async function decryptPasswrod(password,user) {
    
    const hashPassword = await bcrypt.compare(password, user.password_hash)

    return hashPassword;

}

export default decryptPasswrod;