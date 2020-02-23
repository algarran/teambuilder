const inquirer = require('inquirer');
const fs = require('fs');

const Manager = require('./lib/Manager');
const Intern = require('./lib/Intern');
const Engineer = require('./lib/Engineer');

const generateHTML = require('./templates/generateHTML');
const generateManager = require('./templates/generateManager');
const generateIntern = require('./templates/generateIntern');
const generateEngineer = require('./templates/generateEngineer');

function generateMemberHTML(members) {
    var HTML = '';
    members.forEach((URLSearchParams) => {
        switch (URLSearchParams.position) {
            case 'Manager':
                const manager = new Manager(URLSearchParams.name, URLSearchParams.id, URLSearchParams.email, URLSearchParams.info);
                HTML += generateManager.generateHTML(manager);
                break;
            case 'Intern':
                const intern = new Intern(URLSearchParams.name, URLSearchParams.id, URLSearchParams.email, URLSearchParams.info);
                HTML += generateIntern.generateHTML(intern);
                break;
            case 'Engineer':
                const engineer = new Engineer(URLSearchParams.name, URLSearchParams.id, URLSearchParams.email, URLSearchParams.info);
                HTML += generateEngineer.generateHTML(engineer);
                break;
        }
    }); 
    return HTML;
}

inquirer.registerPrompt('recursive', require('inquirer-recursive'));

inquirer.prompt([{
    type: 'recursive',
    message: 'Adding A New Team Member?',
    name: 'members',
    prompts: [
        {
            type: 'list',
            message: 'Choose The Team Member\'s Position: ',
            name: 'postion',
            choices: [
                'Manager',
                'Intern',
                'Engineer',
            ],
        },
        {
            type: 'input',
            name: 'name',
            message: 'What Is The Team Member\'s Name?',
            validate(value) {
                if ((/.+/).test(value)) { return true; }
                return 'Enter Name Please!';
            },
        },
        {
            type: 'input',
            name: 'id',
            message: 'Enter ID number: ',
            validate(value) {
                const number = /\d+/;
                if (number.test(value)) { return true; }
                return 'Enter ID Number Please!';
            },
        },
        {
            type: 'input',
            name: 'email',
            message: 'What Is The Team Member\'s Email?',
            validate(value) {
                if ((/.+/).test(value)) { return true; }
                return 'Enter Email Please!';
            },
        },
        {
            when(response) {
                if (response.position === 'Manager') {
                    return true;
                }
                return false;
            },
            type: 'input',
            name: 'info',
            message: 'What Is The Manager\'s Office Number?',
            validate(value) {
                if ((/.+/).test(value)) { return true; }
                return 'Enter Office Number Please!'
            },
        },
        {
            when(response) {
                if (response.position === 'Intern') {
                    return true;
                }
                return false;
            },
            type: 'input',
            name: 'info',
            message: 'Enter the Intern\'s School Name: ',
            validate(value) {
                if ((/.+/).test(value)) { return true; }
                return 'Enter School Name Please!'
            },
        },
        {
            when(response) {
                if (response.position === 'Engineer') {
                    return true;
                }
                return false;
            },
            type: 'input',
            name: 'info',
            message: 'What Is The Engineer\'s GitHub Username?',
            validate(value) {
                if ((/.+/).test(value)) { return true; }
                return 'Enter GitHub Username Please!';
            },
        },
    ],
}]).then((team) => {
    let HTML = generateMemberHTML(team.members);
    HTML = generateHTML.generateHTML(HTML);
    fs.writeFile('./output/team.html', HTML, (err) => {
        if (err) {
            return console.log(err);
        }
        console.log('Success! File written to team.html in the output folder');
    });
});