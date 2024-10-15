import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  del,
  get,
  param,
  post,
  put,
  requestBody
} from '@loopback/rest';
import {Department} from '../models';
import {DepartmentRepository} from '../repositories';
import {AverageSalaryService} from '../services/average-salary.services';

export class DepartmentController {
  constructor(
    @repository(DepartmentRepository)
    public departmentRepository: DepartmentRepository,
    @inject('services.AverageSalaryService')
    public averageSalaryService: AverageSalaryService,
  ) { }

  @post('/departments')
  async createDepartment(
    @requestBody() departmentData: Department,
  ): Promise<Department> {
    return this.departmentRepository.create(departmentData);
  }


  @get('/departments')
  async findAllDepartments(): Promise<Department[]> {
    return this.departmentRepository.find({
      include: ['manager', "employees"],
    });
  }

  @get('/departments/average-salary')
  async getDepartmensAvgSalary(): Promise<any> {
    const departments = await this.departmentRepository.find({
      include: ["employees"],
    });

    const departmentsAvgSalaryList = await Promise.all(departments.map(async department => {
      return {department: {id: department.id, name: department.name}, avgSalary: await this.averageSalaryService.calculate(department.employees)}
    }))
    return departmentsAvgSalaryList
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
