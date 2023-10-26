const connection = require('../db/connection');

const getAllEmployees = async function() {
    const [rows] = await connection.promise().query(`SELECT * FROM employee`);
    return rows;
};

const addEmployee = async function({ first_name, last_name, role_id, manager_id }) {
    const [result] = await connection.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`, [first_name, last_name, role_id, manager_id]);
    return result;
};

const updateEmployeeRole = async function({ employee_id, new_role_id }) {
    const [result] = await connection.promise().query(`UPDATE employee SET role_id = ? WHERE id = ?`, [new_role_id, employee_id]);
    return result;
};

module.exports = {
    getAllEmployees,
    addEmployee,
    updateEmployeeRole
};
