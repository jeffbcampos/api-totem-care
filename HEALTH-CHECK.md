# Health Check - Totem Care API

## Visão Geral

A API possui 3 endpoints de health check para monitoramento da aplicação:

1. **Health Check** - Verifica saúde geral e dependências
2. **Readiness Check** - Verifica se está pronta para receber requisições
3. **Liveness Check** - Verifica se está viva/respondendo

## Endpoints

### 1. Health Check (Principal)

Verifica o status da aplicação e suas dependências (banco de dados).

```http
GET /health
```

**Resposta de Sucesso (200 OK):**
```json
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

**Resposta de Erro (503 Service Unavailable):**
```json
{
  "status": "error",
  "info": {},
  "error": {
    "database": {
      "status": "down",
      "message": "Connection failed"
    }
  },
  "details": {
    "database": {
      "status": "down",
      "message": "Connection failed"
    }
  }
}
```

**Uso:**
- Monitoramento de infraestrutura
- Alertas quando banco de dados está indisponível
- Verificação antes de deploy

---

### 2. Readiness Check

Verifica se a aplicação está pronta para receber requisições.

```http
GET /health/ready
```

**Resposta (200 OK):**
```json
{
  "status": "ready",
  "timestamp": "2024-11-22T19:23:45.123Z",
  "uptime": 3600
}
```

**Campos:**
- `status`: Status de prontidão ("ready")
- `timestamp`: Data/hora atual em ISO 8601
- `uptime`: Tempo de execução em segundos

**Uso:**
- Kubernetes readiness probe
- Load balancer health check
- Verificar se pode receber tráfego

---

### 3. Liveness Check

Verifica se a aplicação está viva (respondendo).

```http
GET /health/live
```

**Resposta (200 OK):**
```json
{
  "status": "alive",
  "timestamp": "2024-11-22T19:23:45.123Z"
}
```

**Campos:**
- `status`: Status de vida ("alive")
- `timestamp`: Data/hora atual em ISO 8601

**Uso:**
- Kubernetes liveness probe
- Verificar se processo não travou
- Restart automático se não responder

---

## Integração com Kubernetes

### Exemplo de Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: totem-care-api
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: api
        image: totem-care:latest
        ports:
        - containerPort: 3000
        
        # Liveness Probe - Reinicia se falhar
        livenessProbe:
          httpGet:
            path: /health/live
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        
        # Readiness Probe - Remove do load balancer se falhar
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 2
        
        # Startup Probe - Aguarda inicialização
        startupProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 0
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 30
```

---

## Integração com Docker Compose

### Exemplo de Health Check

```yaml
version: '3.8'

services:
  api:
    image: totem-care:latest
    ports:
      - "3000:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    depends_on:
      db:
        condition: service_healthy
  
  db:
    image: postgres:14
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
```

---

## Monitoramento com Prometheus

### Métricas Disponíveis

Os endpoints de health check podem ser integrados com Prometheus para monitoramento:

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'totem-care-health'
    metrics_path: '/health'
    scrape_interval: 30s
    static_configs:
      - targets: ['localhost:3000']
```

---

## Testes com cURL

### Teste Básico
```bash
# Health check principal
curl http://localhost:3000/health

# Readiness
curl http://localhost:3000/health/ready

# Liveness
curl http://localhost:3000/health/live
```

### Teste com Timeout
```bash
# Falha se não responder em 5 segundos
curl --max-time 5 http://localhost:3000/health
```

### Teste de Status Code
```bash
# Retorna apenas o status code
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:3000/health
```

### Script de Monitoramento
```bash
#!/bin/bash
# health-monitor.sh

while true; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
  
  if [ $STATUS -eq 200 ]; then
    echo "$(date): ✅ API is healthy"
  else
    echo "$(date): ❌ API is unhealthy (Status: $STATUS)"
    # Enviar alerta aqui
  fi
  
  sleep 30
done
```

---

## Alertas e Notificações

### Exemplo com Slack Webhook

```bash
#!/bin/bash
# health-alert.sh

SLACK_WEBHOOK="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

STATUS=$(curl -s http://localhost:3000/health | jq -r '.status')

if [ "$STATUS" != "ok" ]; then
  curl -X POST $SLACK_WEBHOOK \
    -H 'Content-Type: application/json' \
    -d '{
      "text": "🚨 Totem Care API está com problemas!",
      "attachments": [{
        "color": "danger",
        "fields": [{
          "title": "Status",
          "value": "'"$STATUS"'",
          "short": true
        }]
      }]
    }'
fi
```

---

## Boas Práticas

### 1. Timeouts Apropriados
- **Liveness**: 5-10 segundos
- **Readiness**: 3-5 segundos
- **Health**: 10-15 segundos

### 2. Frequência de Verificação
- **Liveness**: A cada 10-30 segundos
- **Readiness**: A cada 5-10 segundos
- **Health**: A cada 30-60 segundos

### 3. Thresholds
- **Liveness**: 3-5 falhas consecutivas antes de reiniciar
- **Readiness**: 2-3 falhas antes de remover do load balancer
- **Health**: 2-3 falhas antes de alertar

### 4. Startup Time
- Aguarde 30-60 segundos antes de iniciar probes
- Use startup probe para aplicações com inicialização lenta

---

## Troubleshooting

### Problema: Health check sempre retorna erro

**Possíveis causas:**
1. Banco de dados não está acessível
2. Credenciais incorretas no `.env`
3. Firewall bloqueando conexão

**Solução:**
```bash
# Verificar conexão com banco
psql -h localhost -U postgres -d totem_care

# Verificar variáveis de ambiente
cat .env | grep DATABASE_URL

# Testar conexão diretamente
npx prisma db pull
```

### Problema: Readiness sempre retorna "not ready"

**Possíveis causas:**
1. Aplicação ainda está inicializando
2. Dependências não carregadas

**Solução:**
- Aumentar `initialDelaySeconds` no probe
- Verificar logs da aplicação

### Problema: Liveness probe reiniciando constantemente

**Possíveis causas:**
1. Timeout muito curto
2. Aplicação realmente travada
3. Recursos insuficientes (CPU/memória)

**Solução:**
- Aumentar timeout e threshold
- Verificar uso de recursos
- Analisar logs antes do restart

---

## Swagger Documentation

Todos os endpoints de health check estão documentados no Swagger:

```
http://localhost:3000/api#/health
```

Você pode testar os endpoints diretamente pela interface do Swagger.

---

## Resumo

| Endpoint | Propósito | Uso Principal |
|----------|-----------|---------------|
| `/health` | Verifica saúde geral + DB | Monitoramento, alertas |
| `/health/ready` | Verifica se está pronta | Load balancer, K8s readiness |
| `/health/live` | Verifica se está viva | K8s liveness, restart automático |

Todos os endpoints retornam **200 OK** quando saudáveis e **503 Service Unavailable** quando há problemas.
