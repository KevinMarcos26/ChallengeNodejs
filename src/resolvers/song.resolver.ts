import { Mutation, Resolver, Arg, Query, UseMiddleware, Ctx } from 'type-graphql';
import { getRepository, Repository } from "typeorm";
import { Artist } from '../entity/artist.entity';
import { Song } from '../entity/song.entity';
import { IContext, isAuth } from '../middlewares/auth.middleware';
import { InputType, Field } from 'type-graphql';
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

@Resolver()
export class SongResolver {
    songRepository: Repository<Song>;
    artistRepository: Repository<Artist>;

    constructor() {
        this.songRepository = getRepository(Song);
        this.artistRepository = getRepository(Artist);
    }

    @Mutation(() => Song)
    @UseMiddleware(isAuth)
    async createSong@Arg("input", () => SongInput) input: SongInput, @Ctx() context: IContext) {
        try {
            console.log(context.payload);
            const artist: Artist | undefined = await this.artistRepository.findOne(input.artist);

            if (!artist) {
                const error = new Error();
                error.message = 'The artist for this song does not exist, please double check';
                throw error;
            }

            const book = await this.songRepository.insert({
                title: input.title,
                artist: artist
            });

            return await this.songRepository.findOne(song.identifiers[0].id, { relations: ['artist', 'artist.songs'] });


        } catch (e) {
            throw new Error(e.message);
        }
    }

    @Query(() => [Song])
    @UseMiddleware(isAuth)
    async getAllSongs(): Promise<Song[]> {
        try {
            return await this.songRepository.find({ relations: ['artist', 'artist.songs'] });
        } catch (e) {
            throw new Error(e);
        }
    }

    @Query(() => Song)
    async getSongById(
        @Arg('input', () => SongIdInput) input: SongIdInput
    ): Promise<Song | undefined> {
        try {
            const song = await this.songRepository.findOne(input.id, { relations: ['artist', 'artist.songs'] });
            if (!song) {
                const error = new Error();
                error.message = 'Song not found';
                throw error;
            }
            return song;
        } catch (e) {
            throw new Error(e);
        }
    }

    @Mutation(() => Boolean)
    async updateBookById(
        @Arg('songId', () => SongIdInput) bookId: SongIdInput,
        @Arg('input', () => SongUpdateInput) input: SongUpdateInput
    ): Promise<Boolean> {
        try {
            await this.songRepository.update(songId.id, await this.parseInput(input));
            return true;
        } catch (e) {
            throw new Error(e);
        }
    }

    @Mutation(() => Boolean)
    async deleteSong(
        @Arg("songId", () => BookIdInput) songId: SongIdInput
    ): Promise<Boolean> {
        try {
            const result = await this.songRepository.delete(songId.id);

            if (result.affected === 0)
                throw new Error('Song does not exist');

            return true;
        } catch (e) {
            throw new Error(e);
        }
    }

    private async parseInput(input: SongUpdateInput) {
        try {
            const _input: SongUpdateParsedInput = {};

            if (input.title) {
                _input['title'] = input.title;
            }

            if (input.artist) {
                const artist = await this.artistRepository.findOne(input.artist);
                if (!artist) {
                    throw new Error('This artist does not exist');
                }
                _input['artist'] = await this.artistRepository.findOne(input.artist);
            }

            return _input
        } catch (e) {
            throw new Error(e);
        }
    }

}
