const inquirer = require('inquirer');
const connection = require('./db/connection');
const employeeOps = require('./lib/Employee'); 
const roleOps = require('./lib/Role');  
const departmentOps = require('./lib/Department')

async function init() {
    console.log("About to start inquirer...");
    const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            'View all departments', 
            'View all roles', 
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Exit'
        ]
    });

    switch(action) {
        case 'View all departments':
            const departments = await departmentOps.getAllDepartments();
            console.table(departments);
            break;
        
        case 'View all roles':
            const roles = await roleOps.getAllRoles();
            console.table(roles);
            break;

        case 'View all employees':
            const employees = await employeeOps.getAllEmployees();
            console.table(employees);
            break;

        case 'Add a department':
            const { deptName } = await inquirer.prompt({
                type: 'input',
                name: 'deptName',
                message: 'Enter the name of the new department:'
            });
            await departmentOps.addDepartment(deptName);
            console.log('Department added successfully!');
            break;

        case 'Add a role':
            const roleData = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Enter role title:'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'Enter role salary:'
                },
                {
                    type: 'input',
                    name: 'department_id',
                    message: 'Enter department id for the role:'
                }
            ]);
            await roleOps.addRole(roleData);
            console.log('Role added successfully!');
            break;

        case 'Add an employee':
           
            break;

        case 'Update an employee role':
            // Get a list of all employees
            const allEmployees = await employeeOps.getAllEmployees();
            const employeeChoices = allEmployees.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }));

            // Get a list of all roles
            const allRoles = await roleOps.getAllRoles();
            const roleChoices = allRoles.map(role => ({
                name: role.title,
                value: role.id
            }));

            // Prompt user to choose an employee and a new role
            const { employee_id, new_role_id } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee_id',
                    message: 'Select an employee to update:',
                    choices: employeeChoices
                },
                {
                    type: 'list',
                    name: 'new_role_id',
                    message: 'Select the new role for the employee:',
                    choices: roleChoices
                }
            ]);

            // Update the employee's role in the database
            await employeeOps.updateEmployeeRole({ employee_id, new_role_id });
            console.log('Employee role updated successfully!');
            break;

        case 'Exit':
            connection.end();
            process.exit();
            break;

        default:
            console.log('Invalid action!');
            break;
    }

    init();  // Loop back to main menu
}

init();
