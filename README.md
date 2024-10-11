<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).

#### Operators
we do have following operators: AND, OR, >, <, =, !=, <=, >=, IN, NOT IN


{
    "emp_id": 1,
    "first_name": "Kimberly",
    "last_name": "Sullivan",
    "email": "jason.davis@company.com",
    "phone_number": "+1-896-730-1736x7296",
    "dob": "1972-12-31",
    "gender": "Female",
    "marital_status": "Single",
    "designation": "Chief Architect",
    "department": "HR",
    "employee_band": "A2",
    "employee_type": "Contract",
    "status": "On Leave",
    "location": "Tokyo",
    "doj": "2021-12-19",
    "work_shift": "Day",
    "salary": 67960,
    "bonus": 4704.23,
    "benefits": [
        "Health Insurance"
    ],
    "stock_options": 445,
    "overtime_eligibility": true,
    "annual_leave_balance": 18,
    "sick_leave_balance": 6,
    "experience": 11,
    "performance_rating": 1.1,
    "last_promotion_date": "2022-04-28",
    "years_since_last_promotion": 2,
    "performance_goal_completion": 78,
    "project_completion_rate": 98.59,
    "manager_id": null,
    "team_size": 20,
    "direct_reports": 1,
    "project_allocations": 4,
    "education": "Bachelor's",
    "certifications": [
        "PMP",
        "Scrum Master",
        "Google Cloud Certified"
    ],
    "skills": [
        "SQL",
        "Customer Relations"
    ],
    "languages_spoken": [
        "German",
        "English"
    ],
    "training_completed": true,
    "professional_memberships": [],
    "office_floor": 3,
    "cubicle_number": "C-744",
    "parking_spot": null,
    "remote_work": false,
    "preferred_work_location": "Chicago",
    "tax_id": "736-72-6671",
    "bank_account_number": "GB59WHHC34091898108534",
    "payroll_type": "Monthly",
    "insurance_coverage": "Gym Membership",
    "retirement_plan": "401k",
    "monthly_deductions": 875,
    "employee_id_card": "ID-00001",
    "computer_serial_number": "4609047537140",
    "vpn_access": false,
    "email_quota": "31GB",
    "system_access_level": "Admin",
    "last_system_login": "2024-03-30 23:33:04",
    "is_on_call": true
}








prepare 5 rules
each rule consists of at least 4 attributes, since we're building rule engine

usually the rules are looks like this
1. gender = 'Male' AND location = 'Tokyo' AND salary > 50000 AND (performance_rating > 1.0 OR annual_leave_balance > 15)
2. employee_type = 'Permanent' AND (location = 'Chicago' OR location = 'New York') AND experience > 5
3. (department = 'HR' OR department = 'Finance') AND project_completion_rate > 90 AND (performance_goal_completion > 70 OR direct_reports > 5)
4. (skills CONTAINS 'Python' OR skills CONTAINS 'Java') AND languages_spoken CONTAINS 'English' AND training_completed = true AND status = 'Active'
5. work_shift = 'Night' AND (location = 'Tokyo' OR location = 'London') AND (overtime_eligibility = true OR annual_leave_balance > 10)


2. employee_band = 'A2' AND (status = 'On Leave' OR status = 'On Probation') AND (overtime_eligibility = true OR annual_leave_balance > 10)
3. department = 'HR' AND years_since_last_promotion > 1 AND (project_completion_rate > 95 OR performance_goal_completion > 80) AND (education = "Bachelor's" OR certifications CONTAINS "PMP")
4. work_shift = 'Day' AND (employee_type = 'Permanent' OR employee_type = 'Contract') AND sick_leave_balance > 5 AND (training_completed = true OR professional_memberships CONTAINS "IEEE")
5. (project_allocations >= 5 AND direct_reports >= 2) OR (team_size >= 10 AND experience > 5) AND (skills CONTAINS "SQL" OR languages_spoken CONTAINS "English") AND (performance_rating > 1.5 OR bonus > 5002. employee_band = 'A2' AND (status = 'On Leave' OR status = 'On Probation') AND (overtime_eligibility = true OR annual_leave_balance > 10)
3. department = 'HR' AND years_since_last_promotion > 1 AND (project_completion_rate > 95 OR performance_goal_completion > 80) AND (education = "Bachelor's" OR certifications CONTAINS "PMP")
4. work_shift = 'Day' AND (employee_type = 'Permanent' OR employee_type = 'Contract') AND sick_leave_balance > 5 AND (training_completed = true OR professional_memberships CONTAINS "IEEE")
5. (project_allocations >= 5 AND direct_reports >= 2) OR (team_size >= 10 AND experience > 5) AND (skills CONTAINS "SQL" OR languages_spoken CONTAINS "English") AND (performance_rating > 1.5 OR bonus > 500


2. years_since_last_promotion > 2 AND employee_band = 'A2' AND project_completion_rate > 95 AND (performance_goal_completion > 75 OR direct_reports > 2)
3. department = 'HR' AND experience > 10 AND (skills CONTAINS 'SQL' OR skills CONTAINS 'Python') AND (languages_spoken CONTAINS 'German' OR languages_spoken CONTAINS 'English')
4. remote_work = true AND computer_serial_number IS NOT NULL AND email_quota > '30GB' AND (system_access_level = 'Admin' OR system_access_level = 'Manager')
5. (dob < '1990-12-31' OR (marital_status = 'Married' AND location = 'Chicago')) AND (benefits CONTAINS 'Health Insurance' OR insurance_coverage CONTAINS 'Gym Membership') AND (retirement_plan = '401k' OR payroll_type = 'Monthly') AND (professional_memberships IS EMPTY OR professional_memberships CONTAINS 'PMI')


# Rule
2. years_since_last_promotion > 2 AND employee_band = 'A2' AND project_completion_rate > 95 AND (performance_goal_completion > 75 OR direct_reports > 2)
3. department = 'HR' AND experience > 10 AND (skills CONTAINS 'SQL' OR skills CONTAINS 'Python') AND (languages_spoken CONTAINS 'German' OR languages_spoken CONTAINS 'English')
4. remote_work = true AND computer_serial_number IS NOT NULL AND email_quota > '30GB' AND (system_access_level = 'Admin' OR system_access_level = 'Manager')
5. (dob < '1990-12-31' OR (marital_status = 'Married' AND location = 'Chicago')) AND (benefits CONTAINS 'Health Insurance' OR insurance_coverage CONTAINS 'Gym Membership') AND (retirement_plan = '401k' OR payroll_type = 'Monthly') AND (professional_memberships IS EMPTY OR professional_memberships CONTAINS 'PMI')




what are the best way to build rule engine in performant and scalable way for NodeJS app, Each Rule Group had Multiple rules, number is not final, this group should be evaluated against the all the employees, here the employees number also not estimated