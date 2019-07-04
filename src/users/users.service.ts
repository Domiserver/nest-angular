import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entity/user.entity';
import { UserInterface } from './interface/user.interface';
import { UserDto, UserRO } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { IdeaEntity } from '../ideas/entity/idea.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(IdeaEntity)
        private readonly ideaRepository: Repository<IdeaEntity>,
        private readonly jwtService: JwtService,
      ) {}

    private userToResponseObject(user: UserEntity): UserRO {
        const responseObject: any = {
        };
        return responseObject;
      }

    async readAll(page: number = 1, newest?: boolean): Promise<UserRO[]> {
        const users = await this.userRepository.find({
             relations: ['ideas', 'bookmarks'],
             take: 3,
             skip: 3 * (page - 1),
             order: newest && { created: 'DESC' },
            });
        return users.map(user => user.toResponseObject(false));
    }

    async readOne(username: string) {
        const user = await this.userRepository.findOne({
          where: { username },
          relations: ['ideas', 'bookmarks'],
        });
        return user.toResponseObject(false);
      }

    async login(data: UserDto): Promise<UserRO> {
        const { username, password } = data;
        const user = await this.userRepository.findOne({where: {username} });
        if (!user || !(await user.comparePassword(password))) {
            throw new HttpException(
                'Invalid username/password',
                HttpStatus.UNAUTHORIZED,
            );
        }
        return user.toResponseObject();
    }

    async register(userDto: UserDto): Promise<UserRO> {
        const { username } = userDto;
        let user = await this.userRepository.findOne({where: {username} });
        if (user) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
        }
        user = await this.userRepository.create(userDto);
        await this.userRepository.save(user);
        return user.toResponseObject();
        }

    public async setAvatar(userId: number, avatarUrl: string) {
        this.userRepository.update(userId, {avatar: avatarUrl});
    }

    async update(
        id: string,
        userId: number,
        data: Partial<UserDto>,
        ): Promise<UserRO> {
        let user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new HttpException('Not found', HttpStatus.NOT_FOUND);
        }
        // this.ensureOwnership(idea, userId);
        await this.userRepository.update({ id }, data);
        // await this.userRepository.update(userId, {avatar});
        user = await this.userRepository.findOne({
            where: { id },
        });
        return this.userToResponseObject(user);
      }
}
