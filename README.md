# fargate-express-blueprint

Production-ready Node.js Express API for AWS ECS Fargate. Includes health check, structured JSON logging, graceful shutdown, and a Bitbucket CI/CD pipeline.

## Files

| File | What it does |
|---|---|
| `app.js` | Express API - `/health` for ALB polling, `/api/v1/hello` as sample route, SIGTERM handler for clean shutdown |
| `Dockerfile` | Multi-stage build - `builder` installs deps, `runtime` runs as non-root user with built-in HEALTHCHECK |
| `package.json` | Minimal manifest - only `express` dependency |
| `bitbucket-pipelines.yml` | On push to `main`: builds image → pushes to ECR → updates ECS task definition → rolling deploy → waits for stable |

## Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check - returns `{ status: "healthy", timestamp }` |
| GET | `/api/v1/hello` | Sample route - returns environment name |

## Local Dev

```bash
npm install
node app.js

# or with Docker
docker build -t fargate-express-blueprint .
docker run -p 3000:3000 -e APP_ENV=dev fargate-express-blueprint
```

## CI/CD Variables

**Repository Variables:**

| Variable | Example |
|---|---|
| `AWS_DEFAULT_REGION` | `ap-south-1` |
| `AWS_ACCOUNT_ID` | `123456789012` |
| `ECR_REPO_NAME` | `node-api-prod` |
| `ECS_CLUSTER` | `node-api-cluster` |
| `CONTAINER_NAME` | `node-api-container` |

**Production Deployment Variables** *(mark AWS keys as secret)*:

| Variable | Example |
|---|---|
| `AWS_ACCESS_KEY_ID` | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | `wJalr...` |
| `ECS_SERVICE_NAME` | `node-api-svc` |
| `TASK_DEFINITION_FAMILY` | `node-api-td` |
| `APP_ENV` | `production` |

## Related

Infrastructure (VPC, ECS cluster, ALB, API Gateway) → [`aws-ecs-fargate-infra`](https://github.com/Divyap8/aws-ecs-fargate-infra.git)
