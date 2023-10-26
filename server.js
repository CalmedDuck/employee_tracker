const inquirer = require('inquirer');
const connection = require('./db/connection');
const employeeOps = require('./lib/Employee'); 
const roleOps = require('./lib/Role');  
const departmentOps = require('./lib/Department');

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
            const allRolesForEmployee = await roleOps.getAllRoles();
            const roleChoicesForEmployee = allRolesForEmployee.map(role => ({
                name: role.title,
                value: role.id
            }));
            
            const potentialManagers = await employeeOps.getAllEmployees();
            const managerChoices = potentialManagers.map(manager => ({
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id
            }));

            managerChoices.push({ name: 'None', value: null });
            
            const employeeData = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Enter the first name of the employee:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Enter the last name of the employee:'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Select the role for the employee:',
                    choices: roleChoicesForEmployee
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Select the manager for the employee:',
                    choices: managerChoices
                }
            ]);

            await employeeOps.addEmployee(employeeData);
            console.log('Employee added successfully!');
            break;

        case 'Update an employee role':
            const allEmployees = await employeeOps.getAllEmployees();
            const employeeChoices = allEmployees.map(employee => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }));

            const allRoles = await roleOps.getAllRoles();
            const roleChoices = allRoles.map(role => ({
                name: role.title,
                value: role.id
            }));

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
