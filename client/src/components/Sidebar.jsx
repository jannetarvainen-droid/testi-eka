export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>Työmaaseuranta</h1>
      <nav>
        <a href="#dashboard">Dashboard</a>
        <a href="#tasks">Tehtävät</a>
        <a href="#procurements">Hankinnat</a>
        <a href="#changes">Lisätyöt</a>
        <a href="#risks">Riskit</a>
      </nav>
    </aside>
  );
}
