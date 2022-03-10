import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Song } from './song.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Artist {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field(() => String)
    @Column()
    fullName!: string

    @Field(() => [Song], { nullable: true })
    @OneToMany(() => Song, song => song.artist, { nullable: true, onDelete: 'CASCADE' })
    songs!: Song[]

    @Field(() => String)
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string
}