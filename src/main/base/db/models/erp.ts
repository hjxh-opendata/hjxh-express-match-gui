import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import { TrdModel } from './trd';

@Entity()
export class ErpModel {

  @OneToOne(() => TrdModel, trd => trd.id)
  @PrimaryColumn()
  id: string;

  @Column()
  date: string;

  @Column()
  area: string;

  @Column({ type: 'float' })
  weight: number;

  @Column()
  cp: string;
}
