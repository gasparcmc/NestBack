import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  portada: string | null;

  @Column('simple-array', { nullable: true })
  galeria: string[] | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoria: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subcategoria: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  marca: string | null;
}
