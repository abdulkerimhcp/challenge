import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Department, Employee, EmployeeRelations, TitleHistory} from '../models';
import {DepartmentRepository} from './department.repository';
import {TitleHistoryRepository} from './title-history.repository';

export class EmployeeRepository extends DefaultCrudRepository<
  Employee,
  typeof Employee.prototype.id,
  EmployeeRelations
> {
  public readonly manager: BelongsToAccessor<Employee, typeof Employee.prototype.id>;
  public readonly subordinates: HasManyRepositoryFactory<Employee, typeof Employee.prototype.id>;
  public readonly department: BelongsToAccessor<Department, typeof Employee.prototype.id>;
  public readonly titleHistories: HasManyRepositoryFactory<TitleHistory, typeof Employee.prototype.id>;


  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
    @repository.getter('EmployeeRepository') protected employeeRepositoryGetter: Getter<EmployeeRepository>,
    @repository.getter('DepartmentRepository') protected departmentRepositoryGetter: Getter<DepartmentRepository>,
    @repository.getter('TitleHistoryRepository') protected titleHistoryRepositoryGetter: Getter<TitleHistoryRepository>,
  ) {
    super(Employee, dataSource);

    this.manager = this.createBelongsToAccessorFor('manager', employeeRepositoryGetter);
    this.registerInclusionResolver('manager', this.manager.inclusionResolver);

    this.subordinates = this.createHasManyRepositoryFactoryFor('subordinates', employeeRepositoryGetter);
    this.registerInclusionResolver('subordinates', this.subordinates.inclusionResolver);

    this.department = this.createBelongsToAccessorFor('department', departmentRepositoryGetter);
    this.registerInclusionResolver('department', this.department.inclusionResolver);

    this.titleHistories = this.createHasManyRepositoryFactoryFor('titleHistories', titleHistoryRepositoryGetter);
    this.registerInclusionResolver('titleHistories', this.titleHistories.inclusionResolver);
  }
}
