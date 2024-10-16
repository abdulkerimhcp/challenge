import {authenticate} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  get,
  OperationObject,
  param,
  post,
  put,
  requestBody
} from '@loopback/rest';
import {logger} from '../logger';
import {Department} from '../models';
import {DepartmentRepository} from '../repositories';
import {AverageSalaryService} from '../services/average-salary.services';

const averageSalaryOperation: OperationObject = {
  description: 'Get the average salary for each department, including employee data',
  summary: 'Average salary per department',
  responses: {
    '200': {
      description: 'List of departments with their average salary',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                department: {
                  type: 'object',
                  properties: {
                    id: {type: 'number'},
                    name: {type: 'string'},
                  },
                },
                avgSalary: {type: 'number'},
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

export class DepartmentController {
  constructor(
    @repository(DepartmentRepository)
    public departmentRepository: DepartmentRepository,
    @inject('services.AverageSalaryService')
    public averageSalaryService: AverageSalaryService,
  ) { }

  @authenticate('jwt')
  @post('/departments')
  async createDepartment(
    @requestBody() departmentData: Department,
  ): Promise<Department> {
    return this.departmentRepository.create(departmentData);
  }

  @authenticate('jwt')
  @get('/departments')
  async findAllDepartments(): Promise<Department[]> {

    return this.departmentRepository.find({
      include: ['manager', "employees"],
    });
  }
  @authenticate('jwt')
  @get('/departments/average-salary', averageSalaryOperation)
  async getDepartmensAvgSalary(): Promise<any> {
    const departments = await this.departmentRepository.find({
      include: ["employees"],
    });

    const departmentsAvgSalaryList = await Promise.all(
      departments.map(async (department) => {
        return {
          department: {id: department.id, name: department.name},
          avgSalary: await this.averageSalaryService.calculate(department.employees),
        };
      })
    );
    logger.info('Run Average Salary Service')
    return departmentsAvgSalaryList;
  }

  @get('/departments/{id}')
  async findDepartmentById(
    @param.path.number('id') id: number,
  ): Promise<Department> {
    return this.departmentRepository.findById(id, {
      include: ['manager', "employees"],
    });
  }

  @put('/departments/{id}')
  async updateDepartmentById(
    @param.path.number('id') id: number,
    @requestBody() departmentData: Partial<Department>,
  ): Promise<void> {
    await this.departmentRepository.updateById(id, departmentData);
  }


  @del('/departments/{id}')
  async deleteDepartmentById(
    @param.path.number('id') id: number,
  ): Promise<void> {
    await this.departmentRepository.deleteById(id);
  }
}
