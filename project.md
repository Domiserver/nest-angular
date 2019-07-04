# App Objective 
- Creating CRUD sample environments using NestJs with TypeScript and MySQL

# User Stories
- CRUD operations
- Authenticate users

# Stack
- Server-side:NestJs built with TypeScript
- Database: MySQL
- ORM: TypeORM
- Frontend: Angular
- CSS: Angular Material
- Icons: Angular Icons
- IDE: Visual Studio Code / Andromeda Colorizer Theme

# credits
- docs.nestjs.com (documentation)
- naimjeen (github repository)
- Kelvin Mai (youTube channel)
- Fazt Code (youTube channel)
- Ben Awad (youTube channel)
- Amit Shukla (youTube channel)

# project self-reminder notes

- ormconfig.json is being ignored in .gitignore
    {
    "name": "default",
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "your-password",
    "database": "your-database-name",    
    "entities": [
      "./dist/components/books/entity/books.entity.js",
      "./dist/components/aos-products/entity/aos-products.entity.js",
      "./dist/components/usuarios/entity/usuarios.entity.js"
    ],
    "synchronize": true, #in order to sync with database
    "logging": true
  }

- Project was scaffolded with Nest CLI using the Express Platform.

- Data descriptions will follow this pattern to avoid confussions: 
    
    - Database Tables within Entity.ts will be named as plurals @Entity('your-database-name'). 
    - Dto, Interface, Entity and Repository per component will be written as singulars.
    - Controllers, Modules and Services will be written as plurals.

- Features used:
    Nest's Pipe capabilities
        - class-validator library
        - class-transformer library
    Nest's Exception filters
