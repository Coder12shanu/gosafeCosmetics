import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  RedirectToSignIn,
  SignIn,
  UserButton,
  useAuth,
  useUser,
} from "@clerk/clerk-react";
import {
  Search,
  Menu,
  X,
  MessageCircle,
  ArrowRight,
  Globe2,
  ShieldCheck,
  Truck,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  Upload,
  Save,
  Settings,
  Briefcase,
  Inbox,
  Package,
  Tag,
  Home as HomeIcon,
  LogOut,
} from "lucide-react";
import { load, save, reset, sync } from "./store";

  const d = load();

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}
function useData() {
  const [data, setData] = useState(load());
  useEffect(() => {
    const f = () => setData(load());
    sync()
      .then((remote) => setData(remote))
      .catch(() => {});
    window.addEventListener("gosafe-data-change", f);
    return () => window.removeEventListener("gosafe-data-change", f);
  }, []);
  return data;
}
const wa = (n, msg) =>
  `https://wa.me/${n.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
const normalizeCategory = (category) =>
  String(category || "").toLowerCase().replace(/[^a-z0-9]/g, "");
function ContactBar({ s }) {
  return (
    <div className="contactbar">
      <div className="container contact-inner">
        <span>{s.tagline}</span>
        <div className="contact-items">
          <a href={`tel:${s.phone}`}>{s.phone}</a>
          <a href={`mailto:${s.email}`}>{s.email}</a>
          <a
            href={wa(s.whatsapp, "Hello GOSAFE COSMETICS")}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <span>{s.address}</span>
        </div>
      </div>
    </div>
  );
}
function Navbar({ s }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          {s.logo && <img src={s.logo} alt={s.companyName} />}
        </Link>
        <nav className={open ? "nav-links open" : "nav-links"}>
          {[
            ["/", "Home"],
            ["/products", "Products"],
            ["/about", "About Us"],
            ["/careers", "Careers"],
            ["/contact", "Contact"],
          ].map(([p, t]) => (
            <Link
              key={p}
              to={p}
              className={
                pathname === p || (p !== "/" && pathname.startsWith(`${p}/`))
                  ? "active"
                  : ""
              }
              onClick={() => setOpen(false)}
            >
              {t}
            </Link>
          ))}
          <a
            className="nav-wa"
            href={wa(
              s.whatsapp,
              "Hello GOSAFE COSMETICS, I would like to enquire about your cosmetics products."
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={17} /> Get a Quote
          </a>
        </nav>
        <div className="nav-mobile">
          <Link to="/products">
            <Search />
          </Link>
          <button onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
function Layout({ children }) {
  const d = useData();
  const s = d.settings;
  return (
    <>
      <ScrollToTop />
      <ContactBar s={s} />
      <Navbar s={s} />
      {children}
      <footer>
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">
              {s.logo && <img src={s.logo} alt={s.companyName} />}
            </div>
            <p>
              Professional cosmetics supply for distributors, wholesalers,
              retailers and business customers worldwide.
            </p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <Link to="/products">Products</Link>
            <Link to="/about">About Us</Link>
            <Link to="/careers">Careers</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div>
            <h4>Markets</h4>
            <span>Asia</span>
            <span>GCC / Middle East</span>
            <span>Europe</span>
            <span>America</span>
            <span>Africa</span>
          </div>
          <div>
            <h4>Contact</h4>
            <a href={`tel:${s.phone}`}>{s.phone}</a>
            <a href={`mailto:${s.email}`}>{s.email}</a>
            <span>{s.address}</span>
          </div>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} {s.companyName}. All Rights Reserved.
        </div>
      </footer>
      <a
        className="floating-wa"
        href={wa(
          s.whatsapp,
          "Hello GOSAFE COSMETICS, I would like to enquire."
        )}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle />
      </a>
    </>
  );
}
function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <div className="eyebrow">GLOBAL COSMETICS SUPPLY</div>
          <h1>
            Your Trusted Partner in <em>Global Cosmetics Supply</em>
          </h1>
          <p>
            Quality cosmetics products supplied across Asia, GCC, Europe,
            America and Africa.
          </p>
          <div className="hero-actions">
            <Link className="btn primary" to="/products">
              Explore Products <ArrowRight size={18} />
            </Link>
            <Link className="btn secondary" to="/contact">
              Contact Us
            </Link>
          </div>
        </div>
        <div className="hero-card">
          <img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=85" />
          <div className="hero-float">
            <Globe2 />
            <div>
              <b>5 Global Markets</b>
              <span>International supply</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
function ProductCard({ p }) {
  const d = useData();
  return (
    <article className="product-card">
      <Link to={`/products/${p.id}`} className="product-img">
        <img src={p.image} alt={p.name} />
        {p.offer && <span className="badge">Offer</span>}
      </Link>
      <div className="product-body">
        <span className="muted">
          {p.category} · {p.code}
        </span>
        <Link to={`/products/${p.id}`}>
          <h3>{p.name}</h3>
        </Link>
        <p>{p.description}</p>
        <div className="card-actions">
          <Link className="text-link" to={`/products/${p.id}`}>
            View Product <ArrowRight size={16} />
          </Link>
          <a
            className="small-wa"
            href={wa(
              d.settings.whatsapp,
              `Hello GOSAFE COSMETICS, I am interested in ${p.name} (${p.code}). Please provide pricing and availability.`
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={15} />
          </a>
        </div>
      </div>
    </article>
  );
}
function Home() {
  const d = useData();
  const trending = d.products.filter((p) => p.trending);
  const offers = d.offers.filter((o) => o.active);
  return (
    <Layout>
      <Hero />
      <section className="section intro">
        <div className="container two-col">
          <div>
            <span className="eyebrow">ABOUT GOSAFE COSMETICS</span>
            <h2>Global Cosmetics Supply, Built on Trust</h2>
          </div>
          <div>
            <p>
              We supply cosmetics products to wholesalers, retailers,
              distributors and business customers across multiple international
              markets. Our focus is on reliable sourcing, professional service
              and competitive supply solutions.
            </p>
            <div className="feature-row">
              <div>
                <ShieldCheck />
                <span>Quality products</span>
              </div>
              <div>
                <Truck />
                <span>Reliable supply</span>
              </div>
              <div>
                <Globe2 />
                <span>Global markets</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section soft">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">FEATURED COLLECTION</span>
              <h2>Shop by Category</h2>
            </div>
            <Link className="text-link" to="/products">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="category-grid">
            {d.categories.map((c) => (
              <Link
                to={`/products?category=${encodeURIComponent(c)}`}
                className="category-card"
                key={c}
              >
                <div className="cat-num">
                  {String(
                    d.products.filter(
                      (p) => normalizeCategory(p.category) === normalizeCategory(c)
                    ).length 
                  ).padStart(2, "0")} Products Available    
                </div>
                <h3>{c}</h3>
                <span>
                  Explore collection <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">MOST REQUESTED</span>
              <h2>Trending Products</h2>
            </div>
            <Link className="text-link" to="/products">
              View all <ArrowRight size={16} />
            </Link>
          </div>
          <div className="product-grid">
            {trending.slice(0, 6).map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>
      <section className="section offers">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">CURRENT PROMOTIONS</span>
              <h2>Latest Offers</h2>
            </div>
          </div>
          <div className="offer-grid">
            {offers.length ? (
              offers.map((o) => (
                <div className="offer-card" key={o.id}>
                  <img src={o.image} alt={o.title} />
                  <div className="offer-overlay">
                    <span className="eyebrow">WHOLESALE</span>
                    <h3>{o.title}</h3>
                    <p>{o.description}</p>
                    <Link
                      className="btn light"
                      to={o.productId ? `/products/${o.productId}` : "/contact"}
                    >
                      Enquire Now <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty">No current offers available.</div>
            )}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container market">
          <div>
            <span className="eyebrow">GLOBAL REACH</span>
            <h2>Supplying Cosmetics Across Global Markets</h2>
            <p>
              Connect with GOSAFE COSMETICS for sourcing, wholesale and
              international supply requirements.
            </p>
            <Link className="btn primary" to="/contact">
              Partner With Us <ArrowRight size={18} />
            </Link>
          </div>
          <div className="map-card">
            <Globe2 size={130} />
            <div>
              <b>Asia · GCC · Europe</b>
              <span>America · Africa</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
function Products() {
  const d = useData();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const filtered = d.products.filter(
    (p) =>
      (p.name + p.code + p.category).toLowerCase().includes(q.toLowerCase()) &&
      (!cat || p.category === cat)
  );
  return (
    <Layout>
      <main className="page">
        <div className="container">
          <div className="page-head">
            <span className="eyebrow">PRODUCT CATALOGUE</span>
            <h1>Explore Our Products</h1>
            <p>
              Browse our growing range of cosmetics and personal care products
              for international supply.
            </p>
          </div>
          <div className="toolbar">
            <div className="search-box">
              <Search />
              <input
                placeholder="Search products..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">All Categories</option>
              {d.categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="product-grid">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
          {!filtered.length && (
            <div className="empty">No products match your search.</div>
          )}
        </div>
      </main>
    </Layout>
  );
}
function ProductDetail() {
  const { id } = useParams();
  const d = useData();
  const p = d.products.find((x) => x.id === id) || d.products[0];
  const imgs = [p.image, ...(p.images || [])];
  const [idx, setIdx] = useState(0);
  return (
    <Layout>
      <main className="page">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>{p.name}</span>
          </div>
          <div className="detail">
            <div className="gallery">
              <div className="main-image">
                <img src={imgs[idx]} alt={p.name} />
              </div>
              <div className="thumbs">
                {imgs.map((im, i) => (
                  <button
                    key={i}
                    className={idx === i ? "active" : ""}
                    onClick={() => setIdx(i)}
                  >
                    <img src={im} />
                  </button>
                ))}
              </div>
              <div className="gallery-nav">
                <button
                  onClick={() => setIdx((idx - 1 + imgs.length) % imgs.length)}
                >
                  <ChevronLeft />
                </button>
                <button onClick={() => setIdx((idx + 1) % imgs.length)}>
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div className="detail-copy">
              <span className="eyebrow">
                {p.category} · {p.code}
              </span>
              <h1>{p.name}</h1>
              <p className="lead">{p.description}</p>
              <div className="spec">
                <h4>Product Specifications</h4>
                <p>{p.specifications}</p>
              </div>
              <a
                className="btn primary full"
                href={wa(
                  d.settings.whatsapp,
                  `Hello GOSAFE COSMETICS, I am interested in ${p.name} (${p.code}). Please provide your quotation, availability and shipping details.`
                )}
                target="_blank"
                rel="noreferrer"
              >
                <MessageCircle size={18} /> Order / Enquire on WhatsApp
              </a>
              <Link className="btn secondary full" to="/contact">
                Contact Our Team
              </Link>
            </div>
          </div>
          <section className="related">
            <div className="section-head">
              <h2>Related Products</h2>
            </div>
            <div className="product-grid">
              {d.products
                .filter((x) => x.id !== p.id)
                .slice(0, 3)
                .map((x) => (
                  <ProductCard key={x.id} p={x} />
                ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
function SimplePage({ title, eyebrow, children }) {
  return (
    <Layout>
      <main className="page">
        <div className="container narrow">
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {children}
        </div>
      </main>
    </Layout>
  );
}
function About() {
  return (
    <SimplePage
      title="Global Cosmetics Supply, Built on Trust"
      eyebrow="ABOUT US"
    >
      <p className="lead">
        GOSAFE COSMETICS is an international cosmetics supply business serving
        distributors, wholesalers, retailers and corporate customers.
      </p>
      <div className="info-blocks">
        <div>
          <h3>Our Mission</h3>
          <p>
            To make quality cosmetics supply dependable, efficient and
            accessible across international markets.
          </p>
        </div>
        <div>
          <h3>Our Vision</h3>
          <p>
            To build a trusted global cosmetics supply network known for product
            range, responsiveness and long-term partnerships.
          </p>
        </div>
        <div>
          <h3>Our Values</h3>
          <p>
            Quality, reliability, professionalism, transparency and
            customer-focused service.
          </p>
        </div>
      </div>
    </SimplePage>
  );
}
function Careers() {
  const d = useData();
  const [job, setJob] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  return (
    <SimplePage
      title="Build Your Career With GOSAFE COSMETICS"
      eyebrow="CAREERS"
    >
      <p className="lead">
        Join a growing international business and help us serve customers across
        global markets.
      </p>
      <div className="jobs">
        {d.jobs.length ? (
          d.jobs.map((j) => (
            <div className="job" key={j.id}>
              <div>
                <span className="muted">
                  {j.department} · {j.location}
                </span>
                <h3>{j.title}</h3>
                <p>{j.description}</p>
              </div>
              <button className="btn primary" onClick={() => setJob(j)}>
                Apply Now
              </button>
            </div>
          ))
        ) : (
          <div className="empty">
            No current vacancies. Please check back soon.
          </div>
        )}
      </div>
      {job && (
        <div className="modal">
          <div className="modal-card">
            <button className="close" onClick={() => setJob(null)}>
              <X />
            </button>
            <h2>Apply for {job.title}</h2>
            <input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <textarea
              placeholder="Cover message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <button
              className="btn primary"
              onClick={() => {
                const x = load();
                x.applications.push({
                  id: Date.now().toString(),
                  jobId: job.id,
                  ...form,
                  date: new Date().toISOString(),
                });
                save(x);
                alert("Application submitted successfully.");
                setJob(null);
              }}
            >
              Submit Application
            </button>
          </div>
        </div>
      )}
    </SimplePage>
  );
}
function Contact() {
  const d = useData();
  const [f, setF] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    subject: "",
    message: "",
  });
  return (
    <SimplePage
      title="Let's Talk About Your Supply Requirements"
      eyebrow="CONTACT"
    >
      <div className="contact-grid">
        <div className="contact-card">
          <h3>GOSAFE COSMETICS</h3>
          <p>{d.settings.address}</p>
          <a href={`tel:${d.settings.phone}`}>{d.settings.phone}</a>
          <a href={`mailto:${d.settings.email}`}>{d.settings.email}</a>
          <span>{d.settings.workingHours}</span>
          <a
            className="btn primary"
            href={wa(
              d.settings.whatsapp,
              "Hello GOSAFE COSMETICS, I would like to enquire about your cosmetics supply."
            )}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle /> WhatsApp Us
          </a>
        </div>
        <form
          className="form-card"
          onSubmit={(e) => {
            e.preventDefault();
            const x = load();
            x.messages.push({
              id: Date.now().toString(),
              ...f,
              date: new Date().toISOString(),
              status: "New",
            });
            save(x);
            alert("Thank you. Your enquiry has been submitted.");
            setF({
              name: "",
              company: "",
              email: "",
              phone: "",
              country: "",
              subject: "",
              message: "",
            });
          }}
        >
          <input
            required
            placeholder="Name"
            value={f.name}
            onChange={(e) => setF({ ...f, name: e.target.value })}
          />
          <input
            placeholder="Company"
            value={f.company}
            onChange={(e) => setF({ ...f, company: e.target.value })}
          />
          <input
            required
            type="email"
            placeholder="Email"
            value={f.email}
            onChange={(e) => setF({ ...f, email: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={f.phone}
            onChange={(e) => setF({ ...f, phone: e.target.value })}
          />
          <input
            placeholder="Country"
            value={f.country}
            onChange={(e) => setF({ ...f, country: e.target.value })}
          />
          <input
            placeholder="Subject"
            value={f.subject}
            onChange={(e) => setF({ ...f, subject: e.target.value })}
          />
          <textarea
            required
            rows="6"
            placeholder="Message"
            value={f.message}
            onChange={(e) => setF({ ...f, message: e.target.value })}
          />
          <button className="btn primary" type="submit">
            Send Enquiry <ArrowRight />
          </button>
        </form>
      </div>
    </SimplePage>
  );
}
const adminEmails = (
  import.meta.env.VITE_ADMIN_EMAILS ||
  "gosafegt@gmail.com,boliviansabu@gmail.com"
)
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);
function AdminGate() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  if (!isLoaded || !userLoaded)
    return (
      <main className="page">
        <div className="container">
          <p>Loading admin...</p>
        </div>
      </main>
    );
  if (!isSignedIn) return <RedirectToSignIn redirectUrl="/admin" />;
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (!email || !adminEmails.includes(email))
    return (
      <main className="page">
        <div className="container narrow">
          <span className="eyebrow">ACCESS RESTRICTED</span>
          <h1>Admin access is restricted</h1>
          <p className="lead">
            Your signed-in email is not authorized to access this dashboard.
          </p>
          <UserButton />
        </div>
      </main>
    );
  return <Admin />;
}
function AdminUnavailable() {
  return (
    <main className="page">
      <div className="container narrow">
        <span className="eyebrow">ADMIN SETUP REQUIRED</span>
        <h1>Admin authentication is not configured</h1>
        <p className="lead">
          Add VITE_CLERK_PUBLISHABLE_KEY to your environment and restart the app
          before opening the admin dashboard.
        </p>
      </div>
    </main>
  );
}
function Admin() {
  const nav = useNavigate();
  const d0 = useData();
  const [d, setD] = useState(d0);
  useEffect(() => setD(d0), [d0]);
  const [tab, setTab] = useState("dashboard");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(null);
  const [offer, setOffer] = useState(null);
  const update = (patch) => {
    const nd = { ...d, ...patch };
    setD(nd);
    save(nd);
  };
  const editProduct = (p) => {
    setEditing(p?.id || "new");
    setForm(
      p
        ? { ...p }
        : {
            id: "p" + Date.now(),
            name: "",
            code: "",
            category: d.categories[0] || "Skincare",
            image: "",
            images: [],
            description: "",
            specifications: "",
            trending: false,
            featured: false,
            offer: false,
          }
    );
  };
  const del = (id) => {
    if (confirm("Delete this product?"))
      update({ products: d.products.filter((p) => p.id !== id) });
  };
  return (
    <div className="admin">
      <aside className="admin-side">
        <div className="admin-logo">
          GOSAFE <span>COSMETICS</span>
        </div>
        {[
          ["dashboard", HomeIcon, "Dashboard"],
          ["products", Package, "Products"],
          ["offers", Tag, "Offers"],
          ["branding", Settings, "Company & Branding"],
          ["jobs", Briefcase, "Careers"],
          ["messages", Inbox, "Enquiries"],
        ].map(([k, I, t]) => (
          <button
            key={k}
            className={tab === k ? "active" : ""}
            onClick={() => {
              setTab(k);
              setEditing(null);
            }}
          >
            <I size={18} />
            {t}
          </button>
        ))}
        <button onClick={() => nav("/")}>
          <LogOut size={18} /> View Website
        </button>
      </aside>
      <section className="admin-main">
        <div className="admin-top">
          <div>
            <span className="eyebrow">ADMIN DASHBOARD</span>
            <h1>
              {tab === "dashboard"
                ? "Overview"
                : tab === "branding"
                ? "Company & Branding"
                : tab[0].toUpperCase() + tab.slice(1)}
            </h1>
          </div>
          <UserButton />
        </div>
        {tab === "dashboard" && (
          <div className="stats">
            <div>
              <Package />
              <b>{d.products.length}</b>
              <span>Products</span>
            </div>
            <div>
              <Tag />
              <b>{d.offers.length}</b>
              <span>Offers</span>
            </div>
            <div>
              <Briefcase />
              <b>{d.jobs.length}</b>
              <span>Jobs</span>
            </div>
            <div>
              <Inbox />
              <b>{d.messages.length}</b>
              <span>Enquiries</span>
            </div>
          </div>
        )}
        {tab === "products" && (
          <>
            {editing ? (
              <ProductEditor
                form={form}
                setForm={setForm}
                categories={d.categories}
                onCancel={() => setEditing(null)}
                onSave={() => {
                  const arr = d.products.some((p) => p.id === form.id)
                    ? d.products.map((p) => (p.id === form.id ? form : p))
                    : [...d.products, form];
                  update({ products: arr });
                  setEditing(null);
                }}
              />
            ) : (
              <>
                <div className="admin-actions">
                  <button
                    className="btn primary"
                    onClick={() => editProduct(null)}
                  >
                    <Plus /> Add Product
                  </button>
                </div>
                <div className="admin-table">
                  {d.products.map((p) => (
                    <div className="row" key={p.id}>
                      <img src={p.image} />
                      <div>
                        <b>{p.name}</b>
                        <span>
                          {p.code} · {p.category}
                        </span>
                      </div>
                      <span>{p.trending ? "Trending" : ""}</span>
                      <div className="row-actions">
                        <button onClick={() => editProduct(p)}>
                          <Edit3 />
                        </button>
                        <button onClick={() => del(p.id)}>
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
        {tab === "offers" && <OffersAdmin d={d} update={update} />}{" "}
        {tab === "branding" && <BrandingAdmin d={d} update={update} />}{" "}
        {tab === "jobs" && <JobsAdmin d={d} update={update} />}{" "}
        {tab === "messages" && <MessagesAdmin d={d} />}
      </section>
    </div>
  );
}
function ProductEditor({ form, setForm, categories, onCancel, onSave }) {
  const patch = (k, v) => setForm({ ...form, [k]: v });
  return (
    <div className="editor">
      <div className="editor-grid">
        <div className="form-card">
          <h2>Product Details</h2>
          <input
            value={form.name}
            onChange={(e) => patch("name", e.target.value)}
            placeholder="Product name"
          />
          <input
            value={form.code}
            onChange={(e) => patch("code", e.target.value)}
            placeholder="Product code"
          />
          <select
            value={form.category}
            onChange={(e) => patch("category", e.target.value)}
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <textarea
            value={form.description}
            onChange={(e) => patch("description", e.target.value)}
            placeholder="Short description"
          />
          <textarea
            value={form.specifications}
            onChange={(e) => patch("specifications", e.target.value)}
            placeholder="Specifications / packaging"
          />
          <input
            value={form.image}
            onChange={(e) => patch("image", e.target.value)}
            placeholder="Main image URL (for now)"
          />
          <div className="checks">
            <label>
              <input
                type="checkbox"
                checked={form.trending}
                onChange={(e) => patch("trending", e.target.checked)}
              />{" "}
              Trending
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => patch("featured", e.target.checked)}
              />{" "}
              Featured
            </label>
            <label>
              <input
                type="checkbox"
                checked={form.offer}
                onChange={(e) => patch("offer", e.target.checked)}
              />{" "}
              Offer
            </label>
          </div>
        </div>
        <div className="form-card preview">
          <span className="eyebrow">PREVIEW</span>
          <div className="preview-img">
            {form.image ? <img src={form.image} /> : <Upload size={28} />}
          </div>
          <h3>{form.name || "Product Name"}</h3>
          <p>{form.description || "Product description"}</p>
        </div>
      </div>
      <div className="editor-actions">
        <button className="btn secondary" onClick={onCancel}>
          Cancel
        </button>
        <button className="btn primary" onClick={onSave}>
          <Save /> Save Product
        </button>
      </div>
    </div>
  );
}
function OffersAdmin({ d, update }) {
  const [f, setF] = useState(null);
  const saveOffer = () => {
    const arr = d.offers.some((o) => o.id === f.id)
      ? d.offers.map((o) => (o.id === f.id ? f : o))
      : [...d.offers, f];
    update({ offers: arr });
    setF(null);
  };
  return (
    <>
      {f ? (
        <div className="form-card">
          <h2>{f.id ? "Edit" : "Add"} Offer</h2>
          <input
            placeholder="Offer title"
            value={f.title}
            onChange={(e) => setF({ ...f, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={f.description}
            onChange={(e) => setF({ ...f, description: e.target.value })}
          />
          <input
            placeholder="Image URL"
            value={f.image}
            onChange={(e) => setF({ ...f, image: e.target.value })}
          />
          <label className="switch">
            <input
              type="checkbox"
              checked={f.active}
              onChange={(e) => setF({ ...f, active: e.target.checked })}
            />{" "}
            Active
          </label>
          <div className="editor-actions">
            <button className="btn secondary" onClick={() => setF(null)}>
              Cancel
            </button>
            <button className="btn primary" onClick={saveOffer}>
              <Save /> Save Offer
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="admin-actions">
            <button
              className="btn primary"
              onClick={() =>
                setF({
                  id: "o" + Date.now(),
                  title: "",
                  description: "",
                  image: "",
                  active: true,
                })
              }
            >
              <Plus /> Add Offer
            </button>
          </div>
          {d.offers.map((o) => (
            <div className="offer-row" key={o.id}>
              <img src={o.image} />
              <div>
                <b>{o.title}</b>
                <span>{o.description}</span>
              </div>
              <button onClick={() => setF(o)}>
                <Edit3 />
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this offer?"))
                    update({ offers: d.offers.filter((x) => x.id !== o.id) });
                }}
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </>
      )}
    </>
  );
}
function BrandingAdmin({ d, update }) {
  const s = d.settings;
  const [f, setF] = useState(s);
  const [logo, setLogo] = useState(s.logo);
  const fileToData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      const dataUrl = String(r.result);
      setLogo(dataUrl);
      setF((current) => ({ ...current, logo: dataUrl }));
      update({ settings: { ...s, logo: dataUrl } });
    };
    r.readAsDataURL(file);
  };
  return (
    <div className="branding">
      <div className="form-card">
        <h2>Logo & Company Information</h2>
        <div className="logo-upload">
          <div className="brand-preview">
            {logo && <img src={logo} alt="Logo preview" />}
          </div>
          <label className="btn secondary">
            <Upload /> Upload Logo
            <input
              hidden
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={fileToData}
            />
          </label>
          <p>
            Logo is stored locally in this starter build. For production,
            connect this to cloud storage.
          </p>
        </div>
        {[
          ["companyName", "Company Name"],
          ["tagline", "Tagline"],
          ["phone", "Phone"],
          ["whatsapp", "WhatsApp"],
          ["email", "Email"],
          ["website", "Website"],
          ["address", "Address"],
          ["workingHours", "Working Hours"],
        ].map(([k, l]) => (
          <input
            key={k}
            value={f[k] || ""}
            onChange={(e) => setF({ ...f, [k]: e.target.value })}
            placeholder={l}
          />
        ))}
        <div className="editor-actions">
          <button
            className="btn primary"
            onClick={() => {
              const ns = { ...f, logo };
              update({ settings: ns });
            }}
          >
            <Save /> Save Company Settings
          </button>
        </div>
      </div>
      <div className="form-card">
        <h2>Branding Preview</h2>
        <div className="site-preview">
          <div className="preview-nav">
            {logo && <img src={logo} alt="Logo preview" />}
            <span>Home · Products · About · Careers · Contact</span>
          </div>
          <p>{f.tagline}</p>
        </div>
      </div>
    </div>
  );
}
function JobsAdmin({ d, update }) {
  const [f, setF] = useState(null);
  return (
    <>
      {f ? (
        <div className="form-card">
          <h2>Add Job</h2>
          <input
            placeholder="Job title"
            value={f.title}
            onChange={(e) => setF({ ...f, title: e.target.value })}
          />
          <input
            placeholder="Department"
            value={f.department}
            onChange={(e) => setF({ ...f, department: e.target.value })}
          />
          <input
            placeholder="Location"
            value={f.location}
            onChange={(e) => setF({ ...f, location: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={f.description}
            onChange={(e) => setF({ ...f, description: e.target.value })}
          />
          <button
            className="btn primary"
            onClick={() => {
              update({ jobs: [...d.jobs, f] });
              setF(null);
            }}
          >
            <Save /> Save Job
          </button>
        </div>
      ) : (
        <>
          <div className="admin-actions">
            <button
              className="btn primary"
              onClick={() =>
                setF({
                  id: "j" + Date.now(),
                  title: "",
                  department: "",
                  location: "Dubai, UAE",
                  description: "",
                })
              }
            >
              <Plus /> Add Job
            </button>
          </div>
          {d.jobs.map((j) => (
            <div className="job" key={j.id}>
              <div>
                <b>{j.title}</b>
                <span>
                  {j.department} · {j.location}
                </span>
              </div>
              <button
                onClick={() =>
                  update({ jobs: d.jobs.filter((x) => x.id !== j.id) })
                }
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </>
      )}
    </>
  );
}
function MessagesAdmin({ d }) {
  return (
    <div className="admin-table">
      {d.messages.length ? (
        d.messages.map((m) => (
          <div className="row" key={m.id}>
            <div>
              <b>
                {m.name} · {m.company || "Individual"}
              </b>
              <span>
                {m.email} · {m.phone}
              </span>
            </div>
            <span>{m.status}</span>
            <p>{m.message}</p>
          </div>
        ))
      ) : (
        <div className="empty">No enquiries yet.</div>
      )}
    </div>
  );
}
export default function App({ authEnabled = false }) {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={authEnabled ? <AdminGate /> : <AdminUnavailable />}
      />
      {authEnabled && (
        <Route
          path="/sign-in/*"
          element={
            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
          }
        />
      )}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export function productCount() {

  return d.products.length;
}
