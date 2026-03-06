function statusColor(trafficLight) {
  if (trafficLight === 'punainen') return 'danger';
  if (trafficLight === 'keltainen') return 'warning';
  return 'ok';
}

export default function SummaryCards({ summary, trafficLight }) {
  const cards = [
    ['Avoimet tehtävät', summary.openTasks],
    ['Myöhässä tehtävät', summary.overdueTasks],
    ['Avoimet hankinnat', summary.openProcurements],
    ['Odottaa hyväksyntää', summary.pendingChanges],
    ['Avoimet riskit', summary.openRisks],
    ['Työmaan status', summary.siteStatus]
  ];

  return (
    <section className="summary-grid">
      {cards.map(([title, value]) => (
        <article className="card" key={title}>
          <h3>{title}</h3>
          <p>{value}</p>
        </article>
      ))}
      <article className={`card traffic ${statusColor(trafficLight)}`}>
        <h3>Liikennevalo</h3>
        <p>{trafficLight.toUpperCase()}</p>
      </article>
    </section>
  );
}
