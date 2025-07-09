import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, IsNull } from 'typeorm';
import { Role } from '../role.entity';

@Entity()
export class Access {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // Ej: 'read_users', 'edit_product'

  @Column()
  order: number;
  
  @Column({ nullable: true })
  dad: number;

  @ManyToMany(() => Role, role => role.accesses)
  roles: Role[];
}
