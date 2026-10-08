'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: 'Total Shipments', value: '1,234', icon: '📦', trend: '+12%' },
    { label: 'Pending Approvals', value: '24', icon: '⏳', trend: '+5', color: 'bg-orange-100' },
    { label: 'Revenue (Month)', value: '$48,500', icon: '💰', trend: '+18%' },
    { label: 'Active Users', value: '856', icon: '👥', trend: '+23' },
  ];

  const recentShipments = [
    { id: 1, tracking: 'OPS-2024-001234', sender: 'John Doe', recipient: 'Jane Smith', status: 'In Transit', date: '2024-10-05' },
    { id: 2, tracking: 'OPS-2024-001233', sender: 'ABC Corp', recipient: 'XYZ Inc', status: 'Delivered', date: '2024-10-04' },
    { id: 3, tracking: 'OPS-2024-001232', sender: 'Tech Startup', recipient: 'Big Store', status: 'Pending', date: '2024-10-03' },
    { id: 4, tracking: 'OPS-2024-001231', sender: 'Maria Garcia', recipient: 'Local Shop', status: 'Picked Up', date: '2024-10-02' },
    { id: 5, tracking: 'OPS-2024-001230', sender: 'Global Trader', recipient: 'Retail Chain', status: 'In Transit', date: '2024-10-01' },
  ];

  const quickActions = [
    { label: 'New Shipment', href: '/admin/shipments/new', icon: '➕' },
    { label: 'Approve Pending', href: '/admin/shipments?status=pending', icon: '✅' },
    { label: 'New Blog Post', href: '/admin/blogs/new', icon: '📝' },
    { label: 'View Analytics', href: '/admin/analytics', icon: '📊' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-orange-100 text-orange-800';
      case 'Picked Up':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Welcome Header */}
        <div>
          <h1 className='text-3xl font-bold text-text-primary mb-2'>Welcome back, Admin! 👋</h1>
          <p className='text-text-secondary'>Here's what's happening with your logistics today.</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {stats.map((stat, idx) => (
            <div key={idx} className={`${stat.color || 'bg-blue-50'} border border-border rounded-lg p-6`}>
              <div className='flex items-start justify-between'>
                <div>
                  <p className='text-sm text-text-secondary mb-1'>{stat.label}</p>
                  <p className='text-2xl font-bold text-text-primary'>{stat.value}</p>
                  <p className='text-xs text-green-600 mt-2'>{stat.trend}</p>
                </div>
                <span className='text-3xl'>{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className='bg-white border border-border rounded-lg p-6'>
          <h2 className='text-lg font-bold text-text-primary mb-4'>Quick Actions</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                href={action.href}
                className='flex flex-col items-center gap-3 p-4 bg-light-gray rounded-lg hover:bg-light-blue transition-colors text-center'
              >
                <span className='text-2xl'>{action.icon}</span>
                <span className='text-sm font-bold text-text-primary'>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Shipments */}
        <div className='bg-white border border-border rounded-lg overflow-hidden'>
          <div className='p-6 border-b border-border flex items-center justify-between'>
            <h2 className='text-lg font-bold text-text-primary'>Recent Shipments</h2>
            <Link href='/admin/shipments' className='text-primary font-bold text-sm hover:underline'>
              View All →
            </Link>
          </div>

          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-light-gray border-b border-border'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Tracking</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Sender</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Recipient</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Date</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentShipments.map((shipment) => (
                  <tr key={shipment.id} className='border-b border-border hover:bg-light-gray transition-colors'>
                    <td className='px-6 py-4 text-sm font-bold text-text-primary'>{shipment.tracking}</td>
                    <td className='px-6 py-4 text-sm text-text-secondary'>{shipment.sender}</td>
                    <td className='px-6 py-4 text-sm text-text-secondary'>{shipment.recipient}</td>
                    <td className='px-6 py-4 text-sm'>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(shipment.status)}`}>
                        {shipment.status}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-text-secondary'>{shipment.date}</td>
                    <td className='px-6 py-4 text-sm'>
                      <Link href={`/admin/shipments/${shipment.id}`} className='text-primary font-bold hover:underline'>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
