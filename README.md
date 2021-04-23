# backend-workflow

Como iniciar o projeto?

OBS: Todos os comandos referentes ao terminal devem ser realizados na pasta raiz do projeto!

1.  É necessário ter o Docker instalado em sua máquina.
2. Para utilizar o RabbitMQ, siga o passo a passo:

Use o comando para configurar o seu container:
sudo docker run -d --hostname my-rabbit --name rabbit13 -p 8080:15672 -p 5672:5672 -p 25676:25676 rabbitmq:3-management

Acesse a interface de administração a partir da seguinte url:
http://localhost:8080/

Realize o login:
admin: guest
password: guest

3. Instale as dependências de projeto com os seguintes comandos:

npm install express
npm install cors
npm install knex sqlite3
npm install amqplib
npm install --save-dev jest
npm install supertest --save-dev

4. Configure o banco de dados no arquivo knexfile.js, que fica na raiz do projeto, modificando o nome do banco de dados, seu usuário e senha.

5. Para criar tabelas no banco de dados, utilize o seguinte comando:

npx knex migrate:latest

6. Para iniciar o projeto, utilize o seguinte comando:

npm start

7. Para rodar os testes, utilize o seguinte comando:

npx jest
