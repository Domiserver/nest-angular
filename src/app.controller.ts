import { Controller, Get, UploadedFile, UseInterceptors, Post, Param, Res, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

//   @Post()
//   @UseInterceptors(FileInterceptor('image',
//       {
//         storage: diskStorage({
//           destination: './uploads',

//           filename: (req, file, cb) => {
//             const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
//             return cb(null, `${randomName}${extname(file.originalname)}`);
//           },
//         }),
//       },
//     ),
//     )
//   uploadFile(@UploadedFiles() file) {
// // tslint:disable-next-line: no-console
//   console.log(file);
//   }

//   @Get(':imgpath')
//   seeUploadedFile(@Param('imgpath') image,
//                   @Res() res) {
//     return res.sendFile(image, {root:
//     'uploads'});
//   }
}
