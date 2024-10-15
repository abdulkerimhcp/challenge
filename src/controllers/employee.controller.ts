import {repository} from '@loopback/repository';
import {del, get, param, post, put, requestBody} from '@loopback/rest';
import {Employee} from '../models';
import {EmployeeRepository, TitleHistoryRepository} from '../repositories';

export class EmployeeController {
  constructor(
    @repository(EmployeeRepository)
    public employeeRepository: EmployeeRepository,
    @repository(TitleHistoryRepository)
    public titleHistoryRepository: TitleHistoryRepository,
  ) { }

  @post('/employees')
  async createEmployee(
    @requestBody() employeeData: Employee,
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


  @get('/employees')
  async findAllEmployees(): Promise<Employee[]> {
    return this.employeeRepository.find({
      include: ['manager', 'subordinates', 'titleHistories'],
    });
  }


  @put('/employees/{id}')
  async updateEmployeeById(
    @param.path.number('id') id: number,
    @requestBody() employeeData: Partial<Employee>,
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

  @get('/managers/subordinates')
  async findAllManagersWithSubordinates(): Promise<Employee[]> {
    const managersWithSubordinates = (await this.employeeRepository.find({
      include: ['subordinates'],
    })).filter(employee => employee.subordinates);
    return managersWithSubordinates
  }
}
