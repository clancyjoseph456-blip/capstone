import React, { useEffect, useState } from 'react';
import { getAnalytics, getUsers, toggleUser } from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts';

const COLORS = ['#1a3a5c', '#2557a7', '#c8a951', '#2e7d5e', '#b53a3a', '#6b21a8', '#0891b2', '#d97706'];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    Promise.all([getAnalytics(), getUsers()])
      .then(([analyticsRes, usersRes]) => {
        setData(analyticsRes.data.data);
        setUsers(usersRes.data.users);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleToggleUser = async (id) => {
    await toggleUser(id);
    const res = await getUsers();
    setUsers(res.data.users);
  };

  if (loading) return <div className="loading">Loading dashboard…</div>;

  const { totals, by_faculty, by_category, monthly_submissions, trending_technologies, top_innovators } = data;

  const approvalRate = totals.total_projects > 0
    ? Math.round((totals.approved / totals.total_projects) * 100)
    : 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-subtitle">Platform analytics and user management</p>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {['overview', 'analytics', 'users'].map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <>
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            {[
              { icon: '📁', label: 'Total Projects', value: totals.total_projects, color: '#dbeafe' },
              { icon: '✅', label: 'Approved', value: totals.approved, color: '#d1fae5' },
              { icon: '⏳', label: 'Pending Review', value: totals.pending, color: '#fef3c7' },
              { icon: '👨‍🎓', label: 'Students', value: totals.total_students, color: '#f3e8ff' },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: s.color }}>
                  <span>{s.icon}</span>
                </div>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid-2">
            {/* Approval Rate */}
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '1rem' }}>
                  Approval Rate
                </h3>
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{ fontSize: '3.5rem', fontFamily: 'var(--font-display)', color: 'var(--primary)', fontWeight: 700 }}>
                    {approvalRate}%
                  </div>
                  <div style={{ height: '12px', background: 'var(--surface-alt)', borderRadius: '6px', margin: '1rem 0' }}>
                    <div style={{ height: '100%', width: `${approvalRate}%`, background: 'var(--success)', borderRadius: '6px', transition: 'width 1s' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>✅ {totals.approved} approved</span>
                    <span>❌ {totals.rejected} rejected</span>
                  </div>
                </div>

                {/* Top Innovators */}
                <h4 style={{ fontWeight: 600, color: 'var(--primary)', margin: '1.5rem 0 0.75rem' }}>Top Innovators</h4>
                {top_innovators.map((u, i) => (
                  <div key={i} className="flex items-center justify-between"
                    style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.875rem' }}>
                      <strong style={{ color: 'var(--accent)' }}>#{i + 1}</strong> {u.full_name}
                    </span>
                    <span className="badge badge-info">{u.project_count} projects</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects by Category */}
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '1rem' }}>
                  Projects by Category
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={by_category} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={90} label={({ category, percent }) => `${category?.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}>
                      {by_category.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── ANALYTICS ── */}
      {tab === 'analytics' && (
        <>
          {/* Monthly Submissions */}
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-body">
              <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '1rem' }}>
                Monthly Submissions (Last 6 Months)
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthly_submissions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="var(--primary)" strokeWidth={2} dot={{ fill: 'var(--accent)', r: 4 }} name="Submissions" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid-2">
            {/* Projects by Faculty */}
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '1rem' }}>
                  Projects by Faculty
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={by_faculty} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="faculty" type="category" tick={{ fontSize: 10 }} width={110} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--primary)" radius={[0, 4, 4, 0]} name="Projects" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trending Technologies */}
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '1rem' }}>
                  Trending Technologies
                </h3>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={trending_technologies}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Usage">
                      {trending_technologies.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── USERS ── */}
      {tab === 'users' && (
        <div className="card">
          <div className="card-body">
            <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--primary)', marginBottom: '1rem' }}>
              User Management ({users.length} users)
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface-alt)', borderBottom: '2px solid var(--border)' }}>
                    {['Name', 'Email', 'Role', 'Faculty', 'Joined', 'Status', 'Action'].map((h) => (
                      <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: 'var(--primary)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 500 }}>{u.full_name}</td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${u.role === 'admin' ? 'badge-danger' : u.role === 'supervisor' ? 'badge-info' : 'badge-success'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        {u.faculty?.replace('Faculty of ', '') || '—'}
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)' }}>
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        {u.role !== 'admin' && (
                          <button
                            className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleToggleUser(u.id)}
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
