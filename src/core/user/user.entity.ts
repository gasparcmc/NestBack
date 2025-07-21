import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

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

  @Column({ type: 'boolean', nullable: true })
  isActive: boolean | null;

  //tokens
  @Column({ type: 'text', nullable: true })
  tokenResetPassword: string | null;

  @Column({ type: 'timestamp', nullable: true })
  tokenResetPasswordExpires: Date | null;

  @Column({ type: 'text', nullable: true })
  tokenRegister: string | null;

  @Column({ type: 'timestamp', nullable: true })
  tokenRegisterExpires: Date | null;

  //columnas default
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({ type: 'timestamp' })
  updatedAt: Date;

  //relaciones

  // Muchos roles
  @ManyToMany(() => Role, role => role.users)
  @JoinTable()
  roles: Role[];
}
