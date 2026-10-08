'use client';

import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Link from 'next/link';

export default function ShipmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const shipments = [
    { id: 1, tracking: 'OPS-2024-001234', sender: 'John Doe', recipient: 'Jane Smith', value: '$250', status: 'registered', date: '2024-10-05' },
    { id: 2, tracking: 'OPS-2024-001233', sender: 'ABC Corp', recipient: 'XYZ Inc', value: '$1,500', status: 'confirmed', date: '2024-10-04' },
    { id: 3, tracking: 'OPS-2024-001232', sender: 'Tech Startup', recipient: 'Big Store', value: '$3,200', status: 'registered', date: '2024-10-03' },
    { id: 4, tracking: 'OPS-2024-001231', sender: 'Maria Garcia', recipient: 'Local Shop', value: '$450', status: 'picked_up', date: '2024-10-02' },
    { id: 5, tracking: 'OPS-2024-001230', sender: 'Global Trader', recipient: 'Retail Chain', value: '$2,100', status: 'in_transit', date: '2024-10-01' },
    { id: 6, tracking: 'OPS-2024-001229', sender: 'Electronics Co', recipient: 'Tech Store', value: '$5,600', status: 'delivered', date: '2024-09-30' },
  ];

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      registered: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      picked_up: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-cyan-100 text-cyan-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
  };

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-text-primary'>Shipments</h1>
            <p className='text-text-secondary'>Manage and track all shipments</p>
          </div>
          <Link
            href='/admin/shipments/new'
            className='bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-primary-dark transition-colors'
          >
            + New Shipment
          </Link>
        </div>

        {/* Filters & Search */}
        <div className='bg-white border border-border rounded-lg p-6'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Search */}
            <div>
              <label className='block text-sm font-bold text-text-primary mb-2'>Search</label>
              <input
                type='text'
                placeholder='Tracking #, Sender, Recipient...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary'
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className='block text-sm font-bold text-text-primary mb-2'>Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className='w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary'
              >
                <option value='all'>All Statuses</option>
                <option value='registered'>Registered</option>
                <option value='confirmed'>Confirmed</option>
                <option value='picked_up'>Picked Up</option>
                <option value='in_transit'>In Transit</option>
                <option value='delivered'>Delivered</option>
              </select>
            </div>

            {/* Bulk Actions */}
            <div className='flex items-end'>
              <button className='w-full bg-light-gray text-text-primary font-bold px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors'>
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Shipments Table */}
        <div className='bg-white border border-border rounded-lg overflow-hidden'>
          {/* Table Header with Count */}
          <div className='px-6 py-4 bg-light-gray border-b border-border'>
            <p className='text-sm text-text-secondary font-bold'>
              Showing {filteredShipments.length} shipments
            </p>
          </div>

          {/* Table */}
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-light-gray border-b border-border'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>
                    <input type='checkbox' className='w-4 h-4' />
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Tracking #</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Sender</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Recipient</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Value</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Status</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Date</th>
                  <th className='px-6 py-3 text-left text-xs font-bold text-text-secondary'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className='border-b border-border hover:bg-light-gray transition-colors'>
                    <td className='px-6 py-4'>
                      <input type='checkbox' className='w-4 h-4' />
                    </td>
                    <td className='px-6 py-4 text-sm font-bold text-text-primary'>{shipment.tracking}</td>
                    <td className='px-6 py-4 text-sm text-text-secondary'>{shipment.sender}</td>
                    <td className='px-6 py-4 text-sm text-text-secondary'>{shipment.recipient}</td>
                    <td className='px-6 py-4 text-sm font-bold text-text-primary'>{shipment.value}</td>
                    <td className='px-6 py-4 text-sm'>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(shipment.status)}`}>
                        {getStatusLabel(shipment.status)}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-text-secondary'>{shipment.date}</td>
                    <td className='px-6 py-4 text-sm space-x-2'>
                      <Link
                        href={`/admin/shipments/${shipment.id}`}
                        className='text-primary font-bold hover:underline'
                      >
                        View
                      </Link>
                      {shipment.status === 'registered' && (
                        <button className='text-green-600 font-bold hover:underline'>Approve</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='px-6 py-4 border-t border-border flex items-center justify-between'>
            <p className='text-sm text-text-secondary'>Page {currentPage} of 5</p>
            <div className='flex gap-2'>
              <button className='px-4 py-2 border border-border rounded-lg hover:bg-light-gray transition-colors disabled:opacity-50' disabled={currentPage === 1}>
                ← Previous
              </button>
              <button className='px-4 py-2 border border-border rounded-lg hover:bg-light-gray transition-colors'>
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
