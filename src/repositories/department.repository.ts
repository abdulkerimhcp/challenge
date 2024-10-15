import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {PostgresDataSource} from '../datasources';
import {Department, DepartmentRelations, Employee, Location} from '../models';
import {EmployeeRepository} from './employee.repository';
import {LocationRepository} from './location.repository';

export class DepartmentRepository extends DefaultCrudRepository<
  Department,
  typeof Department.prototype.id,
  DepartmentRelations
> {
  public readonly location: BelongsToAccessor<Location, typeof Department.prototype.id>;
  public readonly manager: BelongsToAccessor<Employee, typeof Department.prototype.id>;
  public readonly employees: HasManyRepositoryFactory<Employee, typeof Department.prototype.id>;

  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
    @repository.getter('LocationRepository') protected locationRepositoryGetter: Getter<LocationRepository>,
    @repository.getter('EmployeeRepository') protected employeeRepositoryGetter: Getter<EmployeeRepository>,
  ) {
    super(Department, dataSource);

    this.location = this.createBelongsToAccessorFor('location', locationRepositoryGetter);
    this.registerInclusionResolver('location', this.location.inclusionResolver);

    this.manager = this.createBelongsToAccessorFor('manager', employeeRepositoryGetter);
    this.registerInclusionResolver('manager', this.manager.inclusionResolver);

    this.employees = this.createHasManyRepositoryFactoryFor('employees', employeeRepositoryGetter);
    this.registerInclusionResolver('employees', this.employees.inclusionResolver);


  }
}
