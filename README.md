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


// ask: As mentioned above, dynamically-generated scripts are an anti-pattern. Generating scripts during the application's runtime may, and probably will, exhaust the host's memory resources for caching them. Instead, scripts should be as generic as possible and provide customized execution via their arguments.
// is this script is dynamically generated?
// redis provides a way to load scripts into the cache using the SCRIPT LOAD command. This command returns a SHA-1 hash that can be used to execute the script later
// test the results with cached script
// If employee is falling under the rule, then we can cache the result for the employee, so that we can avoid the rest of the rules for the employee, this functionality should work based on argument, the argument type is whether evaluation of all the rules for an employee or evaluation of a single rule for all the employees

dept_id IN (1,2,3)
dept_id NOT IN (1,2,3)


script: `dabca0bc6e429c6c90a91c8287f89298d81ef71e`



## Notes:
- `scriptLoad` Loads a Lua script into the Redis server's script cache and returns the SHA1 hash of the script, this hash is cached with the following key `LUA_HASH` to use it later to execute the script.
- To evaluate the rules on employee(s) we do use `evalSha` command. This command is used to execute a Lua script cached on the server. 
- If employees list is less than 100, then we can send them as argument to `evalSha` command. If the list is more than 100, then we've to set those employees in a cache (expiry 2min) with a unique key and then we can pass the key as argument to `evalSha` command. In few cases we may need to pass the all employees list as argument to `evalSha` command, in that case send a flag (`allEmployees`) to the script.
- Consumer of the process should be able to pass the rule ids as argument to the `evalSha` command, by using those rule ids fetch the corresponding rules from the redis cache and then evaluate the rules against each employee.


## TODO
- [x] IN, NOT IN operators support
- [x] Pub-Sub support
- [x] Effective cache update strategy
- [x] Pipeline support for multiple commands especially for setting employees cache and fetching hash.
- [x] Once strategy implemented then re-evaluate the rules for all the criteria
- generate unique `uuid` for employees cache key

## Pub-Sub Implementation
1. Upon updating of any employee attribute, then we need update the cache accordingly.
  Considerations for implementing this feature
    a. Suppose if single employee attribute has changed, is once case 
    b. the other one is, upon updating the huge employees information in bulk and then how to handle this?
2. Once cache update strategy is implemented then we need figure out the way to identify the rules which had the newly updated attribute, once the rules are identified then re-evaluate the rules to the respective
employees.



###### Master Rules
Rule ID           |         Rule                                    |     Owner
1                 |     designation = 'Sr. Dev'                     |     Leave Management
2                 |     department = 'IT'                           |     Leave Management
3                 |     designation = 'Manager' AND experience > 5  |     Leave Management 
4                 |     default rule                                |     Leave Management
5                 |     status = 'Active'                           |     Payroll Management
6                 |     department = 'HR'                           |     Payroll Management
7                 |     designation = 'Manager' AND experience < 5  |     Payroll Management
8                 |     default rule                                |     Payroll Management



Now leave management team *starts configuring the values for each rule*, later on they'll use these configurations to the satisfied employee with respective rule.

*Employees Data*
EmployeeID | designation | department | experience
1. A001   |   Jr.Dev    |    IT      |      2
2. A002   |   Sr.Tester |    Testing |      6  
3. A003   |   Manager   |    HR      |      4
4. A004   |   Sr.Dev    |    IT      |      5
5. A005   |   Recruiter |    HR      |      1



*Employees with satisfied rule*
1. A001 - 2
2. A002 - 3
3. A003 - 3
4. A004 - 1
5. A005 - 3


Once we've the employee with satisfied rule then pick the respective configuration to that rule and then
*apply the configuration* to that employee.


Now, `designation` is updated to the employee A001

EmployeeID | designation | department 
1. A001   |   Sr.Dev    |    IT

Cache Contains:
Master Rules:
1. `rules:rule_id`
2. `employees`
3. `LEAVE_MANAGEMENT_LEAVE_GROUP_RULES`: values [1,2,3,4]
4. `PAYROLL_MANAGEMENT_RULES` : values: [5,6,7,8]


Now we need to *identify* the rules which contains `designation` attribute in master rules. to identify them we've to maintain cache for each attribute with the corresponding rule ids. once we identify the rules(i.e., 1,3,7) which are affected by the attribute those rules should be compared with leave management rules (cached in `LEAVE_MANAGEMENT_LEAVE_GROUP_RULES` i.e., 1,2,3,4). if we find any match it is there then employee A001 will be needs to re-evaluate the against the leave management rules which are only by sending an event the initial process what we implement with lua script is repeated with this as well.


1. If single attribute is updated multiple employees, search the _attribute rule_ map then send those rules to each criteria owners, then they need to filter out the configured rules with the sent rules which will be the subset of these rules. Finally after filtering out these rules we can continue with the initial process. 