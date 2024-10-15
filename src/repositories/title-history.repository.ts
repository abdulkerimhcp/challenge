import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Department, Employee, TitleHistory, TitleHistoryRelations} from '../models';
import {DepartmentRepository} from './department.repository';
import {EmployeeRepository} from './employee.repository';

export class TitleHistoryRepository extends DefaultCrudRepository<
  TitleHistory,
  typeof TitleHistory.prototype.id,
  TitleHistoryRelations
> {
  public readonly employee: BelongsToAccessor<Employee, typeof TitleHistory.prototype.id>;
  public readonly department: BelongsToAccessor<Department, typeof TitleHistory.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
    @repository.getter('EmployeeRepository') protected employeeRepositoryGetter: Getter<EmployeeRepository>,
    @repository.getter('DepartmentRepository') protected departmentRepositoryGetter: Getter<DepartmentRepository>,
  ) {
    super(TitleHistory, dataSource);

    this.employee = this.createBelongsToAccessorFor('employee', employeeRepositoryGetter);
    this.registerInclusionResolver('employee', this.employee.inclusionResolver);

    this.department = this.createBelongsToAccessorFor('department', departmentRepositoryGetter);
    this.registerInclusionResolver('department', this.department.inclusionResolver);
  }
}
