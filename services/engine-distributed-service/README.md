# engine-distributed-service

Enterprise distributed systems service wrapping engine-distributed domain (replication, coordination, consensus).

## Responsibility

- Wraps engine-distributed: ReplicationEngine, leader election, DistributedLock
- Exposes: `POST /api/Distributed/replicate`, `POST /api/Distributed/coordinate`, `GET /health`
- Independent deployment, scaling, failure domain

## API

### POST /api/Distributed/replicate

**Request:**
```json
{
  "entries": [
    { "term": 1, "data": { "key": "value" } }
  ],
  "nodeId": "node-1"
}
```

**Sync from leader:**
```json
{
  "syncFrom": {
    "fromIndex": 0,
    "entries": [
      { "index": 0, "term": 1, "data": {} }
    ]
  }
}
```

**Response:**
```json
{
  "status": "accepted",
  "replicated": 1,
  "lastIndex": 0,
  "term": 1
}
```

### POST /api/Distributed/coordinate

**Leader election:**
```json
{
  "action": "elect",
  "nodeIds": ["node-a", "node-b", "node-c"]
}
```
Response: `{ "status": "ok", "coordinated": true, "leaderId": "node-c", "term": 1 }`

**Lock acquire:**
```json
{
  "action": "lock",
  "lockId": "resource-1",
  "holder": "node-1",
  "ttlSeconds": 30
}
```
Response: `{ "status": "ok", "coordinated": true, "acquired": true, "lockId": "...", "holder": "..." }`

**Lock release:**
```json
{
  "action": "unlock",
  "lockId": "resource-1",
  "holder": "node-1"
}
```
Response: `{ "status": "ok", "coordinated": true, "released": true }`

**Status:**
```json
{ "action": "status" }
```
Response: `{ "status": "ok", "leaderId": "...", "term": 1, "logLength": 5 }`

## Local run

From repo root:

```bash
cd services/engine-distributed-service
PYTHONPATH=../../engine-distributed:. python run.py
```

Default port: 5016 (or `PORT` env).
