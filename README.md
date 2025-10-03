# Cadastro de Usuários Sisand (Monorepo)

Projeto de aplicação para cadastro e gerenciamento de usuários (CRUD completo), desenvolvido com **ASP.NET Core 8 Web API** e **Angular**.

Este projeto utiliza um **Monorepo** (repositório único), contendo as seguintes estruturas:

| Pasta | Descrição | Tecnologia | Porta Padrão |
| :--- | :--- | :--- | :--- |
| **`Sisand.Api`** | Backend: Lógica de negócio, autenticação (JWT) e API REST. | .NET Core 8 | `https://localhost:7041` |
| **`sisand-frontend`** | Frontend: Interface SPA (Single Page Application) com Bootstrap. | Angular 17+ | `http://localhost:4200` |

---


## 🛠️ Tecnologias Utilizadas

**Backend (`Sisand.Api`):**
* **Linguagem:** C# (.NET Core 8)
* **Banco de Dados:** PostgreSQL
* **ORM:** Entity Framework Core
* **Segurança:** JSON Web Tokens (JWT) e Password Hashing/Salt.

**Frontend (`sisand-frontend`):**
* **Framework:** Angular (v17+)
* **Estilização:** Bootstrap 5
* **Segurança:** HTTP Interceptor para anexar o Token JWT em todas as requisições autenticadas.

---

## 🚀 Setup e Execução Local

Para rodar a aplicação, você deve inicializar o Backend e o Frontend separadamente.

### Pré-requisitos

1.  **.NET 8 SDK**
2.  **Node.js e npm** (ou Yarn/pnpm)
3.  **Angular** (`npm install`)
4.  **PostgreSQL** rodando localmente.

### Passo 1: Configuração do Banco de Dados (Backend)

1.  **Conexão:** Navegue até `Sisand.Api/appsettings.json` e **atualize** a string de conexão `"DefaultConnection"` com suas credenciais do PostgreSQL.

    ```json
    "ConnectionStrings": {
        "DefaultConnection": "Host=localhost;Database=sisandcrm;Username=postgres;Password=SEGREDO"
    }
    ```

2.  **Migrações:** Na raiz do projeto, aplique as migrações:

    ```bash
    # Se já estiverem criadas, apenas aplica:
    dotnet ef database update --project Sisand.Infrastructure --startup-project Sisand.Api
    ```

### Passo 2: Inicializar o Backend

1.  Abra o terminal e navegue para a pasta do Backend:

    ```bash
    cd Sisand.Api
    ```

2.  Rode a API:

    ```bash
    dotnet run
    # A API estará ativa em https://localhost:7041
    ```

### Passo 3: Inicializar o Frontend

1.  Abra um **novo terminal** e navegue para a pasta do Frontend:

    ```bash
    cd sisand-frontend
    ```

2.  Instale as dependências:

    ```bash
    npm install
    ```

3.  Rode a aplicação Angular:

    ```bash
    ng serve -o
    # O app abrirá automaticamente no navegador em http://localhost:4200
    ```

---
