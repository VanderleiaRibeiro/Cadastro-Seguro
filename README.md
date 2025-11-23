# Projeto Final - Backend + Frontend (Upload Seguro + JWT + RBAC)

Este projeto implementa:
- Registro de usuários (com bcrypt)
- Login com JWT
- Upload protegido com token
- Deleção protegida (Admin)
- RBAC (User/Admin)
- Frontend completo com integração
- Modularização usando Express Router

## Como rodar

1. Acesse a pasta:
   ```
   cd backend
   ```

2. Instale dependências:
   ```
   npm install
   ```

3. Execute o servidor:
   ```
   node server.js
   ```

4. Abra o navegador em:
   ```
   http://localhost:3000
   ```

## Fluxos de teste

### 1. Registrar usuário
- Preencha username, email e password.
- Deve receber mensagem de sucesso.

### 2. Login
- Ao logar, o token é salvo no localStorage.
- A UI muda automaticamente e habilita o upload.

### 3. Upload de arquivos
- Selecione até 10 imagens PNG/JPEG.
- Enviar → deve funcionar se estiver logado.
- Testes de erro:
  - >10 arquivos → “Too many files”
  - Arquivo não imagem → “Tipo de arquivo inválido”

### 4. Teste Admin
- Já existe um usuário admin criado no backend:
  - **username:** admin
  - **senha:** admin123
- Após logar como admin, aparece a seção de deletar arquivos.

### 5. DELETE /file/:filename (apenas admin)
- Informe nome do arquivo enviado (ex: `1718329183-123123123.png`)
- Se admin → 200 OK
- Se user → 403 Forbidden

## Observações
- Os usuários são armazenados apenas em memória.
- Ao reiniciar o servidor, novos cadastros somem.
- O frontend é servido automaticamente pelo backend.

