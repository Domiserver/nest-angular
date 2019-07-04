import { IsString } from 'class-validator';
import { UserRO } from '../../users/dto/user.dto';

export class IdeaDto {

    @IsString()
    readonly idea: string;

    @IsString()
    readonly description: string;

  }

// tslint:disable-next-line: max-classes-per-file
export class IdeaRO {
    id?: string;
    created: Date;
    updated: Date;
    idea: string;
    description: string;
    author: UserRO;
    upvotes?: number;
    downvotes?: number;
  }
