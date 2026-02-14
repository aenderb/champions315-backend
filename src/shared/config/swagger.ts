import swaggerJsdoc from "swagger-jsdoc";
import { env } from "@/env";

const servers = env.NODE_ENV === "production"
  ? [{ url: "/api", description: "Servidor de produção" }]
  : [{ url: "http://localhost:3333/api", description: "Servidor de desenvolvimento" }];

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Champions 315 API",
      version: "1.0.0",
      description:
        "API para gerenciamento de times de futebol com regra de idade 315. Autenticação via cookies httpOnly.",
      contact: {
        name: "Champions 315",
      },
    },
    servers,
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            avatar: { type: "string", nullable: true },
            created_at: { type: "string", format: "date-time" },
          },
        },
        Team: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            user_id: { type: "string", format: "uuid" },
            name: { type: "string" },
            color: { type: "string" },
            badge: { type: "string", nullable: true },
            year: { type: "integer", nullable: true },
            sponsor: { type: "string", nullable: true },
            sponsor_logo: { type: "string", nullable: true },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Player: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            team_id: { type: "string", format: "uuid" },
            number: { type: "integer" },
            name: { type: "string" },
            birth_date: { type: "string", format: "date" },
            avatar: { type: "string", nullable: true },
            position: {
              type: "string",
              enum: ["GK", "DEF", "MID", "FWD"],
            },
            field_role: {
              type: "string",
              enum: ["GK", "RL", "RCB", "LCB", "LL", "RM", "CM", "LM", "RW", "ST", "LW"],
              nullable: true,
              description: "Posição específica no campo.",
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Lineup: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            team_id: { type: "string", format: "uuid" },
            name: { type: "string" },
            formation: { type: "string", example: "4-3-1" },
            starters: {
              type: "array",
              items: { $ref: "#/components/schemas/Player" },
            },
            bench: {
              type: "array",
              items: { $ref: "#/components/schemas/Player" },
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            message: { type: "string" },
          },
        },
        Match: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            team_id: { type: "string", format: "uuid" },
            opponent_name: { type: "string" },
            team_score: { type: "integer" },
            opponent_score: { type: "integer" },
            date: { type: "string", format: "date" },
            notes: { type: "string", nullable: true },
            cards: {
              type: "array",
              items: { $ref: "#/components/schemas/MatchCard" },
            },
            created_at: { type: "string", format: "date-time" },
            updated_at: { type: "string", format: "date-time" },
          },
        },
        MatchCard: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            match_id: { type: "string", format: "uuid" },
            player_id: { type: "string", format: "uuid" },
            type: { type: "string", enum: ["YELLOW", "RED"] },
            minute: { type: "integer", nullable: true },
            player: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                name: { type: "string" },
                number: { type: "integer" },
              },
            },
          },
        },
      },
      },
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
    tags: [
      { name: "Auth", description: "Autenticação e registro" },
      { name: "Users", description: "Gerenciamento de usuários" },
      { name: "Teams", description: "Gerenciamento de times" },
      { name: "Players", description: "Gerenciamento de jogadores" },
      { name: "Lineups", description: "Gerenciamento de escalações" },
      { name: "Matches", description: "Registro de partidas e cartões" },
    ],
    paths: {
      // ==================== AUTH ====================
      "/users/signup": {
        post: {
          tags: ["Auth"],
          summary: "Criar conta de usuário",
          description: "Registra um novo usuário. Aceita multipart/form-data para upload de avatar (armazenado no Cloudinary).",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["name", "email", "password"],
                  properties: {
                    name: { type: "string", minLength: 3, example: "João Silva" },
                    email: { type: "string", format: "email", example: "joao@email.com" },
                    password: { type: "string", minLength: 6, example: "123456" },
                    avatar: { type: "string", format: "binary", description: "Foto do avatar (JPEG, PNG ou WebP, máx 5MB). Upload via Cloudinary." },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Usuário criado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            409: {
              description: "E-mail já cadastrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/users/signin": {
        post: {
          tags: ["Auth"],
          summary: "Login",
          description: "Autentica o usuário e retorna cookies httpOnly com access token (15min) e refresh token (7d).",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password"],
                  properties: {
                    email: { type: "string", format: "email", example: "joao@email.com" },
                    password: { type: "string", example: "123456" },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Login realizado. Cookies `token` e `refresh_token` definidos.",
              headers: {
                "Set-Cookie": {
                  description: "Cookies httpOnly com tokens de autenticação",
                  schema: { type: "string" },
                },
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      user: { $ref: "#/components/schemas/User" },
                    },
                  },
                },
              },
            },
            401: {
              description: "Credenciais inválidas",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/users/refresh": {
        post: {
          tags: ["Auth"],
          summary: "Renovar access token",
          description: "Usa o cookie `refresh_token` para gerar um novo access token e um novo refresh token.",
          responses: {
            200: {
              description: "Tokens renovados. Novos cookies definidos.",
              headers: {
                "Set-Cookie": {
                  description: "Novos cookies httpOnly",
                  schema: { type: "string" },
                },
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Token renovado com sucesso" },
                    },
                  },
                },
              },
            },
            401: {
              description: "Refresh token inválido ou expirado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/users/logout": {
        post: {
          tags: ["Auth"],
          summary: "Logout",
          description: "Revoga o refresh token e limpa os cookies de autenticação. Requer cookie `token`.",
          responses: {
            200: {
              description: "Logout realizado",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Logout realizado com sucesso" },
                    },
                  },
                },
              },
            },
            401: {
              description: "Não autenticado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ==================== USERS ====================
      "/users/avatar": {
        patch: {
          tags: ["Users"],
          summary: "Atualizar avatar do usuário",
          description: "Atualiza a foto de perfil do usuário autenticado. Envia a imagem via multipart/form-data (Cloudinary).",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["avatar"],
                  properties: {
                    avatar: { type: "string", format: "binary", description: "Nova foto de perfil (JPEG, PNG ou WebP, máx 5MB). Upload via Cloudinary." },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Avatar atualizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            400: {
              description: "Nenhuma imagem enviada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            401: {
              description: "Não autenticado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
      "/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Buscar usuário por ID",
          description: "Retorna os dados de um usuário. Requer autenticação.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do usuário",
            },
          ],
          responses: {
            200: {
              description: "Usuário encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" },
                },
              },
            },
            404: {
              description: "Usuário não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ==================== TEAMS ====================
      "/teams": {
        post: {
          tags: ["Teams"],
          summary: "Criar time",
          description: "Cria um novo time vinculado ao usuário autenticado. Aceita multipart/form-data para upload de badge e logo do patrocinador (Cloudinary).",
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["name", "color"],
                  properties: {
                    name: { type: "string", minLength: 2, maxLength: 100, example: "FC Champions" },
                    color: { type: "string", minLength: 3, maxLength: 20, example: "blue" },
                    badge: { type: "string", format: "binary", description: "Logo do time (JPEG, PNG ou WebP, máx 5MB). Upload via Cloudinary." },
                    year: { type: "integer", minimum: 1900, maximum: 2100, example: 2020 },
                    sponsor: { type: "string", maxLength: 100, example: "Nike" },
                    sponsor_logo: { type: "string", format: "binary", description: "Logo do patrocinador (JPEG, PNG ou WebP, máx 5MB). Upload via Cloudinary." },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Time criado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
          },
        },
        get: {
          tags: ["Teams"],
          summary: "Listar times do usuário",
          description: "Retorna todos os times do usuário autenticado.",
          responses: {
            200: {
              description: "Lista de times",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Team" },
                  },
                },
              },
            },
          },
        },
      },
      "/teams/{id}": {
        get: {
          tags: ["Teams"],
          summary: "Buscar time por ID",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Time encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
            404: {
              description: "Time não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
        put: {
          tags: ["Teams"],
          summary: "Atualizar time",
          description: "Atualiza os dados de um time. Aceita multipart/form-data para upload de badge e logo do patrocinador (Cloudinary). Apenas o dono pode atualizar.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", minLength: 2, maxLength: 100 },
                    color: { type: "string", minLength: 3, maxLength: 20 },
                    badge: { type: "string", format: "binary", description: "Logo do time (JPEG, PNG ou WebP, máx 5MB). Upload via Cloudinary." },
                    year: { type: "integer", nullable: true },
                    sponsor: { type: "string", nullable: true },
                    sponsor_logo: { type: "string", format: "binary", description: "Logo do patrocinador (JPEG, PNG ou WebP, máx 5MB). Upload via Cloudinary." },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Time atualizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Team" },
                },
              },
            },
            403: { description: "Sem permissão" },
            404: { description: "Time não encontrado" },
          },
        },
        delete: {
          tags: ["Teams"],
          summary: "Excluir time",
          description: "Exclui um time e todos os seus jogadores e escalações. Apenas o dono pode excluir.",
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            204: { description: "Time excluído" },
            403: { description: "Sem permissão" },
            404: { description: "Time não encontrado" },
          },
        },
      },

      // ==================== PLAYERS ====================
      "/teams/{teamId}/players": {
        post: {
          tags: ["Players"],
          summary: "Criar jogador",
          description: "Adiciona um jogador ao time. Aceita multipart/form-data para upload de avatar (Cloudinary). Apenas o dono do time pode adicionar.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do time",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  required: ["number", "name", "birth_date", "position"],
                  properties: {
                    number: { type: "integer", minimum: 1, maximum: 99, example: 10 },
                    name: { type: "string", minLength: 2, maxLength: 100, example: "Neymar Jr" },
                    birth_date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", example: "1992-02-05" },
                    avatar: { type: "string", format: "binary", description: "Foto do jogador (JPEG, PNG ou WebP, máx 5MB). Upload via Cloudinary." },
                    position: {
                      type: "string",
                      enum: ["GK", "DEF", "MID", "FWD"],
                      example: "FWD",
                    },
                    field_role: {
                      type: "string",
                      enum: ["GK", "RL", "RCB", "LCB", "LL", "RM", "CM", "LM", "RW", "ST", "LW"],
                      description: "Posição específica no campo",
                      example: "RW",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Jogador criado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Player" },
                },
              },
            },
            403: { description: "Sem permissão" },
            404: { description: "Time não encontrado" },
          },
        },
        get: {
          tags: ["Players"],
          summary: "Listar jogadores do time",
          description: "Retorna todos os jogadores do time, ordenados por número.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do time",
            },
          ],
          responses: {
            200: {
              description: "Lista de jogadores",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Player" },
                  },
                },
              },
            },
            404: { description: "Time não encontrado" },
          },
        },
      },
      "/teams/{teamId}/players/{id}": {
        get: {
          tags: ["Players"],
          summary: "Buscar jogador por ID",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Jogador encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Player" },
                },
              },
            },
            404: { description: "Jogador não encontrado" },
          },
        },
        put: {
          tags: ["Players"],
          summary: "Atualizar jogador",
          description: "Atualiza os dados de um jogador. Aceita multipart/form-data para upload de avatar (Cloudinary). Apenas o dono do time pode atualizar.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "multipart/form-data": {
                schema: {
                  type: "object",
                  properties: {
                    number: { type: "integer", minimum: 1, maximum: 99 },
                    name: { type: "string", minLength: 2, maxLength: 100 },
                    birth_date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
                    avatar: { type: "string", format: "binary", description: "Foto do jogador (JPEG, PNG ou WebP, máx 5MB). Upload via Cloudinary." },
                    position: {
                      type: "string",
                      enum: ["GK", "DEF", "MID", "FWD"],
                    },
                    field_role: {
                      type: "string",
                      enum: ["GK", "RL", "RCB", "LCB", "LL", "RM", "CM", "LM", "RW", "ST", "LW"],
                      nullable: true,
                      description: "Posição específica no campo (null para remover)",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Jogador atualizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Player" },
                },
              },
            },
            403: { description: "Sem permissão" },
            404: { description: "Jogador não encontrado" },
          },
        },
        delete: {
          tags: ["Players"],
          summary: "Excluir jogador",
          description: "Remove um jogador do time. Apenas o dono do time pode excluir.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            204: { description: "Jogador excluído" },
            403: { description: "Sem permissão" },
            404: { description: "Jogador não encontrado" },
          },
        },
      },

      // ==================== LINEUPS ====================
      "/teams/{teamId}/lineups": {
        post: {
          tags: ["Lineups"],
          summary: "Criar escalação",
          description: "Cria uma escalação com exatamente 9 titulares e reservas. Apenas o dono do time pode criar.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do time",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["name", "starter_ids", "bench_ids"],
                  properties: {
                    name: { type: "string", minLength: 2, maxLength: 100, example: "Escalação Principal" },
                    formation: { type: "string", example: "4-3-1", default: "4-3-1" },
                    starter_ids: {
                      type: "array",
                      items: { type: "string", format: "uuid" },
                      minItems: 9,
                      maxItems: 9,
                      description: "Exatamente 9 IDs de jogadores titulares",
                    },
                    bench_ids: {
                      type: "array",
                      items: { type: "string", format: "uuid" },
                      description: "IDs dos jogadores reservas",
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Escalação criada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Lineup" },
                },
              },
            },
            400: { description: "Deve ter exatamente 9 titulares / Jogador duplicado" },
            403: { description: "Sem permissão" },
            404: { description: "Time não encontrado" },
          },
        },
        get: {
          tags: ["Lineups"],
          summary: "Listar escalações do time",
          description: "Retorna todas as escalações do time com jogadores populados.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Lista de escalações",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Lineup" },
                  },
                },
              },
            },
            404: { description: "Time não encontrado" },
          },
        },
      },
      "/teams/{teamId}/lineups/{id}": {
        get: {
          tags: ["Lineups"],
          summary: "Buscar escalação por ID",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Escalação encontrada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Lineup" },
                },
              },
            },
            404: { description: "Escalação não encontrada" },
          },
        },
        put: {
          tags: ["Lineups"],
          summary: "Atualizar escalação",
          description: "Atualiza nome, formação e/ou jogadores. Apenas o dono do time pode atualizar.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    name: { type: "string", minLength: 2, maxLength: 100 },
                    formation: { type: "string" },
                    starter_ids: {
                      type: "array",
                      items: { type: "string", format: "uuid" },
                      minItems: 9,
                      maxItems: 9,
                    },
                    bench_ids: {
                      type: "array",
                      items: { type: "string", format: "uuid" },
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Escalação atualizada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Lineup" },
                },
              },
            },
            400: { description: "Deve ter exatamente 9 titulares" },
            403: { description: "Sem permissão" },
            404: { description: "Escalação não encontrada" },
          },
        },
        delete: {
          tags: ["Lineups"],
          summary: "Excluir escalação",
          description: "Remove uma escalação. Apenas o dono do time pode excluir.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            204: { description: "Escalação excluída" },
            403: { description: "Sem permissão" },
            404: { description: "Escalação não encontrada" },
          },
        },
      },

      // ==================== MATCHES ====================
      "/teams/{teamId}/matches": {
        post: {
          tags: ["Matches"],
          summary: "Registrar partida",
          description: "Registra uma partida do time, opcionalmente com cartões recebidos. Apenas o dono do time pode registrar.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do time",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["opponent_name", "team_score", "opponent_score", "date"],
                  properties: {
                    opponent_name: { type: "string", minLength: 2, maxLength: 100, example: "FC Rivais" },
                    team_score: { type: "integer", minimum: 0, example: 3 },
                    opponent_score: { type: "integer", minimum: 0, example: 1 },
                    date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", example: "2026-02-10" },
                    notes: { type: "string", maxLength: 500, example: "Vitória tranquila" },
                    cards: {
                      type: "array",
                      items: {
                        type: "object",
                        required: ["player_id", "type"],
                        properties: {
                          player_id: { type: "string", format: "uuid" },
                          type: { type: "string", enum: ["YELLOW", "RED"], example: "YELLOW" },
                          minute: { type: "integer", minimum: 0, maximum: 120, example: 45 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Partida registrada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Match" },
                },
              },
            },
            400: { description: "Jogador não pertence ao time" },
            403: { description: "Sem permissão" },
            404: { description: "Time não encontrado" },
          },
        },
        get: {
          tags: ["Matches"],
          summary: "Listar partidas do time",
          description: "Retorna todas as partidas do time com cartões, ordenadas por data decrescente.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Lista de partidas",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Match" },
                  },
                },
              },
            },
            404: { description: "Time não encontrado" },
          },
        },
      },
      "/teams/{teamId}/matches/{id}": {
        get: {
          tags: ["Matches"],
          summary: "Buscar partida por ID",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            200: {
              description: "Partida encontrada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Match" },
                },
              },
            },
            404: { description: "Partida não encontrada" },
          },
        },
        put: {
          tags: ["Matches"],
          summary: "Atualizar partida",
          description: "Atualiza dados da partida (não altera cartões). Apenas o dono do time pode atualizar.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    opponent_name: { type: "string", minLength: 2, maxLength: 100 },
                    team_score: { type: "integer", minimum: 0 },
                    opponent_score: { type: "integer", minimum: 0 },
                    date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
                    notes: { type: "string", maxLength: 500, nullable: true },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Partida atualizada",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Match" },
                },
              },
            },
            403: { description: "Sem permissão" },
            404: { description: "Partida não encontrada" },
          },
        },
        delete: {
          tags: ["Matches"],
          summary: "Excluir partida",
          description: "Remove uma partida e todos os seus cartões. Apenas o dono do time pode excluir.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
          ],
          responses: {
            204: { description: "Partida excluída" },
            403: { description: "Sem permissão" },
            404: { description: "Partida não encontrada" },
          },
        },
      },
      "/teams/{teamId}/matches/{id}/cards": {
        post: {
          tags: ["Matches"],
          summary: "Adicionar cartão",
          description: "Adiciona um cartão a uma partida existente. O jogador deve pertencer ao time.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID da partida",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["player_id", "type"],
                  properties: {
                    player_id: { type: "string", format: "uuid" },
                    type: { type: "string", enum: ["YELLOW", "RED"], example: "YELLOW" },
                    minute: { type: "integer", minimum: 0, maximum: 120, example: 32 },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: "Cartão adicionado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MatchCard" },
                },
              },
            },
            400: { description: "Jogador não pertence ao time" },
            403: { description: "Sem permissão" },
            404: { description: "Partida não encontrada" },
          },
        },
      },
      "/teams/{teamId}/matches/{id}/cards/{cardId}": {
        delete: {
          tags: ["Matches"],
          summary: "Remover cartão",
          description: "Remove um cartão de uma partida. Apenas o dono do time pode remover.",
          parameters: [
            {
              name: "teamId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
            },
            {
              name: "id",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID da partida",
            },
            {
              name: "cardId",
              in: "path",
              required: true,
              schema: { type: "string", format: "uuid" },
              description: "ID do cartão",
            },
          ],
          responses: {
            204: { description: "Cartão removido" },
            403: { description: "Sem permissão" },
            404: { description: "Cartão não encontrado" },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
