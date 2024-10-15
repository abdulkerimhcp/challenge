import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {TitleHistory} from './title-history.model';

@model()
export class Employee extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
  })
  phoneNumber?: string;

  @property({
    type: 'number',
    required: true,
  })
  salary: number;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  hireDate?: Date;

  @property({
    type: 'string',
  })
  title: string;

  @belongsTo(() => Employee, {name: 'manager'})
  managerId?: number;

  @belongsTo(() => Employee, {name: 'department'})
  departmentId?: number;

  @hasMany(() => Employee, {keyTo: 'managerId'})
  subordinates: Employee[];

  @hasMany(() => TitleHistory)
  titleHistories: TitleHistory[];

  constructor(data?: Partial<Employee>) {
    super(data);
  }
}

export interface EmployeeRelations {
  // describe navigational properties here
}

export type EmployeeWithRelations = Employee & EmployeeRelations;
