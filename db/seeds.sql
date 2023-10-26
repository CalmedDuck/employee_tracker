USE company_db;

INSERT INTO department (name) VALUES ("Sales"), ("Engineering"), ("HR");

INSERT INTO role (title, salary, department_id) VALUES 
    ("Sales Lead", 100000, 1),
    ("Software Engineer", 120000, 2),
    ("HR", 80000, 3);

INSERT INTO employee (first_name, last_name, role_id) VALUES 
    ("Brock ", "Williams", 1),
    ("David", "Smith", 2);
