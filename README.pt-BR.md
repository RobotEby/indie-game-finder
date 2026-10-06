# indie-game-finder

Leia em: [English](README.md) | **Português (Brasil)**

Central de descoberta de jogos indie: API REST em Node.js/Express para consultar um catálogo de jogos, perfis de desenvolvedores e atividade dos jogadores armazenados em MySQL.

## O que é

A maioria das grandes lojas de jogos empurra os mesmos títulos AAA para o topo. O indie-game-finder existe para dar visibilidade a estúdios independentes. O modelo de dados registra seguidores de desenvolvedores e histórico de jogatinas, e a API oferece consultas de catálogo, contagens de seguidores e estatísticas de atividade dos jogadores.

## Funcionalidades

- Catálogo de jogos com informações de gênero, ano de lançamento e desenvolvedor
- Perfis de desenvolvedores com todos os jogos publicados e número de seguidores
- Quantidade de jogos e tempo total jogado por jogador, além do tamanho da biblioteca por nome
- Ranking dos dois jogos com maior alcance entre jogadores em todo o histórico
- Planos de assinatura (Free, Plus, Pro) com estatísticas agregadas de faturamento

## Modelo de dados

| Tabela           | Descrição                                                                 |
|-------------------|----------------------------------------------------------------------------|
| `plans`           | Planos de assinatura e seus preços                                       |
| `players`         | Usuários da plataforma; cada um com um plano ativo                       |
| `developers`      | Estúdios indie cadastrados                                                |
| `games`           | Catálogo de jogos, cada um vinculado a um desenvolvedor principal        |
| `game_sessions`   | Uma linha por sessão de jogo (jogador, jogo, data, minutos); um jogador pode jogar o mesmo jogo várias vezes |
| `followers`       | Jogadores que seguem desenvolvedores                                     |

Observação: nomes de tabelas, colunas, código e comentários estão em inglês (convenção comum em projetos de software); este README apenas documenta o projeto em português.

Os scripts estão em `database/schema.sql` (estrutura das tabelas) e `database/seed.sql` (dados de exemplo para desenvolvimento local). Métricas como `games_played`, `games_in_library` e `players_reached` contam jogos/jogadores **distintos**, não linhas de sessão. Se o seu banco foi criado antes de `game_sessions` aceitar sessões repetidas, aplique `database/migrations/001-game-sessions-multiple-sessions.sql` (MySQL 8.0.16+).

## Consultas de suporte

Em `database/queries/` ficam consultas SQL independentes para estatísticas gerais, atividade por jogador, jogos em alta em todo o histórico, faturamento agregado das assinaturas, perfis de desenvolvedores, catálogo por estúdio, tamanho da biblioteca do jogador, alcance entre jogadores Free e Plus e sugestões de títulos de edições especiais. Uma consulta histórica classifica os jogadores conforme a última atividade registrada tenha ocorrido em 2023. A API implementa o subconjunto de consultas listado abaixo.

## API

| Rota                                  | Descrição                                              |
|-----------------------------------------|-----------------------------------------------------------|
| `GET /plans`                           | Lista os planos disponíveis                            |
| `GET /developers`                      | Lista os desenvolvedores                                |
| `GET /developers/profile`              | Jogos + quantidade de seguidores por desenvolvedor     |
| `GET /developers/:name/games`          | Catálogo de um desenvolvedor específico                 |
| `GET /games`                           | Lista todos os jogos, incluindo gênero e ano de lançamento |
| `GET /games/trending`                  | Dois jogos com maior alcance em todo o histórico           |
| `GET /players`                         | Lista os jogadores                                       |
| `GET /players/activity`                | Quantidade de jogos e minutos totais por jogador           |
| `GET /players/:name/library`           | Contagem de jogos pelo nome do jogador (`games_in_library`) |
| `GET /stats/general`                   | Números gerais da plataforma                              |
| `GET /stats/revenue`                   | Faturamento mínimo, máximo, médio e total das assinaturas   |

`GET /games` retorna o catálogo completo, sem filtros por gênero ou ano de lançamento. As estatísticas de faturamento agregam os preços dos planos de todos os jogadores em um único resultado.

### Como rodar

1. Crie o banco de dados. **`database/schema.sql` exclui e recria `indieGameFinder`, apagando os dados existentes nesse banco.**
   ```sh
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   ```

2. Configure a API:
   ```sh
   cd api
   cp .env.example .env   # edite com suas credenciais do MySQL; DB_NAME=indieGameFinder
   npm install
   npm start
   ```

3. A API sobe em `http://localhost:3333` por padrão.

## Testes

Todas as rotas têm testes com Jest + Supertest, usando um mock do pool de conexão (`db/__mocks__/pool.js`) — a suíte roda sem depender de um MySQL real.

```sh
cd api
npm install
npm test
```

Uma segunda suíte roda as rotas reais contra um MySQL 8.0.16+ de verdade, carregando antes `database/schema.sql` e `database/seed.sql`; assim cobre o que o mock não valida (`GROUP BY` estrito, regras de `CHECK` e chave estrangeira, resultados agregados). **Ela apaga e recria `indieGameFinder`, então use um servidor descartável**; só roda com `RUN_DB_INTEGRATION=1`.

```sh
cd api
RUN_DB_INTEGRATION=1 npm run test:integration   # usa DB_HOST / DB_USER / DB_PASSWORD
```

O GitHub Actions (`.github/workflows/ci.yml`) roda a suíte com mock no Node 20 e 22 e a suíte MySQL contra um container `mysql:8.0` a cada push em `main` e a cada pull request.

## Roadmap

- Migrations versionadas (Knex ou Prisma)
- Autenticação de jogadores
- Documentação da API em OpenAPI/Swagger
- Interface web para navegação no catálogo
