import { createParamDecorator } from '@nestjs/common';

export const UsersDecorator = createParamDecorator((data, req) => {
    return data ? req.user[data] : req.user;
});
