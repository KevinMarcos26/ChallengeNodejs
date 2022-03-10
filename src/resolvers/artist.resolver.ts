import { Mutation, Resolver, Arg, InputType, Field, Query } from 'type-graphql';
import { Artist } from '../entity/artist.entity';
import { getRepository, Repository } from "typeorm";
import { Length, IsString } from 'class-validator';



@InputType()
class ArtistInput {

    @Field()
    @Length(3, 64)
    @IsString()
    fullName!: string
}

@InputType()
class ArtistUpdateInput {

    @Field(() => Number)
    id!: number

    @Field()
    fullName?: string
}

@InputType()
class ArtistIdInput {

    @Field(() => Number)
    id!: number
}

@Resolver()
export class ArtistResolver {

    artistRepository: Repository<Artist>

    constructor() {
        this.artistRepository = getRepository(Artist)
    }

    @Mutation(() => Artist)
    async createArtist(
        @Arg("input", () => ArtistInput) input: ArtistInput
    ): Promise<Artist | undefined> {
        try {
            const createdArtist = await this.artistRepository.insert({ fullName: input.fullName });
            const result = await this.artistRepository.findOne(createdArtist.identifiers[0].id)
            return result;
        } catch {
            console.error
        }
    }

    @Query(() => [Artist])
    async getAllArtist(): Promise<Artist[]> {
        return await this.artistRepository.find({ relations: ['songs'] });
    }

    @Query(() => Artist)
    async getOneArtist(
        @Arg("input", () => ArtistIdInput) input: ArtistIdInput
    ): Promise<Artist | undefined> {
        try {
            const artist = await this.artistRepository.findOne(input.id, { relations: ['songs'] });
            if (!artist) {
                const error = new Error();
                error.message = 'Artist does not exist';
                throw error;
            }
            return artist;
        } catch (e) {
            throw new Error(e)
        }
    }

    @Mutation(() => Artist)
    async updateOneArtistrtist
        @Arg("input", () => ArtistUpdateInput) input: ArtistUpdateInput
        ): Promise<Artist | undefined> {

        const artistExists = await this.artistRepository.findOne(input.id);

        if (!artistExists) {
            throw new Error('Artist does not exists')
        };

        const updatedArtist = await this.artistRepository.save({
            id: input.id,
            fullName: input.fullName
        })

        return await this.artistRepository.findOne(updatedArtist.id)
    }

    @Mutation(() => Boolean)
    async deleteOneArtist(
        @Arg("input", () => ArtistIdInput) input: ArtistIdInput
    ): Promise<Boolean> {
        try {
            const artist = await this.artistRepository.findOne(input.id);
            if (!artist) throw new Error('Artist does not exist');
            await this.artistRepository.delete(input.id);
            return true;
        } catch (e) {
            throw new Error(e.message)
        }

    }
}