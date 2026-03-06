import { useEffect, useMemo, useState } from 'react';
import EditableTable from './components/EditableTable';
import Sidebar from './components/Sidebar';
import SiteInfoCard from './components/SiteInfoCard';
import SummaryCards from './components/SummaryCards';
import { api } from './services/api';

const taskColumns = [
  { key: 'title', label: 'Tehtävä', defaultValue: '' },
  { key: 'description', label: 'Kuvaus', defaultValue: '' },
  { key: 'owner', label: 'Vastuuhenkilö', defaultValue: '' },
  { key: 'dueDate', label: 'Määräpäivä', type: 'date', defaultValue: '' },
  {
    key: 'priority',
    label: 'Prioriteetti',
    type: 'select',
    defaultValue: 'normaali',
    options: [
      { label: 'matala', value: 'matala' },
      { label: 'normaali', value: 'normaali' },
      { label: 'korkea', value: 'korkea' }
    ]
  },
  {
    key: 'status',
    label: 'Tila',
    type: 'select',
    defaultValue: 'avoin',
    options: [
      { label: 'avoin', value: 'avoin' },
      { label: 'työn alla', value: 'työn alla' },
      { label: 'valmis', value: 'valmis' }
    ]
  }
];

const procurementColumns = [
  { key: 'item', label: 'Tuote / hankinta', defaultValue: '' },
  { key: 'supplier', label: 'Toimittaja', defaultValue: '' },
  {
    key: 'ordered',
    label: 'Tilattu',
    type: 'select',
    valueType: 'boolean',
    defaultValue: false,
    options: [
      { label: 'ei', value: false },
      { label: 'kyllä', value: true }
    ]
  },
  { key: 'deliveryDate', label: 'Toimituspäivä', type: 'date', defaultValue: '' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'odottaa',
    options: [
      { label: 'odottaa', value: 'odottaa' },
      { label: 'tilattu', value: 'tilattu' },
      { label: 'toimitettu', value: 'toimitettu' }
    ]
  },
  {
    key: 'critical',
    label: 'Kriittinen',
    type: 'select',
    valueType: 'boolean',
    defaultValue: false,
    options: [
      { label: 'ei', value: false },
      { label: 'kyllä', value: true }
    ]
  },
  { key: 'note', label: 'Huomautus', defaultValue: '' }
];

const changeColumns = [
  { key: 'title', label: 'Otsikko', defaultValue: '' },
  { key: 'description', label: 'Kuvaus', defaultValue: '' },
  {
    key: 'estimatedValue',
    label: 'Arvo (€)',
    type: 'number',
    valueType: 'number',
    defaultValue: 0
  },
  {
    key: 'approvalStatus',
    label: 'Hyväksyntästatus',
    type: 'select',
    defaultValue: 'odottaa',
    options: [
      { label: 'odottaa', value: 'odottaa' },
      { label: 'hyväksytty', value: 'hyväksytty' },
      { label: 'hylätty', value: 'hylätty' }
    ]
  },
  { key: 'date', label: 'Päiväys', type: 'date', defaultValue: '' }
];

const riskColumns = [
  { key: 'risk', label: 'Riski / puute', defaultValue: '' },
  { key: 'impact', label: 'Vaikutus', defaultValue: '' },
  { key: 'action', label: 'Toimenpide', defaultValue: '' },
  { key: 'owner', label: 'Omistaja', defaultValue: '' },
  { key: 'status', label: 'Tila', defaultValue: 'avoin' }
];

export default function App() {
  const [data, setData] = useState(null);

  async function loadData() {
    const next = await api.getData();
    setData(next);
  }

  useEffect(() => {
    loadData();
  }, []);

  const summary = useMemo(() => {
    if (!data) return null;
    const now = new Date();
    const openTasks = data.tasks.filter((t) => t.status !== 'valmis');
    const overdueTasks = openTasks.filter((t) => t.dueDate && new Date(t.dueDate) < now);
    const openProcurements = data.procurements.filter((p) => p.status !== 'toimitettu');
    const pendingChanges = data.changeWorks.filter((c) => c.approvalStatus === 'odottaa');
    const openRisks = data.risks.filter((r) => r.status !== 'suljettu').length;

    return {
      openTasks: openTasks.length,
      overdueTasks: overdueTasks.length,
      openProcurements: openProcurements.length,
      pendingChanges: pendingChanges.length,
      openRisks,
      siteStatus: data.siteInfo.status
    };
  }, [data]);

  const trafficLight = useMemo(() => {
    if (!data) return 'keltainen';

    const now = new Date();
    const hasOverdueHighPriorityTask = data.tasks.some(
      (task) =>
        task.priority === 'korkea' && task.status !== 'valmis' && task.dueDate && new Date(task.dueDate) < now
    );

    const hasMissingCriticalProcurement = data.procurements.some(
      (proc) => proc.critical && proc.status !== 'toimitettu'
    );

    if (hasOverdueHighPriorityTask || hasMissingCriticalProcurement) {
      return 'punainen';
    }

    const hasOpenItems =
      data.tasks.some((task) => task.status !== 'valmis') ||
      data.risks.some((risk) => risk.status === 'avoin' || risk.status === 'seurannassa');

    return hasOpenItems ? 'keltainen' : 'vihreä';
  }, [data]);

  async function handleCreate(collection, payload) {
    await api.createItem(collection, payload);
    await loadData();
  }

  async function handleUpdate(collection, id, patch) {
    await api.updateItem(collection, id, patch);
    await loadData();
  }

  async function handleDelete(collection, id) {
    await api.deleteItem(collection, id);
    await loadData();
  }

  async function handleSiteInfoChange(key, value) {
    setData((prev) => ({ ...prev, siteInfo: { ...prev.siteInfo, [key]: value } }));
  }

  async function saveSiteInfo() {
    await api.updateSiteInfo(data.siteInfo);
    await loadData();
  }

  if (!data || !summary) return <div className="loading">Ladataan...</div>;

  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <SiteInfoCard siteInfo={data.siteInfo} onChange={handleSiteInfoChange} onSave={saveSiteInfo} />
        <SummaryCards summary={summary} trafficLight={trafficLight} />
        <EditableTable
          title="Avoimet tehtävät"
          collection="tasks"
          rows={data.tasks}
          columns={taskColumns}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          enableSearch
        />
        <EditableTable
          title="Hankinnat"
          collection="procurements"
          rows={data.procurements}
          columns={procurementColumns}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <EditableTable
          title="Lisä- ja muutostyöt"
          collection="changeWorks"
          rows={data.changeWorks}
          columns={changeColumns}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
        <EditableTable
          title="Riskit ja puutteet"
          collection="risks"
          rows={data.risks}
          columns={riskColumns}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}
