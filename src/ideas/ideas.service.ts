import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IdeaEntity } from './entity/idea.entity';
import { IdeaDto, IdeaRO } from './dto/idea.dto';
import { UserEntity } from '../users/entity/user.entity';

import { Votes } from '../shared/votes.enum';
@Injectable()
export class IdeasService {
    constructor(
        @InjectRepository(IdeaEntity)
        private readonly ideaRepository: Repository<IdeaEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        // private gateway: AppGateway,
      ) {}

private ideaToResponseObject(idea: IdeaEntity): IdeaRO {
        const responseObject: any = {
          ...idea,
         author: idea.author ? idea.author.toResponseObject(false) : null,
        };
        if (idea.upvotes) {
          responseObject.upvotes = idea.upvotes.length;
        }
        if (idea.downvotes) {
          responseObject.downvotes = idea.downvotes.length;
        }
        return responseObject;
      }

private ensureOwnership(idea: IdeaEntity, userId: string) {
        if (idea.author.id !== userId) {
            throw new HttpException('Incorrect user', HttpStatus.UNAUTHORIZED);
    }
}

    private async vote(idea: IdeaEntity, user: UserEntity, vote: Votes) {
        const opposite = vote === Votes.UP ? Votes.DOWN : Votes.UP;
        if (
          idea[opposite].filter(voter => voter.id === user.id).length > 0 ||
          idea[vote].filter(voter => voter.id === user.id).length > 0
        ) {
          idea[opposite] = idea[opposite].filter(voter => voter.id !== user.id);
          idea[vote] = idea[vote].filter(voter => voter.id !== user.id);
          await this.ideaRepository.save(idea);
        } else if (idea[vote].filter(voter => voter.id === user.id).length < 1) {
          idea[vote].push(user);
          await this.ideaRepository.save(idea);
        } else {
          throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
        }

        return idea;
      }

    async findAll(page: number = 1, newest?: boolean): Promise<IdeaRO[]> {
        const ideas = await this.ideaRepository.find({
          relations: [
            'author',
            'upvotes',
            'downvotes',
            'comments',
          ],
          take: 10,
          skip: 10 * (page - 1),
          order: newest && { created: 'DESC' },
        });
        return ideas.map(idea => this.ideaToResponseObject(idea));
  }

    async findOne(id: string): Promise<IdeaRO> {
        const idea = await this.ideaRepository.findOne({
          where: { id },
          relations: [
            'author',
            'upvotes',
            'downvotes',
            'comments',
          ],
        });

        if (!idea) {
          throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }

        return this.ideaToResponseObject(idea);
      }

    async create(userId: string, data: IdeaDto): Promise<IdeaRO> {
        const user = await this.userRepository.findOne({
          where: {id: userId},
          // relations: ['author'],
        });
        const idea = await this.ideaRepository.create({ ...data, author: user });
        await this.ideaRepository.save(idea);
        return this.ideaToResponseObject(idea);
    }

     async update(
        id: string,
        userId: string,
        data: Partial<IdeaDto>,
        ): Promise<IdeaRO> {
        let idea = await this.ideaRepository.findOne({
            where: { id },
            relations: [
              'author',
              'upvotes',
              'downvotes',
              'comments',
            ],
        });
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.update({ id }, data);
        idea = await this.ideaRepository.findOne({
            where: { id },
            relations: ['author', 'upvotes', 'downvotes', 'comments'],
        });
        return this.ideaToResponseObject(idea);
      }

    async destroy(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id }, relations: ['author']});
        if (!idea) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        this.ensureOwnership(idea, userId);
        await this.ideaRepository.delete({ id });
        return this.ideaToResponseObject(idea);
    }

    async upvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({
          where: { id },
          relations: [
            'author',
            'upvotes',
            'downvotes',
            'comments',
          ],
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });
        idea = await this.vote(idea, user, Votes.UP);

        return this.ideaToResponseObject(idea);
      }

      async downvote(id: string, userId: string) {
        let idea = await this.ideaRepository.findOne({
          where: { id },
          relations: [
            'author',
            'upvotes',
            'downvotes',
            'comments',
          ],
        });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        idea = await this.vote(idea, user, Votes.DOWN);
        return this.ideaToResponseObject(idea);
      }

      async bookmark(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({
          where: { id: userId },
          relations: ['bookmarks'],
        });

        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length < 1) {
          user.bookmarks.push(idea);
          await this.userRepository.save(user);
        } else {
          throw new HttpException(
            'Idea is already bookmarked ',
            HttpStatus.BAD_REQUEST,
          );
        }

        return user.toResponseObject(false);
      }

      async unbookmark(id: string, userId: string) {
        const idea = await this.ideaRepository.findOne({ where: { id } });
        const user = await this.userRepository.findOne({
          where: { id: userId },
          relations: ['bookmarks'],
        });

        if (user.bookmarks.filter(bookmark => bookmark.id === idea.id).length > 0) {
          user.bookmarks = user.bookmarks.filter(
            bookmark => bookmark.id !== idea.id,
          );
          await this.userRepository.save(user);
        } else {
          throw new HttpException('Cannot remove bookmark', HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(false);
      }
}
