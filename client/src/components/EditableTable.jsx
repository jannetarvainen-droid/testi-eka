import { useMemo, useState } from 'react';

export default function EditableTable({
  title,
  collection,
  rows,
  columns,
  onCreate,
  onUpdate,
  onDelete,
  enableSearch = false
}) {
  const [query, setQuery] = useState('');

  const filteredRows = useMemo(() => {
    if (!enableSearch || !query.trim()) return rows;

    const lowered = query.toLowerCase();
    return rows.filter((row) =>
      columns.some((column) => String(row[column.key] ?? '').toLowerCase().includes(lowered))
    );
  }, [columns, enableSearch, query, rows]);

  const createEmpty = () => {
    const payload = columns.reduce((acc, column) => {
      acc[column.key] = column.defaultValue ?? '';
      return acc;
    }, {});
    onCreate(collection, payload);
  };

  return (
    <section className="card table-card" id={collection}>
      <div className="card-header">
        <h2>{title}</h2>
        <div className="toolbar">
          {enableSearch && (
            <input
              placeholder="Hae..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          )}
          <button onClick={createEmpty}>Lisää rivi</button>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
              <th>Toiminnot</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key}>
                    {column.type === 'select' ? (
                      <select
                        value={row[column.key] ?? ''}
                        onChange={(event) =>
                          onUpdate(collection, row.id, {
                            [column.key]:
                              column.valueType === 'boolean'
                                ? event.target.value === 'true'
                                : event.target.value
                          })
                        }
                      >
                        {column.options.map((option) => (
                          <option key={String(option.value)} value={String(option.value)}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={column.type || 'text'}
                        value={row[column.key] ?? ''}
                        onChange={(event) =>
                          onUpdate(collection, row.id, {
                            [column.key]:
                              column.valueType === 'number'
                                ? Number(event.target.value)
                                : event.target.value
                          })
                        }
                      />
                    )}
                  </td>
                ))}
                <td>
                  <button className="ghost" onClick={() => onDelete(collection, row.id)}>
                    Poista
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
