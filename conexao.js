import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host     : '200.129.130.149',
    port: 20002,
    user     : 'almsfit',
    password : '12345678',
    database : 'almsfit_db'
});

// const conexao = await pool.getConnection();
export default pool;