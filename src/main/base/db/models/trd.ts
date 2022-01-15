import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { ErpModel } from './erp';

@Entity("TrdModel")
export class TrdModel  {
  @OneToOne(() => ErpModel, erp=>erp.id )
  @JoinColumn()
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

  @Column()
  fee: number;
}
