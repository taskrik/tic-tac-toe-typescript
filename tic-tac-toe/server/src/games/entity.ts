import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from 'typeorm/repository/BaseEntity'
import { IsString, ValidateNested } from 'class-validator'

@Entity()
export default class Game extends BaseEntity {

    @PrimaryGeneratedColumn()
    id?: number

    @IsString()
    @Column('text', { nullable: false })
    name: string

    @IsString()
    @Column('text', { default: false })
    color: string

    @ValidateNested()
    @Column('json', { nullable: true })
    board: object

}