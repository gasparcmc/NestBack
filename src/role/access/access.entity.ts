import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Role } from '../role.entity';

@Entity()
export class Access {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Ej: 'read_users', 'edit_product'

  @ManyToMany(() => Role, role => role.accesses)
  roles: Role[];
}
