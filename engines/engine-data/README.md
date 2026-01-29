# Engine Data

TypeScript (Nx) + Python data engine modules.

## Python layout

| Subfolder   | Files                 | Description                    |
|------------|------------------------|--------------------------------|
| **models** | graph_model, relational_model, document_model | Graph, tables, documents |
| **schemas** | base_schema           | Field and document validation  |
| **storage** | vector_store, data_loader | Vectors, load from iterators   |
| **pipelines** | data_pipeline       | Linear pipeline stages         |
| **indexing** | indexing_engine     | Build and query indexes        |
| **caching** | cache_engine        | Get/set/delete with TTL        |

Run from repo root with `PYTHONPATH=engine-data`:

```bash
cd c:\NEXUS-ENGINE
set PYTHONPATH=engine-data
python -c "from models import create_graph; g = create_graph(); print(g.nodes())"
```
