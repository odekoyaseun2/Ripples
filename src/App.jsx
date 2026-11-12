import { useMemo, useState } from 'react';

const menuItems = [
  { id: 1, name: 'Signature Jollof', category: 'Main', price: 6800, prep: '25 min', badge: 'Popular' },
  { id: 2, name: 'Crispy Chicken Bowl', category: 'Main', price: 7200, prep: '20 min', badge: 'Chef Pick' },
  { id: 3, name: 'Fresh Veggie Salad', category: 'Healthy', price: 4300, prep: '10 min', badge: 'Light' },
  { id: 4, name: 'Plantain & Pepper Sauce', category: 'Side', price: 3100, prep: '12 min', badge: 'Classic' },
  { id: 5, name: 'Beef Suya Platter', category: 'Special', price: 9800, prep: '30 min', badge: 'Top Seller' },
  { id: 6, name: 'Fruit Smoothie Combo', category: 'Drinks', price: 2500, prep: '8 min', badge: 'Fresh' },
];

const eventPackages = [
  { title: 'Executive Event Setup', price: '₦160,000', details: 'Venue styling, lighting, decor, guest seating' },
  { title: 'Corporate Catering', price: '₦240,000', details: 'Buffet service, staff deployment, branding' },
  { title: 'Wedding Celebration', price: '₦390,000', details: 'Full culinary team, dessert bar, guest logistics' },
];

const academyPrograms = [
  { title: 'Culinary Fundamentals', level: 'Beginner', duration: '4 weeks', mentor: 'Chef Ada' },
  { title: 'Event Planning Mastery', level: 'Intermediate', duration: '6 weeks', mentor: 'Nia Craft' },
  { title: 'Hospitality Operations', level: 'Advanced', duration: '8 weeks', mentor: 'Musa D' },
];

const progressSteps = [
  'Order placed and confirmed',
  'Kitchen prep & quality check',
  'Courier assigned / delivery verification',
  'Reached destination & receipt confirmation',
];

const adminCards = [
  { label: 'Orders Today', value: '248', change: '+18.2%' },
  { label: 'Event Bookings', value: '31', change: '+12.6%' },
  { label: 'Active Students', value: '128', change: '+9.4%' },
  { label: 'Revenue', value: '₦4.8M', change: '+26.1%' },
];

const starterMessages = [
  { from: 'bot', text: 'Welcome to Ripples! I can help with menu options, academy schedules, tracking, or catering support.' },
  { from: 'user', text: 'I want to order a meal and book a wedding package.' },
  { from: 'bot', text: 'Perfect — choose your preferred menu items and I can suggest an event package for your guest count.' },
];

function App() {
  const [cart, setCart] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('transfer');
  const [chatMessages, setChatMessages] = useState(starterMessages);
  const [chatInput, setChatInput] = useState('');
  const [user, setUser] = useState({
    email: 'hello@ripples.ng',
    password: '********',
    nin: '12345678901',
  });

  const addToCart = (item) => {
    setCart((current) => {
      const existing = current.find((entry) => entry.id === item.id);
      if (existing) {
        return current.map((entry) =>
          entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry
        );
      }
      return [...current, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((entry) => entry.id !== id));
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const serviceFee = Math.round(subtotal * 0.07);
  const deliveryFee = subtotal > 0 ? 1200 : 0;
  const total = subtotal + serviceFee + deliveryFee;

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    const message = chatInput.trim();
    const lowered = message.toLowerCase();

    setChatMessages((current) => [
      ...current,
      { from: 'user', text: message },
      {
        from: 'bot',
        text: lowered.includes('event')
          ? 'I can help you plan a tailored event package. Share guest size, date, and whether you need catering, décor, or venue coordination.'
          : lowered.includes('order') || lowered.includes('food')
            ? 'Your food order is ready for checkout. Add items to cart and confirm your delivery or pickup method.'
            : lowered.includes('student') || lowered.includes('academy')
              ? 'Our academy offers culinary, event planning, and hospitality programs. I can help you enroll or check the best beginner path.'
              : 'I can assist with food orders, academy enrollment, delivery tracking, or event planning. Tell me what you need today.',
      },
    ]);
    setChatInput('');
  };

  const paymentLabel = selectedPayment === 'cash' ? 'Cash on Delivery' : 'Bank Transfer';

  return (
    <div className="page-shell">
      <header className="topbar container">
        <div className="brand-wrap" aria-label="Ripples brand">
          <div className="brand-mark">R</div>
          <div>
            <div className="brand-word">Ripples</div>
            <div className="brand-tag">Catering &amp; Events</div>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#restaurant">Restaurant</a>
          <a href="#academy">Academy</a>
          <a href="#tracking">Tracking</a>
          <a href="#admin">Admin</a>
        </nav>

        <button className="primary-btn small" type="button">Login / Sign Up</button>
      </header>

      <main id="home">
        <section className="hero container">
          <div className="hero-copy">
            <p className="eyebrow">One ecosystem. Endless experiences.</p>
            <h1 className="hero-title">Ripples</h1>
            <h2 className="hero-subtitle">Catering &amp; Events</h2>
            <p className="hero-text">
              Built for memorable meals, vibrant events, student development, seamless delivery,
              secure payments, and real-time tracking across one beautifully connected platform.
            </p>

            <div className="hero-actions">
              <button className="primary-btn" type="button">Book a Service</button>
              <button className="ghost-btn" type="button">Explore Menu</button>
            </div>

            <div className="hero-stats">
              <div>
                <strong>2.4k+</strong>
                <span>Orders delivered</span>
              </div>
              <div>
                <strong>180+</strong>
                <span>Events hosted</span>
              </div>
              <div>
                <strong>96%</strong>
                <span>Customer satisfaction</span>
              </div>
            </div>
          </div>

          <div className="hero-panel">
            <div className="glass-card service-card">
              <div className="card-topline">
                <span className="pulse-dot" aria-hidden="true" />
                Live service dashboard
              </div>

              <div className="mini-metrics">
                <div>
                  <span>Deliveries</span>
                  <strong>42</strong>
                </div>
                <div>
                  <span>Events</span>
                  <strong>09</strong>
                </div>
              </div>

              <div className="timeline" aria-label="service progress timeline">
                {progressSteps.map((step, index) => (
                  <div key={step} className={`timeline-item ${index === 0 ? 'active' : ''}`}>
                    <span>{index + 1}</span>
                    <p>{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section container" id="restaurant">
          <div className="section-heading">
            <p className="eyebrow">Menu &amp; Delivery</p>
            <h3>Restaurant and delivery system</h3>
          </div>

          <div className="restaurant-layout">
            <div className="menu-grid">
              {menuItems.map((item) => (
                <article key={item.id} className="menu-card">
                  <div className="menu-badge">{item.badge}</div>
                  <h4>{item.name}</h4>
                  <div className="meta-row">
                    <span>{item.category}</span>
                    <span>{item.prep}</span>
                  </div>
                  <div className="menu-footer">
                    <strong>₦{item.price.toLocaleString()}</strong>
                    <button type="button" onClick={() => addToCart(item)}>Add to cart</button>
                  </div>
                </article>
              ))}
            </div>

            <aside className="cart-panel">
              <div className="cart-header">
                <h4>Your cart</h4>
                <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} items</span>
              </div>

              {cart.length === 0 ? (
                <div className="empty-state">Your cart is empty. Add a few delicious dishes to get started.</div>
              ) : (
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div>
                        <strong>{item.name}</strong>
                        <small>
                          {item.quantity} x ₦{item.price.toLocaleString()}
                        </small>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.id)}>Remove</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="totals">
                <div><span>Subtotal</span><strong>₦{subtotal.toLocaleString()}</strong></div>
                <div><span>Service fee</span><strong>₦{serviceFee.toLocaleString()}</strong></div>
                <div><span>Delivery</span><strong>₦{deliveryFee.toLocaleString()}</strong></div>
                <div className="grand-total"><span>Total</span><strong>₦{total.toLocaleString()}</strong></div>
              </div>

              <button className="primary-btn full-width" type="button">Proceed to checkout</button>
            </aside>
          </div>
        </section>

        <section className="section alt-bg">
          <div className="container">
            <div className="section-heading left">
              <p className="eyebrow">Events &amp; Catering</p>
              <h3>Tailored experiences for every celebration</h3>
            </div>

            <div className="event-grid">
              {eventPackages.map((event) => (
                <div key={event.title} className="event-card">
                  <div className="event-icon" aria-hidden="true">✦</div>
                  <h4>{event.title}</h4>
                  <p>{event.details}</p>
                  <strong>{event.price}</strong>
                  <button className="ghost-btn full-width" type="button">Customize package</button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section container" id="academy">
          <div className="section-heading">
            <p className="eyebrow">Academy &amp; Student Portal</p>
            <h3>Learn hospitality, event management, and business skills</h3>
          </div>

          <div className="academy-grid">
            {academyPrograms.map((program) => (
              <div key={program.title} className="academy-card">
                <span className="academy-level">{program.level}</span>
                <h4>{program.title}</h4>
                <div className="meta-row">
                  <span>{program.duration}</span>
                  <span>{program.mentor}</span>
                </div>
                <button className="primary-btn small full-width" type="button">Enroll now</button>
              </div>
            ))}
          </div>

          <div className="portal-grid">
            <div className="portal-card">
              <div className="portal-header">
                <h4>Student portal</h4>
                <span className="status-pill">Active</span>
              </div>

              <div className="profile-row">
                <div className="avatar">AS</div>
                <div>
                  <strong>Aisha Sanni</strong>
                  <small>Level 2 • Hospitality student</small>
                </div>
              </div>

              <ul className="portal-list">
                <li>Assignment: Event flow planning</li>
                <li>Next class: Thursday, 4:00 PM</li>
                <li>Progress: 72% completion</li>
              </ul>
            </div>

            <div className="portal-card ai-panel">
              <div className="portal-header">
                <h4>AI assistant</h4>
                <span className="status-pill purple">Online</span>
              </div>

              <div className="chat-box">
                {chatMessages.map((message, index) => (
                  <div key={`${message.from}-${index}`} className={`chat-bubble ${message.from}`}>
                    {message.text}
                  </div>
                ))}
              </div>

              <div className="chat-input-row">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Ask Ripples AI..."
                  aria-label="Ask Ripples AI"
                />
                <button type="button" onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
        </section>

        <section className="section alt-bg" id="tracking">
          <div className="container tracking-layout">
            <div>
              <div className="section-heading left">
                <p className="eyebrow">Verification &amp; tracking</p>
                <h3>Track your order, event progress, or delivery</h3>
              </div>

              <div className="tracking-card">
                <div className="tracking-info">
                  <span>Order ID</span>
                  <strong>#RPL-1848</strong>
                </div>
                <div className="tracking-bar" aria-label="tracking progress">
                  <div className="tracking-fill" style={{ width: '76%' }} />
                </div>
                <div className="tracking-status-row">
                  <span>Preparing</span>
                  <span>On route</span>
                  <span>Delivered</span>
                </div>
              </div>
            </div>

            <div className="qr-box">
              <div className="qr-code" aria-label="QR code verifier">
                {Array.from({ length: 23 }).map((_, idx) => (
                  <span key={idx} aria-hidden="true" />
                ))}
              </div>
              <div className="qr-meta">
                <strong>QR Delivery Verifier</strong>
                <p>Confirm rider arrival and secure handoff at the destination.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section container payment-section">
          <div className="section-heading">
            <p className="eyebrow">Secure payments</p>
            <h3>Flexible checkout in naira</h3>
          </div>

          <div className="payment-layout">
            <div className="payment-card">
              <div className="payment-options">
                <button
                  type="button"
                  className={selectedPayment === 'transfer' ? 'selected' : ''}
                  onClick={() => setSelectedPayment('transfer')}
                >
                  Bank Transfer
                </button>
                <button
                  type="button"
                  className={selectedPayment === 'cash' ? 'selected' : ''}
                  onClick={() => setSelectedPayment('cash')}
                >
                  Cash on Delivery
                </button>
              </div>

              <div className="form-grid">
                <label>
                  Email
                  <input type="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} />
                </label>
                <label>
                  Password
                  <input type="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} />
                </label>
                <label className="full-span">
                  NIN verification
                  <input type="text" value={user.nin} onChange={(e) => setUser({ ...user, nin: e.target.value })} />
                </label>
              </div>

              <div className="checkout-summary">
                <span>Payment Method</span>
                <strong>{paymentLabel}</strong>
              </div>
            </div>

            <div className="payment-card accent-card">
              <p className="eyebrow small-space">Secure checkout</p>
              <h4>₦{total.toLocaleString()}</h4>
              <ul>
                <li>Bank transfer details verified</li>
                <li>Identity checked with NIN</li>
                <li>Encrypted transaction tracking</li>
              </ul>
              <button className="primary-btn full-width" type="button">Confirm payment</button>
            </div>
          </div>
        </section>

        <section className="section alt-bg" id="admin">
          <div className="container">
            <div className="section-heading left">
              <p className="eyebrow">Admin dashboard</p>
              <h3>Command center for operations</h3>
            </div>

            <div className="admin-grid">
              {adminCards.map((item) => (
                <div key={item.label} className="admin-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                  <em>{item.change}</em>
                </div>
              ))}
            </div>

            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Wedding package</td>
                    <td>Faith &amp; Ben</td>
                    <td><span className="status-pill green">Confirmed</span></td>
                    <td>₦390,000</td>
                  </tr>
                  <tr>
                    <td>Campus meal delivery</td>
                    <td>John O.</td>
                    <td><span className="status-pill orange">On route</span></td>
                    <td>₦8,400</td>
                  </tr>
                  <tr>
                    <td>Catering setup</td>
                    <td>Nova HR</td>
                    <td><span className="status-pill blue">Pending</span></td>
                    <td>₦240,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <div className="brand-word mini">Ripples</div>
            <p>Modern food, event, and learning experiences in one place.</p>
          </div>
          <div className="footer-links">
            <a href="#restaurant">Restaurant</a>
            <a href="#academy">Academy</a>
            <a href="#tracking">Tracking</a>
            <a href="#admin">Admin</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
