const connection = require('../db/connection');

const getAllRoles = async function() {
    const [rows] = await connection.promise().query(`SELECT * FROM role`);
    return rows;
};

const addRole = async function({ title, salary, department_id }) {
    const [result] = await connection.promise().query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [title, salary, department_id]);
    return result;
};

module.exports = {
    getAllRoles,
    addRole
};
