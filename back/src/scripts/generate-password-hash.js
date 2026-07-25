/* 
 * Generar contraseñas
 */
const bcrypt = require('bcryptjs');
const password = process.argv[2];

if (!password) {
    console.error('Uso: node src/scripts/generate-password-hash.js "yeslem1313"');
    process.exit(1);
}
const hash = bcrypt.hashSync(password, 10);
console.log('\nADMIN_PASSWORD_HASH=' + hash + '\n');
