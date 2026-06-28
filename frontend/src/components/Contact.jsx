import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { contactAPI } from '../api';
import toast from 'react-hot-toast';

const services = [
  'Key Duplication',
  'Car Key Programming',
  'Remote Key Replacement',
  'Smart Key Services',
  'Lock Repair',
  'Other',
];

const contactInfo = [
  {
    icon: FiPhone,
    label: 'Phone / WhatsApp',
    value: '+971 52 343 3077',
    href: 'tel:+971523433077',
  },
  {
    icon: FiMail,
    label: 'Email',
    value: 'info@kurtubalocksmith.com',
    href: 'mailto:info@kurtubalocksmith.com',
  },
  {
    icon: FiMapPin,
    label: 'Location',
    value: 'Ajman, United Arab Emirates',
    href: 'https://maps.app.goo.gl/TyqaZNGERFDBtZb67',
  },
  {
    icon: FiClock,
    label: 'Opening Hours',
    value: 'Mon–Sat: 9am–9pm | Sun: 10am–6pm',
    href: null,
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service: '', message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await contactAPI.submit(form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', phone: '', service: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please call us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding bg-light">
      <div className="section-container">
        {/* Heading */}
        <div className="text-center mb-14">
          <span className="section-badge">Get in Touch</span>
          <h2 className="section-title">
            Contact Us or{' '}
            <span className="gradient-text">Visit Our Shop</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Have a question or need a quote? Send us a message or visit our shop in Ajman.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* ── Contact Form ────────────────────────────────── */}
          <div className="card p-8">
            <h3 className="text-xl font-display font-bold text-dark mb-6">
              Send a Message
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+971 52 343 3077"
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label className="form-label">Service Needed</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select a service...</option>
                  {services.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Describe what you need. E.g. car make, model, year for car keys..."
                  rows={4}
                  className="form-input resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-70
                           disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-dark border-t-transparent
                                    rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Info + Map ──────────────────────────────────── */}
          <div className="space-y-6">
            {/* Contact details */}
            <div className="card p-6">
              <h3 className="text-xl font-display font-bold text-dark mb-5">
                Contact Details
              </h3>
              <div className="space-y-4">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gold-400/10 rounded-lg flex items-center
                                    justify-center flex-shrink-0">
                      <Icon className="text-gold-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs mb-0.5">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith('http') ? '_blank' : '_self'}
                          rel="noopener noreferrer"
                          className="text-dark font-medium text-sm hover:text-gold-600
                                     transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-dark font-medium text-sm">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Map embed */}
            <div className="card overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3604.5!2d55.3945!3d25.3886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDIzJzE5LjAiTiA1NcKwMjMnNDAuMiJF!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
                width="100%"
                height="220"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kurtuba Locksmith Location"
              />
              <div className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-dark font-semibold text-sm">Kurtuba Locksmith</p>
                  <p className="text-gray-400 text-xs">Ajman, United Arab Emirates</p>
                </div>
                <a
                  href="https://maps.app.goo.gl/TyqaZNGERFDBtZb67"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold-600 font-semibold hover:underline"
                >
                  Open in Maps →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
