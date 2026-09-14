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
  ChevronDown,
  ArrowLeft,
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
const siteUrl = "https://www.gosafecosmetics.com";
function SEO({ title, description, path = "/", type = "website", product }) {
  useEffect(() => {
    const fullTitle = title.includes("GOSAFE") ? title : `${title} | GOSAFE COSMETICS`;
    const canonical = `${siteUrl}${path}`;
    document.title = fullTitle;
    const setMeta = (name, content, attribute = "name") => {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };
    setMeta("description", description);
    setMeta("og:title", fullTitle, "property");
    setMeta("og:description", description, "property");
    setMeta("og:url", canonical, "property");
    setMeta("og:type", type, "property");
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    const schema = product
      ? { "@context": "https://schema.org", "@type": "Product", name: product.name, description: product.description, category: product.category, image: [product.image], sku: product.code, brand: { "@type": "Brand", name: "GOSAFE COSMETICS" }, offers: { "@type": "Offer", availability: "https://schema.org/InStock", url: canonical, priceCurrency: "AED" } }
      : { "@context": "https://schema.org", "@type": "Organization", name: "GOSAFE COSMETICS", url: siteUrl, email: "info@gosafecosmetics.com", telephone: "+971585394030", address: { "@type": "PostalAddress", addressLocality: "Dubai", addressCountry: "AE" } };
    let script = document.head.querySelector('script[data-seo-schema="true"]');
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoSchema = "true";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }, [description, path, product, title, type]);
  return null;
}
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
const categoryFallbackImages = [
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=500&q=80",
  "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=500&q=80",
];

function Navbar({ s, d }) {
  const [open, setOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const { pathname } = useLocation();
  const hasCategoryPath = pathname === "/products";

  const categoryItems = d.categories.map((category, index) => ({
    name: category,
    image:
      d.products.find(
        (product) => normalizeCategory(product.category) === normalizeCategory(category)
      )?.image || categoryFallbackImages[index % categoryFallbackImages.length],
  }));

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">
          {s.logo && <img src={s.logo} alt={s.companyName} />}
        </Link>
        <nav className={open ? "nav-links open" : "nav-links"}>
          <Link to="/" className={pathname === "/" ? "active" : ""} onClick={() => setOpen(false)}>
            Home
          </Link>
          <div
            className={categoriesOpen ? "products-menu is-open" : "products-menu"}
            onMouseEnter={() => setCategoriesOpen(true)}
            onMouseLeave={() => setCategoriesOpen(false)}
          >
            <button
              className={hasCategoryPath ? "products-trigger active" : "products-trigger"}
              onClick={() => setCategoriesOpen(!categoriesOpen)}
              aria-expanded={categoriesOpen}
              aria-haspopup="true"
            >
              Products <ChevronDown size={15} />
            </button>
            <div className="category-dropdown">
              <Link to="/products" className="category-dropdown-all" onClick={() => { setCategoriesOpen(false); setOpen(false); }}>
                <span>View all products</span>
                <ArrowRight size={16} />
              </Link>
              <div className="category-dropdown-grid">
                {categoryItems.map((category) => (
                  <Link
                    key={category.name}
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    onClick={() => { setCategoriesOpen(false); setOpen(false); }}
                  >
                    <img src={category.image} alt="" />
                    <span>{category.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link to="/about" className={pathname.startsWith("/about") ? "active" : ""} onClick={() => setOpen(false)}>
            About Us
          </Link>
          <Link to="/careers" className={pathname.startsWith("/careers") ? "active" : ""} onClick={() => setOpen(false)}>
            Careers
          </Link>
          <Link to="/contact" className={pathname.startsWith("/contact") ? "active" : ""} onClick={() => setOpen(false)}>
            Contact
          </Link>
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
      <Navbar s={s} d={d} />
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
            <h4>Business Services</h4>
            <Link to="/cosmetics-supplier-dubai-uae">Cosmetics Supplier UAE</Link>
            <Link to="/cosmetics-wholesaler-uae">Cosmetics Wholesaler UAE</Link>
            <Link to="/skincare-wholesale-uae">Skincare Wholesale UAE</Link>
            <Link to="/hair-care-supplier-uae">Hair Care Supplier UAE</Link>
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
      <SEO title="Cosmetics Supplier in Dubai, UAE" description="GOSAFE COSMETICS is a cosmetics supplier in Dubai, UAE, supplying skincare, hair care, makeup and personal care products to wholesalers, distributors and retailers." />
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
                  {(() => {
                    const count = d.products.filter(
                      (p) => normalizeCategory(p.category) === normalizeCategory(c)
                    ).length;
                    return count ? `${count} Products Available` : "Products Unavailable";
                  })()}
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
  const { search } = useLocation();
  const categoryFromUrl = new URLSearchParams(search).get("category") || "";
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(categoryFromUrl);
  useEffect(() => setCat(categoryFromUrl), [categoryFromUrl]);
  const filtered = d.products.filter(
    (p) =>
      (p.name + p.code + p.category).toLowerCase().includes(q.toLowerCase()) &&
      (!cat || normalizeCategory(p.category) === normalizeCategory(cat))
  );
  return (
    <Layout>
      <SEO title="Cosmetics Products for Wholesale Supply" description="Browse skincare, hair care, makeup, personal care and fragrance products available from GOSAFE COSMETICS for wholesale and distribution in Dubai, UAE and worldwide." path="/products" />
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
const seoPages = {
  supplier: {
    path: "/cosmetics-supplier-dubai-uae",
    eyebrow: "COSMETICS SUPPLIER IN THE UAE",
    title: "Cosmetics Supplier in Dubai, UAE",
    description: "GOSAFE COSMETICS supplies skincare, hair care, makeup and personal care products to retailers, distributors and wholesalers in Dubai and across the UAE.",
    intro: "GOSAFE COSMETICS is a Dubai-based cosmetics supplier serving businesses that need dependable product sourcing and professional wholesale support. We help retailers, distributors and other business customers build a practical cosmetics range for the UAE market.",
    heading: "Cosmetics supply for UAE businesses",
    paragraphs: [
      "Our catalogue includes skincare, hair care, makeup, fragrances and personal care products. Availability, packaging and order quantities can be discussed with our team based on your business requirements.",
      "We also support international enquiries from companies sourcing cosmetics through Dubai. Contact us with the products, quantities and delivery destination you are considering so we can respond with the relevant information."
    ],
    links: ["/cosmetics-wholesaler-uae", "/skincare-wholesale-uae", "/hair-care-supplier-uae"]
  },
  wholesaler: {
    path: "/cosmetics-wholesaler-uae",
    eyebrow: "WHOLESALE COSMETICS",
    title: "Cosmetics Wholesaler in the UAE",
    description: "Source cosmetics wholesale products in the UAE from GOSAFE COSMETICS, including skincare, hair care, makeup and personal care ranges for business buyers.",
    intro: "GOSAFE COSMETICS works with retailers, resellers and distributors looking for cosmetics wholesale supply in the UAE. Our team can help you review available products and discuss an enquiry suited to your business.",
    heading: "Wholesale cosmetics categories",
    paragraphs: [
      "Choose from everyday skincare, hair care, makeup and personal care products. Product pages include descriptions and specifications where available, while current pricing and availability are confirmed directly for each enquiry.",
      "For a wholesale quotation, send us the product names or categories you need, estimated quantities and delivery location. This gives our team the information needed to prepare a useful response."
    ],
    links: ["/products", "/cosmetics-supplier-dubai-uae", "/makeup-wholesale-dubai"]
  },
  distributor: {
    path: "/cosmetics-distributor-dubai",
    eyebrow: "COSMETICS DISTRIBUTION",
    title: "Cosmetics Distributor in Dubai",
    description: "GOSAFE COSMETICS supports cosmetics distribution enquiries from Dubai for retailers, wholesalers and businesses sourcing products in the UAE and international markets.",
    intro: "Businesses searching for a cosmetics distributor in Dubai can contact GOSAFE COSMETICS for product sourcing and supply enquiries. We serve customers who need a responsive point of contact for cosmetics and personal care products.",
    heading: "Supply support for distributors and retailers",
    paragraphs: [
      "We can discuss product categories, pack sizes, order requirements and destination markets before you place an enquiry. This helps businesses identify suitable products for their retail or distribution plans.",
      "Our catalogue is designed for business customers rather than one-off consumer purchases. Browse the product range and contact our team for current availability and commercial details."
    ],
    links: ["/products", "/cosmetics-wholesaler-uae", "/contact"]
  },
  skincare: {
    path: "/skincare-wholesale-uae",
    eyebrow: "SKINCARE WHOLESALE UAE",
    title: "Skincare Wholesale Supplier in the UAE",
    description: "Find skincare products for wholesale supply in the UAE from GOSAFE COSMETICS, including facial skincare and hydration products for retailers and distributors.",
    intro: "GOSAFE COSMETICS supplies skincare products for UAE retailers, resellers, distributors and other business customers. Our skincare range is suitable for companies reviewing products for wholesale and commercial supply.",
    heading: "Skincare products for business supply",
    paragraphs: [
      "Our skincare catalogue includes products such as hydrating facial serums and other personal care items. Each product page provides the available description, category and specifications so you can shortlist products for your enquiry.",
      "For current stock, pricing and order information, contact GOSAFE COSMETICS with the products and quantities you require. We will confirm the details relevant to your UAE or international destination."
    ],
    links: ["/products?category=Skincare", "/cosmetics-supplier-dubai-uae", "/contact"]
  },
  hairCare: {
    path: "/hair-care-supplier-uae",
    eyebrow: "HAIR CARE SUPPLIER UAE",
    title: "Hair Care Products Supplier in the UAE",
    description: "GOSAFE COSMETICS supplies hair care products for wholesale enquiries in the UAE, including hair oils and personal care products for retailers and distributors.",
    intro: "GOSAFE COSMETICS helps UAE businesses source hair care products for retail, resale and distribution. We work with customers who need product information and a direct route to discuss commercial supply.",
    heading: "Hair care supply for retailers and distributors",
    paragraphs: [
      "Browse our hair care products to review descriptions, product codes and available specifications. Hair care enquiries can include individual products or a broader range for your business catalogue.",
      "Tell us your required quantities, destination and preferred products when you contact us. Our team can then provide the latest availability and wholesale information."
    ],
    links: ["/products?category=Hair%20Care", "/cosmetics-wholesaler-uae", "/contact"]
  },
  makeup: {
    path: "/makeup-wholesale-dubai",
    eyebrow: "MAKEUP WHOLESALE DUBAI",
    title: "Makeup Products Wholesale in Dubai",
    description: "Source makeup products for wholesale in Dubai from GOSAFE COSMETICS, including makeup ranges for retailers, resellers and cosmetics distributors.",
    intro: "GOSAFE COSMETICS supports makeup wholesale enquiries from Dubai and the wider UAE. Our catalogue gives business buyers a starting point for reviewing makeup products and requesting commercial information.",
    heading: "Makeup supply for UAE businesses",
    paragraphs: [
      "Product information, codes and available specifications are shown on the makeup product pages. Use the catalogue to identify products that may fit your retail or distribution range.",
      "Contact our team with the product names, quantities and delivery requirements you are considering. We will respond with current availability and the next steps for your enquiry."
    ],
    links: ["/products?category=Makeup", "/cosmetics-supplier-dubai-uae", "/contact"]
  }
};
function SeoLandingPage({ page }) {
  const d = useData();
  const relatedProducts = d.products.filter((product) =>
    page.path.includes("skincare")
      ? normalizeCategory(product.category) === "skincare"
      : page.path.includes("hair-care")
      ? normalizeCategory(product.category) === "haircare"
      : page.path.includes("makeup")
      ? normalizeCategory(product.category) === "makeup"
      : false
  );
  return (
    <Layout>
      <SEO title={page.title} description={page.description} path={page.path} />
      <main className="page seo-page">
        <div className="container narrow">
          <span className="eyebrow">{page.eyebrow}</span>
          <h1>{page.title}</h1>
          <p className="lead">{page.intro}</p>
          <section className="seo-copy">
            <h2>{page.heading}</h2>
            {page.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
          {relatedProducts.length > 0 && (
            <section className="seo-products">
              <h2>Products in this category</h2>
              <div className="product-grid">
                {relatedProducts.map((product) => <ProductCard key={product.id} p={product} />)}
              </div>
            </section>
          )}
          <section className="seo-links">
            <h2>Explore more</h2>
            <div>
              {page.links.map((link) => <Link className="btn secondary" key={link} to={link}>{link === "/contact" ? "Contact our team" : link.includes("products") ? "Browse products" : "View related supply services"}</Link>)}
            </div>
          </section>
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
      <SEO title={`${p.name} | Wholesale Cosmetics`} description={`${p.description} Available from GOSAFE COSMETICS for wholesale cosmetics supply in Dubai, UAE and international markets.`} path={`/products/${p.id}`} type="product" product={p} />
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
            Your signed-in email is not authorized to access this dashboard.<span>
               contact Shanul for access +971 54 177 5152.
            </span>
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
  const [productCategory, setProductCategory] = useState("");
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
            category: productCategory || d.categories[0] || "Skincare",
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
  const goBack = () => {
    if (editing) {
      setEditing(null);
      setForm(null);
      return;
    }
    setTab("dashboard");
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
          ["categories", Tag, "Categories"],
          ["offers", Tag, "Offers"],
          ["branding", Settings, "Company & Branding"],
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
          <div className="admin-heading">
            {(tab !== "dashboard" || editing) && (
              <button
                className="admin-back"
                onClick={goBack}
                aria-label="Go back"
                title="Go back"
              >
                <ArrowLeft size={19} />
              </button>
            )}
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
                <div className="admin-category-filter">
                  <button
                    className={!productCategory ? "active" : ""}
                    onClick={() => setProductCategory("")}
                  >
                    <b>All Products</b>
                    <span>{d.products.length} products</span>
                  </button>
                  {d.categories.map((category) => {
                    const count = d.products.filter(
                      (product) =>
                        normalizeCategory(product.category) ===
                        normalizeCategory(category)
                    ).length;
                    return (
                      <button
                        key={category}
                        className={
                          normalizeCategory(productCategory) ===
                          normalizeCategory(category)
                            ? "active"
                            : ""
                        }
                        onClick={() => setProductCategory(category)}
                      >
                        <b>{category}</b>
                        <span>{count} product{count === 1 ? "" : "s"}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="admin-actions">
                  <button
                    className="btn primary"
                    onClick={() => editProduct(null)}
                  >
                    <Plus /> Add Product{productCategory ? ` to ${productCategory}` : ""}
                  </button>
                </div>
                <div className="admin-table">
                  {d.products
                    .filter(
                      (product) =>
                        !productCategory ||
                        normalizeCategory(product.category) ===
                          normalizeCategory(productCategory)
                    )
                    .map((p) => (
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
                  {!d.products.some(
                    (product) =>
                      !productCategory ||
                      normalizeCategory(product.category) ===
                        normalizeCategory(productCategory)
                  ) && <div className="empty">No products in this category.</div>}
                </div>
              </>
            )}
          </>
        )}
        {tab === "offers" && <OffersAdmin d={d} update={update} />}{" "}
        {tab === "branding" && <BrandingAdmin d={d} update={update} />}{" "}
        {tab === "jobs" && <JobsAdmin d={d} update={update} />}{" "}
        {tab === "categories" && <CategoriesAdmin d={d} update={update} />}
        {tab === "messages" && <MessagesAdmin d={d} />}
      </section>
    </div>
  );
}
function CategoriesAdmin({ d, update }) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");

  const startEditing = (category = "") => {
    setEditingCategory(category || "new");
    setName(category);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setName("");
  };

  const saveCategory = () => {
    const nextName = name.trim();
    if (!nextName) {
      alert("Please enter a category name.");
      return;
    }

    const duplicate = d.categories.some(
      (category) =>
        category.toLowerCase() === nextName.toLowerCase() &&
        category !== editingCategory
    );
    if (duplicate) {
      alert("This category already exists.");
      return;
    }

    if (editingCategory === "new") {
      update({ categories: [...d.categories, nextName] });
    } else {
      update({
        categories: d.categories.map((category) =>
          category === editingCategory ? nextName : category
        ),
        products: d.products.map((product) =>
          product.category === editingCategory
            ? { ...product, category: nextName }
            : product
        ),
      });
    }
    cancelEditing();
  };

  const deleteCategory = (category) => {
    const assignedProducts = d.products.filter(
      (product) => product.category === category
    );
    if (assignedProducts.length) {
      alert(
        `Cannot delete "${category}" because ${assignedProducts.length} product${
          assignedProducts.length === 1 ? " is" : "s are"
        } assigned to it. Edit those products first.`
      );
      return;
    }
    if (confirm(`Delete the "${category}" category?`)) {
      update({ categories: d.categories.filter((item) => item !== category) });
    }
  };

  return (
    <div className="category-admin">
      {editingCategory ? (
        <div className="form-card category-form">
          <h2>{editingCategory === "new" ? "Add Category" : "Edit Category"}</h2>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && saveCategory()}
            placeholder="Category name"
          />
          <div className="editor-actions">
            <button className="btn secondary" onClick={cancelEditing}>
              Cancel
            </button>
            <button className="btn primary" onClick={saveCategory}>
              <Save /> Save Category
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-actions">
          <button className="btn primary" onClick={() => startEditing()}>
            <Plus /> Add Category
          </button>
        </div>
      )}
      <div className="admin-table category-table">
        {d.categories.map((category) => {
          const productCount = d.products.filter(
            (product) => product.category === category
          ).length;
          return (
            <div className="category-row" key={category}>
              <div>
                <b>{category}</b>
                <span>
                  {productCount} product{productCount === 1 ? "" : "s"}
                </span>
              </div>
              <div className="row-actions">
                <button
                  onClick={() => startEditing(category)}
                  aria-label={`Edit ${category}`}
                >
                  <Edit3 />
                </button>
                <button
                  onClick={() => deleteCategory(category)}
                  aria-label={`Delete ${category}`}
                >
                  <Trash2 />
                </button>
              </div>
            </div>
          );
        })}
      </div>
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
      <Route path={seoPages.supplier.path} element={<SeoLandingPage page={seoPages.supplier} />} />
      <Route path={seoPages.wholesaler.path} element={<SeoLandingPage page={seoPages.wholesaler} />} />
      <Route path={seoPages.distributor.path} element={<SeoLandingPage page={seoPages.distributor} />} />
      <Route path={seoPages.skincare.path} element={<SeoLandingPage page={seoPages.skincare} />} />
      <Route path={seoPages.hairCare.path} element={<SeoLandingPage page={seoPages.hairCare} />} />
      <Route path={seoPages.makeup.path} element={<SeoLandingPage page={seoPages.makeup} />} />
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
