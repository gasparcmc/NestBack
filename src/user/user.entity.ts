import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Business } from '../business/business.entity';
import { Role } from '../role/role.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  tokenResetPassword: string;

  @Column({ nullable: true })
  tokenResetPasswordExpires: Date;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  // Muchas empresas
  @ManyToMany(() => Business, business => business.users)
  @JoinTable()
  businesses: Business[];

  // Muchos roles
  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles: Role[];
}
