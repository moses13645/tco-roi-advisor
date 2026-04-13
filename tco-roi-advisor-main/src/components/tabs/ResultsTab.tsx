import { useSimulation } from '@/contexts/SimulationContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, AlertTriangle, AlertCircle, TrendingUp, TrendingDown, Target, CalendarCheck } from 'lucide-react';
import { formatCurrency, formatCurrencyShort, formatPercent } from '@/lib/formatters';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const CHART_COLORS = { op: 'hsl(215, 65%, 35%)', saas: 'hsl(168, 50%, 40%)', capex: 'hsl(215, 65%, 45%)', opex: 'hsl(38, 92%, 55%)' };

export function ResultsTab() {
  const { state, setActiveTab } = useSimulation();
  const r = state.results;

  if (!r) return (
    <div className="text-center py-20 space-y-4">
      <p className="text-muted-foreground">Aucun résultat disponible.</p>
      <Button onClick={() => setActiveTab(2)}>Retourner à la saisie SaaS</Button>
    </div>
  );

  const recBg = r.recommandation === 'Migration SaaS recommandée'
    ? 'bg-[hsl(var(--success)/0.1)] border-[hsl(var(--success))]'
    : r.recommandation === 'Migration à instruire'
    ? 'bg-[hsl(var(--warning)/0.1)] border-[hsl(var(--warning))]'
    : 'bg-muted border-muted-foreground';

  const annualData = r.projections.map(p => ({
    name: `Année ${p.year}`,
    'On Premise': Math.round(p.onPremiseBudget),
    'SaaS': Math.round(p.saasBudget),
  }));

  const cumulData = r.projections.map(p => ({
    name: `Année ${p.year}`,
    'On Premise': Math.round(p.onPremiseCumulBudget),
    'SaaS': Math.round(p.saasCumulBudget),
  }));

  const pieData = [
    { name: 'CAPEX', value: r.repartitionCapexOpex.capex },
    { name: 'OPEX', value: r.repartitionCapexOpex.opex },
  ];

  const fmtTooltip = (v: number) => formatCurrencyShort(v);

  return (
    <div className="space-y-6">
      {/* Recommandation Banner */}
      <div className={`rounded-lg border-2 p-5 ${recBg}`}>
        <h2 className="text-lg font-bold mb-2">{r.recommandation}</h2>
        <ul className="space-y-1">
          {r.raisonsRecommandation.map((reason, i) => (
            <li key={i} className="text-sm flex items-start gap-2">
              <span className="mt-0.5">•</span> {reason}
            </li>
          ))}
        </ul>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'TCO On Premise', value: formatCurrencyShort(r.tcoOnPremiseCumule), sub: `${state.hypotheses.dureeAnalyse} ans`, icon: TrendingUp },
          { label: 'TCO SaaS', value: formatCurrencyShort(r.tcoSaasCumule), sub: `${state.hypotheses.dureeAnalyse} ans`, icon: TrendingDown },
          { label: 'Écart TCO', value: formatCurrencyShort(r.ecartTco), sub: r.ecartTco > 0 ? 'Avantage SaaS' : 'Avantage On Premise' },
          { label: 'ROI', value: `${Math.round(r.roiPourcent)} %`, sub: 'retour sur investissement' },
          { label: 'Point d\'équilibre', value: r.pointEquilibre ? `Année ${r.pointEquilibre}` : '—', sub: 'cumul SaaS ≤ On Premise', icon: Target },
          { label: 'Retour invest.', value: r.retourInvestissementAnnees ? `${r.retourInvestissementAnnees} an${r.retourInvestissementAnnees > 1 ? 's' : ''}` : '—', sub: 'gains nets ≥ coûts transition', icon: CalendarCheck },
        ].map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="kpi-card text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-lg font-bold text-primary">{value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold mb-4">Comparaison annuelle des coûts (vue budgétaire)</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={annualData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => formatCurrencyShort(v)} />
              <RTooltip formatter={fmtTooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="On Premise" fill={CHART_COLORS.op} radius={[3,3,0,0]} />
              <Bar dataKey="SaaS" fill={CHART_COLORS.saas} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold mb-4">TCO cumulé comparé</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={cumulData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => formatCurrencyShort(v)} />
              <RTooltip formatter={fmtTooltip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="On Premise" stroke={CHART_COLORS.op} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="SaaS" stroke={CHART_COLORS.saas} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="section-card p-5">
          <h3 className="text-sm font-semibold mb-4">Répartition CAPEX / OPEX (On Premise)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                <Cell fill={CHART_COLORS.capex} />
                <Cell fill={CHART_COLORS.opex} />
              </Pie>
              <RTooltip formatter={fmtTooltip} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Cyber & Risk */}
        <div className="section-card p-5 space-y-3">
          <h3 className="text-sm font-semibold">Maturité cybersécurité</h3>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
            r.cyberMaturite === 'Robuste' ? 'badge-success' :
            r.cyberMaturite === 'À renforcer' ? 'badge-warning' :
            r.cyberMaturite === 'Insuffisant' ? 'bg-orange-500 text-primary-foreground' : 'badge-critical'
          }`}>{r.cyberMaturite}</div>
          {r.expositionCyber > 0 && (
            <div className="text-sm space-y-1">
              <p>Exposition financière potentielle : <strong>{formatCurrencyShort(r.expositionCyber)}</strong></p>
              <p className="text-xs text-muted-foreground italic">Hypothèse : impact estimé en cas de cyberattaque, réparti sur {state.hypotheses.dureeAnalyse} ans pour le TCO ajusté au risque.</p>
              <p className="text-sm mt-2">TCO ajusté au risque : <strong>{formatCurrencyShort(r.tcoOnPremiseAjusteRisque)}</strong></p>
            </div>
          )}
          {r.expositionCyber === 0 && <p className="text-sm text-success">Exposition maîtrisée. La posture de sécurité est robuste.</p>}
        </div>

        {/* Complétude */}
        <div className="section-card p-5 space-y-3">
          <h3 className="text-sm font-semibold">Fiabilité de la simulation</h3>
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
                <circle cx="18" cy="18" r="15.5" fill="none" stroke="hsl(220,15%,90%)" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.5" fill="none" stroke={r.indiceCompletude >= 75 ? 'hsl(158,55%,36%)' : r.indiceCompletude >= 50 ? 'hsl(38,92%,50%)' : 'hsl(0,72%,51%)'} strokeWidth="3" strokeDasharray={`${r.indiceCompletude} ${100 - r.indiceCompletude}`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{r.indiceCompletude}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {r.indiceCompletude >= 75 ? 'Simulation fiable — la majorité des postes sont renseignés.' :
               r.indiceCompletude >= 50 ? 'Simulation partielle — certains postes manquent pour une analyse complète.' :
               'Simulation incomplète — de nombreux postes de coûts ne sont pas renseignés.'}
            </p>
          </div>
          {r.postsNonRenseignes.length > 0 && (
            <div className="text-xs space-y-1 mt-2">
              <p className="font-medium text-muted-foreground">Postes non renseignés :</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-0.5">
                {r.postsNonRenseignes.map(p => <li key={p}>{p}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Diagnostic */}
      {r.diagnosticAlerts.length > 0 && (
        <div className="section-card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-destructive uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Diagnostic
          </h3>
          <div className="space-y-3">
            {r.diagnosticAlerts.map((alert, i) => (
              <div key={i} className={alert.type === 'critical' ? 'alert-critical' : 'alert-warning'}>
                <div className="flex items-start gap-2">
                  {alert.type === 'critical' ? <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" /> : <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />}
                  <div>
                    <p className="text-sm font-semibold">{alert.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risque indisponibilité */}
      {r.risqueIndisponibilite !== 'Faible' && (
        <div className={`section-card p-5 ${r.risqueIndisponibilite === 'Élevé' ? 'alert-critical' : 'alert-warning'}`}>
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Risque d'indisponibilité de service : {r.risqueIndisponibilite}
          </h4>
          <p className="text-xs text-muted-foreground mt-1">
            Plusieurs signaux indiquent un risque accru d'indisponibilité sur le modèle on premise actuel. 
            Ce risque n'est pas monétisé dans le TCO mais doit être pris en compte dans la décision.
          </p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab(2)} className="gap-2">
          <ChevronLeft className="h-4 w-4" /> Précédent
        </Button>
        <Button onClick={() => setActiveTab(4)} className="gap-2">
          Note de décision <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
