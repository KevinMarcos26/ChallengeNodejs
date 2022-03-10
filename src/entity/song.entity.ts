import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Artist } from './artist.entity';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Song {

    @Field()
    @PrimaryGeneratedColumn()
    id!: number

    @Field()
    @Column()
    title!: string

    @Field(() => Artist)
    @ManyToOne(() => Artist, artist => artist.songs, { onDelete: 'CASCADE' })
    artist!: Artist

    @Field()
    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: string
}