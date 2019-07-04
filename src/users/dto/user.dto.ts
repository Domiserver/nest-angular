import { IsNotEmpty } from 'class-validator';

import { IdeaEntity } from '../../ideas/entity/idea.entity';
import { Column } from 'typeorm';

export class UserDto {

    @IsNotEmpty()
    readonly username?: string;

    @IsNotEmpty()
    readonly password: string;

    @Column()
    readonly avatar?: string;

  }

// tslint:disable-next-line: max-classes-per-file
export class UserRO {
  id: string;
  username: string;
  created: Date;
  token?: string;
  ideas?: IdeaEntity[];
  bookmarks?: IdeaEntity[];
}
