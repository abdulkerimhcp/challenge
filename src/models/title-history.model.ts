import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Department} from './department.model';
import {Employee} from './employee.model';

@model()
export class TitleHistory extends Entity {
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
  title: string;

  @property({
    type: 'date',
    required: true,
  })
  startDate?: Date;

  @property({
    type: 'date',
  })
  endDate?: Date;

  @belongsTo(() => Employee)
  employeeId: number;

  @belongsTo(() => Department)
  departmentId: number;

  constructor(data?: Partial<TitleHistory>) {
    super(data);
  }
}


export interface TitleHistoryRelations {
  // describe navigational properties here
}

export type TitleHistoryWithRelations = TitleHistory & TitleHistoryRelations;
