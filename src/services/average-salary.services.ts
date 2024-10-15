import {bind, BindingScope} from '@loopback/core';
import {Employee} from '../models';

@bind({scope: BindingScope.TRANSIENT})
export class AverageSalaryService {
  constructor() { }

  async calculate(employees: Employee[]): Promise<number> {
    const totalSalary = employees.reduce((sum, {salary}) => sum + (salary || 0), 0);
    const averageSalary = totalSalary / employees.length;
    return averageSalary;
  }
}
