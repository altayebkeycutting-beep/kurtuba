import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight, FiStar } from 'react-icons/fi';
import { serviceAPI } from '../../api';
import toast from 'react-hot-toast';

export default function AdminServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await serviceAPI.getAllAdmin();
      setServices(res.data.data);
    } catch {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete service "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await serviceAPI.delete(id);
      toast.success('Service deleted');
      fetchServices();
    } catch {
      toast.error('Failed to delete service');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggle = async (service, field) => {
    try {
      await serviceAPI.update(service._id, { [field]: !service[field] });
      setServices((prev) =>
        prev.map((s) => s._id === service._id ? { ...s, [field]: !s[field] } : s)
      );
      toast.success(`Service ${field} updated`);
    } catch {
      toast.error('Failed to update service');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark">Services</h1>
          <p className="text-gray-500 text-sm mt-0.5">{services.length} total services</p>
        </div>
        <Link to="/admin/services/new" className="btn-primary text-sm w-fit">
          <FiPlus />
          Add Service
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse h-44">
              <div className="w-12 h-12 skeleton rounded-xl mb-3" />
              <div className="h-5 skeleton rounded mb-2 w-3/4" />
              <div className="h-3 skeleton rounded mb-1" />
              <div className="h-3 skeleton rounded w-4/5" />
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl mb-4">🔧</div>
          <h3 className="text-xl font-display font-bold text-dark mb-2">No services yet</h3>
          <p className="text-gray-500 mb-4">Add your first service to get started.</p>
          <Link to="/admin/services/new" className="btn-primary w-fit mx-auto">
            <FiPlus /> Add First Service
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className={`card p-5 transition-all ${!service.isActive ? 'opacity-60' : ''}`}
            >
              {/* Icon + badges */}
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-gold-400/10 rounded-xl flex items-center
                                justify-center text-2xl flex-shrink-0">
                  {service.icon || '🔑'}
                </div>
                <div className="flex items-center gap-1.5">
                  {service.isFeatured && (
                    <span className="flex items-center gap-1 text-xs bg-gold-400/10
                                     text-gold-600 px-2 py-0.5 rounded-full font-medium">
                      <FiStar size={10} /> Featured
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    service.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {service.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>

              {/* Title + desc */}
              <h3 className="font-display font-bold text-dark mb-1">{service.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                {service.shortDescription}
              </p>

              {/* Price */}
              {service.price?.displayText && (
                <p className="text-gold-600 text-xs font-semibold mb-4">
                  {service.price.displayText}
                </p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  {/* Toggle active */}
                  <button
                    onClick={() => handleToggle(service, 'isActive')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      service.isActive
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={service.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {service.isActive ? <FiToggleRight size={18} /> : <FiToggleLeft size={18} />}
                  </button>
                  {/* Toggle featured */}
                  <button
                    onClick={() => handleToggle(service, 'isFeatured')}
                    className={`p-1.5 rounded-lg transition-colors ${
                      service.isFeatured
                        ? 'text-gold-600 hover:bg-gold-50'
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={service.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <FiStar size={15} />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <Link
                    to={`/admin/services/edit/${service._id}`}
                    className="p-1.5 text-gray-400 hover:text-gold-600 hover:bg-gold-50
                               rounded-lg transition-colors"
                    title="Edit"
                  >
                    <FiEdit2 size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(service._id, service.title)}
                    disabled={deleting === service._id}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50
                               rounded-lg transition-colors disabled:opacity-50"
                    title="Delete"
                  >
                    {deleting === service._id ? (
                      <div className="w-3.5 h-3.5 border-2 border-red-400
                                      border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiTrash2 size={15} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
