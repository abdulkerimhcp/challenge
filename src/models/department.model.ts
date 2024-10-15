import {belongsTo, Entity, hasMany, model, property} from '@loopback/repository';
import {Employee} from './employee.model';
import {Location} from './location.model'; // Location modelini içe aktarın

@model()
export class Department extends Entity {
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
  name: string;

  @belongsTo(() => Location)
  locationId: number;

  @belongsTo(() => Employee, {name: "manager"})
  managerId: number;


  @hasMany(() => Employee, {keyFrom: "departmentId"})
  employees: Employee[];

  constructor(data?: Partial<Department>) {
    super(data);
  }
}

export interface DepartmentRelations {
  // describe navigational properties here
}

export type DepartmentWithRelations = Department & DepartmentRelations;
