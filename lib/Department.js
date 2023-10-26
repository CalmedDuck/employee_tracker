const connection = require('../db/connection');

const getAllDepartments = async function() {
    const [rows] = await connection.promise().query(`SELECT * FROM department`);
    return rows;
};

const addDepartment = async function(departmentName) {
    const [result] = await connection.promise().query(`INSERT INTO department (name) VALUES (?)`, departmentName);
    return result;
};

module.exports = {
    getAllDepartments,
    addDepartment
};
