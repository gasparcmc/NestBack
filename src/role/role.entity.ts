import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../user/user.entity';
import { Access } from './access/access.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, user => user.roles)
  users: User[];

  @ManyToMany(() => Access, access => access.roles)
  @JoinTable()
  accesses: Access[];
}
