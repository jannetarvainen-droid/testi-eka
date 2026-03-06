const fields = [
  ['Nimi', 'name'],
  ['Asiakas', 'customer'],
  ['Urakanumero', 'contractNumber'],
  ['Osoite', 'address'],
  ['Vastuuhenkilö', 'owner'],
  ['Aloitus', 'startDate'],
  ['Arvioitu valmistuminen', 'estimatedCompletionDate'],
  ['Status', 'status']
];

export default function SiteInfoCard({ siteInfo, onChange, onSave }) {
  return (
    <section className="card site-info" id="dashboard">
      <div className="card-header">
        <h2>Työmaan perustiedot</h2>
        <button onClick={onSave}>Tallenna perustiedot</button>
      </div>

      <div className="form-grid">
        {fields.map(([label, key]) => (
          <label key={key}>
            {label}
            <input
              value={siteInfo[key] ?? ''}
              onChange={(event) => onChange(key, event.target.value)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
