import {authenticate} from '@loopback/authentication';
import {repository} from '@loopback/repository';
import {del, get, OperationObject, param, post, put, requestBody} from '@loopback/rest';
import {Employee} from '../models';
import {EmployeeRepository, TitleHistoryRepository} from '../repositories';

const managersWithSubordinatesOperation: OperationObject = {
  description: 'Retrieve a list of managers with their subordinates',
  summary: 'Get managers and subordinates',
  responses: {
    '200': {
      description: 'List of managers with their subordinates',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'number'},
                name: {type: 'string'},
                subordinates: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {type: 'number'},
                      name: {type: 'string'},
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '401': {
      description: 'Unauthorized access - JWT required',
    },
  },
};

const createEmployeeOperation: OperationObject = {
  description: 'Create a new employee with full details and log their title history',
  summary: 'Create employee',
  requestBody: {
    description: 'Employee data',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'phoneNumber', 'salary', 'managerId', 'departmentId', 'title'],
          properties: {
            firstName: {type: 'string'},
            lastName: {type: 'string'},
            email: {type: 'string', format: 'email'},
            phoneNumber: {type: 'string'},
            salary: {type: 'number'},
            managerId: {type: 'number'},
            departmentId: {type: 'number'},
            title: {type: 'string'},
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Employee successfully created',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {type: 'number'},
              firstName: {type: 'string'},
              lastName: {type: 'string'},
              email: {type: 'string', format: 'email'},
              phoneNumber: {type: 'string'},
              salary: {type: 'number'},
              managerId: {type: 'number'},
              departmentId: {type: 'number'},
              title: {type: 'string'},
            },
          },
        },
      },
    },
    '400': {
      description: 'Invalid input',
    },
  },
};

const findAllEmployeesOperation: OperationObject = {
  description: 'Retrieve a list of all employees, including their manager, subordinates, and title history',
  summary: 'Get employees with relationships',
  responses: {
    '200': {
      description: 'List of employees with related data',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'number'},
                firstName: {type: 'string'},
                lastName: {type: 'string'},
                email: {type: 'string'},
                phoneNumber: {type: 'string'},
                salary: {type: 'number'},
                departmentId: {type: 'number'},
                title: {type: 'string'},
                manager: {
                  type: 'object',
                  properties: {
                    id: {type: 'number'},
                    firstName: {type: 'string'},
                    lastName: {type: 'string'},
                    email: {type: 'string'},
                    phoneNumber: {type: 'string'},
                  },
                },
                subordinates: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {type: 'number'},
                      firstName: {type: 'string'},
                      lastName: {type: 'string'},
                      email: {type: 'string'},
                      phoneNumber: {type: 'string'},
                    },
                  },
                },
                titleHistories: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {type: 'number'},
                      title: {type: 'string'},
                      startDate: {type: 'string', format: 'date-time'},
                      endDate: {type: 'string', format: 'date-time'},
                      employeeId: {type: 'number'},
                      departmentId: {type: 'number'},
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '400': {
      description: 'Invalid request',
    },
  },
};

const updateEmployeeOperation: OperationObject = {
  description: 'Update an employee by ID',
  summary: 'Update employee',
  requestBody: {
    description: 'Partial employee data to update',
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            firstName: {type: 'string'},
            lastName: {type: 'string'},
            email: {type: 'string', format: 'email'},
            phoneNumber: {type: 'string'},
            salary: {type: 'number'},
            managerId: {type: 'number'},
            departmentId: {type: 'number'},
            title: {type: 'string'},
          },
        },
      },
    },
  },
  responses: {
    '204': {
      description: 'Employee successfully updated',
    },
    '400': {
      description: 'Invalid request data',
    },
    '404': {
      description: 'Employee not found',
    },
  },
};
export class EmployeeController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @repository(TitleHistoryRepository)
    public titleHistoryRepository: TitleHistoryRepository,
  ) { }

  @authenticate('jwt')
  @post('/employees', createEmployeeOperation)
  async createEmployee(
    @requestBody({
      description: 'The employee data',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['firstName', 'lastName', 'email', 'phoneNumber', 'salary', 'managerId', 'departmentId', 'title'],
            properties: {
              firstName: {type: 'string'},
              lastName: {type: 'string'},
              email: {type: 'string', format: 'email'},
              phoneNumber: {type: 'string'},
              salary: {type: 'number'},
              managerId: {type: 'number'},
              departmentId: {type: 'number'},
              title: {type: 'string'},
            },
          },
        },
      },
    }) employeeData: Employee,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.create(employeeData);
    console.log(employee);

    await this.titleHistoryRepository.create({
      title: employee.title,
      startDate: new Date(),
      employeeId: employee.id,
      departmentId: employee.departmentId,
    });

    return employee;
  }


  @get('/employees/{id}')
  async findEmployeeById(
    @param.path.number('id') id: number,
  ): Promise<Employee> {
    return this.employeeRepository.findById(id, {
      include: ['manager', 'subordinates', 'titleHistories'],
    });
  }

  @authenticate('jwt')
  @get('/employees', findAllEmployeesOperation)
  async findAllEmployees(): Promise<Employee[]> {
    return this.employeeRepository.find({
      include: ['manager', 'subordinates', 'titleHistories'],
    });
  }

  @authenticate('jwt')
  @put('/employees/{id}', updateEmployeeOperation)
  async updateEmployeeById(
    @param.path.number('id') id: number,
    @requestBody({
      description: 'Partial employee data',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              firstName: {type: 'string'},
              lastName: {type: 'string'},
              email: {type: 'string', format: 'email'},
              phoneNumber: {type: 'string'},
              salary: {type: 'number'},
              managerId: {type: 'number'},
              departmentId: {type: 'number'},
              title: {type: 'string'},
            },
          },
        },
      },
    })
    employeeData: Partial<Employee>,
  ): Promise<void> {
    this.employeeRepository.updateById(id, employeeData)
  }

  @put('/employees/{id}/title')
  async updateEmployeeByIdTitle(
    @param.path.number('id') id: number,
    @requestBody() body: {title: string},
  ): Promise<void> {


    const lastEmployee = await this.employeeRepository.findById(id);

    const titleHistory = await this.titleHistoryRepository.findOne({
      where: {
        employeeId: id,
        title: lastEmployee.title,
        endDate: undefined,
      }
    });


    if (titleHistory) {
      await this.titleHistoryRepository.updateById(titleHistory.id, {
        endDate: new Date()
      });
    }

    await this.titleHistoryRepository.create({
      title: body.title,
      startDate: new Date(),
      employeeId: id,
      departmentId: lastEmployee.departmentId,
    });

    lastEmployee.title = body.title;
    await this.employeeRepository.updateById(id, lastEmployee);
  }

  @del('/employees/{id}')
  async deleteEmployeeById(@param.path.number('id') id: number): Promise<void> {
    await this.employeeRepository.deleteById(id);
  }

  @get('/employees/{id}/manager')
  async findManager(@param.path.number('id') id: number): Promise<Employee> {
    return this.employeeRepository.manager(id);
  }

  @get('/managers/{id}/subordinates')
  async findSubordinates(
    @param.path.number('id') managerId: number,
  ): Promise<Employee[]> {
    return this.employeeRepository.subordinates(managerId).find();
  }

  @authenticate('jwt')
  @get('/managers/subordinates', managersWithSubordinatesOperation)
  async findAllManagersWithSubordinates(): Promise<Employee[]> {
    const managersWithSubordinates = (await this.employeeRepository.find({
      include: ['subordinates'],
    })).filter(employee => employee.subordinates && employee.subordinates.length > 0);

    return managersWithSubordinates;
  }
}

