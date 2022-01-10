import { Column, Entity, PrimaryColumn } from 'typeorm';



@Entity()
export class ErpModel {

  @PrimaryColumn()
  id: string;

  @Column()
  date: string;

  @Column()
  area: string;

  @Column({
    type: 'float'
  })
  weight: number;

  @Column()
  cp: string;
}

@Entity()
export class TrdModel extends ErpModel {

  @Column()
  fee: number;
}

/**
 * the `dataModels` cannot use `as const` keywords, when put into `createConnections`
 */
export const dataModels = [ErpModel, TrdModel];
export type DataModel = typeof dataModels[number]
