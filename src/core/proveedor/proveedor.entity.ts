import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Proveedor {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, type: 'varchar', length: 255})
    razonSocial: string;

    @Column({type: 'varchar', length: 255})
    rubro: string;

    @Column({type: 'varchar', length: 255})
    direccion: string;

    @Column({type: 'varchar', length: 20})
    telefono: string;

    @Column({type: 'varchar', length: 255})
    email: string;

    @Column({type: 'varchar', length: 255})
    web: string;

    @Column({type: 'text'})
    observaciones: string;

    @Column({default: 'Activo'})
    estado: string;

    @Column({type: 'varchar', length: 20, nullable: true})
    cuit: string | null;

    // Imagen de portada del proveedor
    @Column({type: 'varchar', length: 255, nullable: true})
    portada: string | null;
    
}