import { InputType, Field } from 'type-graphql';
import { Artist } from '../entity/artist.entity';
import { Length } from 'class-validator';

@InputType()
class SongInput {

    @Field()
    @Length(3, 64)
    title!: string;

    @Field()
    artist!: number;
}

@InputType()
class SongUpdateInput {

    @Field(() => String, { nullable: true })
    @Length(3, 64)
    title?: string;

    @Field(() => Number, { nullable: true })
    artist?: number;
}

@InputType()
class SongUpdateParsedInput {

    @Field(() => String, { nullable: true })
    @Length(3, 64)
    title?: string;

    @Field(() => Artist, { nullable: true })
    artist?: Artist;
}

@InputType()
class SongIdInput {

    @Field(() => Number)
    id!: number
}


