import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Bell,
  Check,
  Clock3,
  CreditCard,
  Heart,
  Info,
  MapPin,
  Minus,
  Pencil,
  Package,
  Phone,
  Plus,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Trash2,
  LogOut,
  Truck,
  User,
  Utensils,
  Wallet,
  X,
} from 'lucide-react';
import logoBlackCat from './assets/images/logo-blackcat.jpeg';
import './index.css';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  available?: boolean;
  badge?: string;
};

type CartItem = Product & {
  quantity: number;
  extras?: string[];
  removed?: string[];
};

const images = {
  burger: 'https://images.pexels.com/photos/18713424/pexels-photo-18713424.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  burgerTwo: 'https://images.pexels.com/photos/12325122/pexels-photo-12325122.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  burgerThree: 'https://images.pexels.com/photos/28376179/pexels-photo-28376179.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  burgerFour: 'https://images.pexels.com/photos/20652774/pexels-photo-20652774.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  meal: 'https://images.pexels.com/photos/34130182/pexels-photo-34130182.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  beans: 'https://images.pexels.com/photos/32655177/pexels-photo-32655177.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  wings: 'https://images.pexels.com/photos/34284708/pexels-photo-34284708.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const emojiImage = (emoji: string, bg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="${bg}"/><text x="50" y="50" font-size="52" text-anchor="middle" dominant-baseline="central">${emoji}</text></svg>`)}`;

const products: Product[] = [
  { id: 'artesanal', name: 'Hambúrguer Artesanal', description: 'Pão brioche, 120g de picanha, cheddar e molho especial', price: 19, image: images.burger, category: 'Promoção', badge: 'Destaque' },
  { id: 'milkshake', name: 'Milkshake', description: 'Milkshake vários sabores', price: 9.99, image: images.beans, category: 'Promoção', available: false, badge: 'Indisponível' },
  { id: 'pastel', name: 'Pastel', description: 'Pastel crocante e sequinho', price: 6, image: images.wings, category: 'Promoção', available: false, badge: 'Indisponível' },
  { id: 'hotdog', name: 'HOT DOG', description: 'Cachorro-quente completo', price: 17.5, originalPrice: 20, image: images.burgerFour, category: 'Promoção', badge: '-13%' },
  { id: 'blackcat', name: 'Black Cat Burger', description: 'Pão brioche, 180g de carne, cheddar, bacon e molho especial', price: 32.9, image: images.burgerTwo, category: 'Hambúrgueres' },
  { id: 'cheddar', name: 'Cheddar Bacon', description: 'Carne 160g, cheddar, bacon crocante e cebola caramelizada', price: 28.9, image: images.burgerThree, category: 'Hambúrgueres' },
  { id: 'classico', name: 'Clássico', description: 'Carne 150g, queijo, alface, tomate e molho especial', price: 24.9, image: images.burger, category: 'Hambúrgueres' },
  { id: 'smash', name: 'Smash Burger', description: 'Dois smash 90g, cheddar, pickles e molho da casa', price: 29.9, image: images.burgerFour, category: 'Hambúrgueres' },
  { id: 'marmita', name: 'Marmita', description: 'Arroz, carne e salada', price: 18, originalPrice: 20, image: images.meal, category: 'Refeições', badge: '-10%' },
  { id: 'batata-grande', name: 'Batata Frita', description: 'Porção crocante com sal e páprica', price: 22, image: emojiImage('🍟', '#fff3d6'), category: 'Porções' },
  { id: 'onion-porcao', name: 'Onion Rings', description: 'Anéis de cebola empanados, 10 unidades', price: 24, image: emojiImage('🧅', '#f1e6ff'), category: 'Porções' },
  { id: 'nuggets', name: 'Nuggets', description: '12 unidades com molho barbecue', price: 26, image: emojiImage('🍗', '#ffeacc'), category: 'Porções' },
  { id: 'calabresa', name: 'Calabresa Acebolada', description: 'Calabresa fatiada com cebola e pão', price: 29, image: emojiImage('🌭', '#ffe3e5'), category: 'Porções' },
  { id: 'coca', name: 'Refrigerante Lata', description: '350ml gelado', price: 6, image: emojiImage('🥤', '#ffe3e5'), category: 'Bebidas' },
  { id: 'suco-laranja', name: 'Suco de Laranja', description: 'Natural, 400ml', price: 9, image: emojiImage('🍊', '#ffeacc'), category: 'Bebidas' },
  { id: 'agua', name: 'Água Mineral', description: 'Sem gás, 500ml', price: 4, image: emojiImage('💧', '#dff1ff'), category: 'Bebidas' },
  { id: 'cerveja', name: 'Cerveja Long Neck', description: '330ml bem gelada', price: 11, image: emojiImage('🍺', '#fff3d6'), category: 'Bebidas' },
  { id: 'brownie', name: 'Brownie', description: 'Brownie de chocolate com sorvete', price: 16, image: emojiImage('🍫', '#efe0d6'), category: 'Sobremesas' },
  { id: 'sorvete', name: 'Sundae', description: 'Sorvete de creme com calda', price: 12, image: emojiImage('🍨', '#ffe3f1'), category: 'Sobremesas' },
  { id: 'churros', name: 'Churros', description: 'Recheado com doce de leite', price: 10, image: emojiImage('🥖', '#fff0cf'), category: 'Sobremesas' },
  { id: 'pudim', name: 'Pudim', description: 'Fatia de pudim de leite', price: 9, image: emojiImage('🍮', '#fff3d6'), category: 'Sobremesas' },
];


const suggestions: Product[] = [
  { id: 'batata', name: 'Batata frita', description: 'Porção individual crocante', price: 12, image: emojiImage('🍟', '#fff3d6'), category: 'Acompanhamentos' },
  { id: 'refri', name: 'Refrigerante lata', description: '350ml gelado', price: 6, image: emojiImage('🥤', '#ffe3e5'), category: 'Bebidas' },
  { id: 'suco', name: 'Suco natural', description: 'Laranja 300ml', price: 8, image: emojiImage('🍊', '#ffeacc'), category: 'Bebidas' },
  { id: 'onion', name: 'Onion rings', description: 'Anéis de cebola empanados', price: 14, image: emojiImage('🧅', '#f1e6ff'), category: 'Acompanhamentos' },
];

const ingredients = [
  { id: 'pao', name: 'Pão brioche', description: 'Base do lanche', removable: false },
  { id: 'carne-base', name: 'Carne grelhada', description: 'Ingrediente principal', removable: false },
  { id: 'queijo', name: 'Queijo', description: 'Fatia de cheddar', removable: true },
  { id: 'alface', name: 'Alface', description: 'Folhas frescas', removable: true },
  { id: 'tomate', name: 'Tomate', description: 'Fatias de tomate', removable: true },
  { id: 'cebola', name: 'Cebola', description: 'Cebola roxa em rodelas', removable: true },
  { id: 'picles', name: 'Picles', description: 'Pepino em conserva', removable: true },
  { id: 'molho', name: 'Molho especial', description: 'Molho da casa', removable: true },
];

const extras = [
  { id: 'carne', name: 'Carne extra', description: 'Mais carne na sua marmita', price: 2 },
  { id: 'arroz', name: 'Arroz extra', description: 'Mais arroz na sua marmita', price: 10 },
  { id: 'talheres', name: 'Talheres descartáveis', description: 'Garfo e faca', price: 0 },
];

const formatPrice = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

type Profile = { name: string; phone: string; cep: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string; reference: string };
const SessionContext = createContext<{ user: Profile | null; cartCount: number; openAccount: () => void; openOrders: () => void; openHome: () => void; openCart: () => void }>({ user: null, cartCount: 0, openAccount: () => undefined, openOrders: () => undefined, openHome: () => undefined, openCart: () => undefined });
const SESSION_KEY = 'blackcat-user';
const loadUser = (): Profile | null => { try { const raw = sessionStorage.getItem(SESSION_KEY); return raw ? JSON.parse(raw) as Profile : null; } catch { return null; } };
const shortAddress = (user: Profile) => `${user.street}, ${user.number}${user.neighborhood ? ` - ${user.neighborhood}` : ''}`;

function Logo() {
  return <img className="brand-mark" src={logoBlackCat} alt="Black Cat" />;
}

function Header({ cartCount, onCart, onHome }: { cartCount: number; onCart: () => void; onHome: () => void }) {
  const { user, openAccount, openOrders } = useContext(SessionContext);
  const [locationOpen, setLocationOpen] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!locationOpen) return;
    const close = (event: MouseEvent | KeyboardEvent) => { if (event instanceof KeyboardEvent ? event.key === 'Escape' : !locationRef.current?.contains(event.target as Node)) setLocationOpen(false); };
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', close); };
  }, [locationOpen]);
  return (
    <header className="topbar">
      <button className="brand" onClick={onHome}><Logo /><span>Black Cat</span></button>
      <div className="topbar-actions">
        <div className="location-wrap" ref={locationRef}><button className="location" onClick={() => setLocationOpen(open => !open)} aria-expanded={locationOpen}><MapPin size={16} /> <span className="location-text">{user && user.street ? shortAddress(user) : 'Minha localização'}</span> <span>⌄</span></button>{locationOpen && <div className="location-popover">{user && user.street ? <><p className="eyebrow">ENTREGAR EM</p><strong>{user.street}, {user.number}{user.complement ? ` - ${user.complement}` : ''}</strong><span>{user.neighborhood} · {user.city}/{user.state}</span><span>CEP {user.cep}</span>{user.reference && <small>Ref.: {user.reference}</small>}<button className="primary-button" onClick={() => { setLocationOpen(false); openAccount(); }}><Pencil size={14} /> Alterar endereço</button></> : <><p className="eyebrow">ENTREGAR EM</p><strong>Onde você quer receber?</strong><span>Entre com seu telefone para usar seu endereço salvo ou cadastre um novo.</span><button className="primary-button" onClick={() => { setLocationOpen(false); openAccount(); }}><MapPin size={14} /> Informar endereço</button></>}</div>}</div>
        <button className="icon-button user-button" onClick={openAccount}><User size={19} /><span className="desktop-only">{user ? user.name.split(' ')[0] : 'Entrar'}</span></button>
        <button className="icon-button" onClick={openOrders}><ReceiptText size={19} /><span className="desktop-only">Pedidos</span></button>
        <button className="icon-button cart-button" onClick={onCart}><ShoppingCart size={21} /><span className="cart-badge">{cartCount}</span></button>
      </div>
    </header>
  );
}

function QuantityControl({ quantity, onDecrease, onIncrease }: { quantity: number; onDecrease: () => void; onIncrease: () => void }) {
  return <div className="quantity-control"><button onClick={onDecrease} aria-label="Diminuir"><Minus size={14} /></button><strong>{quantity}</strong><button onClick={onIncrease} aria-label="Aumentar"><Plus size={14} /></button></div>;
}

function CartCard({ items, onChange, onRemove, onCheckout, mobile = false }: { items: CartItem[]; onChange: (id: string, amount: number) => void; onRemove: (id: string) => void; onCheckout?: () => void; mobile?: boolean }) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <section className={`cart-card ${mobile ? 'mobile-cart' : ''}`}>
    <div className="card-heading"><div><p className="eyebrow">PEDIDO ATUAL</p><h2>Seu pedido</h2></div>{items.length > 0 && <button className="text-button"><Trash2 size={15} /> Limpar</button>}</div>
    {items.length === 0 ? <div className="empty-cart"><ShoppingBag size={28} /><strong>Seu carrinho está vazio</strong><span>Adicione um item delicioso para começar.</span></div> : <>
      <div className="cart-items">{items.map(item => <div className="cart-item" key={item.id}>
        <img src={item.image} alt={item.name} /><div className="cart-item-main"><div className="cart-item-title"><strong>{item.name}</strong><button onClick={() => onRemove(item.id)} aria-label="Remover item"><X size={14} /></button></div>{(item.extras?.length || item.removed?.length) ? <small>{[...(item.extras || []), ...(item.removed || []).map(name => `sem ${name.toLowerCase()}`)].join(', ')}</small> : null}<div className="cart-item-bottom"><QuantityControl quantity={item.quantity} onDecrease={() => onChange(item.id, -1)} onIncrease={() => onChange(item.id, 1)} /><strong>{formatPrice(item.price * item.quantity)}</strong></div></div>
      </div>)}</div>
      <div className="totals"><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Taxa de entrega <Info size={13} /></span><strong>{formatPrice(items.length ? 5 : 0)}</strong></div><hr /><div className="total-line"><span>Total</span><strong>{formatPrice(subtotal + (items.length ? 5 : 0))}</strong></div></div>
      <button className="primary-button" onClick={onCheckout}>Revisar e continuar <ArrowRight size={17} /></button>
    </>}
  </section>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);
  return <div className="modal-overlay" onMouseDown={onClose}><div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={event => event.stopPropagation()}><div className="modal-header"><h2>{title}</h2><button className="modal-close" onClick={onClose} aria-label="Fechar"><X size={18} /></button></div>{children}</div></div>;
}

const storeInfo = { address: 'Rua Augusta, 1200 - Consolação', city: 'São Paulo - SP', cep: '01304-001', phone: '(11) 3000-0000', reference: 'Próximo ao Parque Augusta' };
const storeHours = [
  { day: 'Domingo', hours: '17:00 – 23:00' },
  { day: 'Segunda-feira', hours: 'Fechado' },
  { day: 'Terça-feira', hours: '17:00 – 23:30' },
  { day: 'Quarta-feira', hours: '17:00 – 23:30' },
  { day: 'Quinta-feira', hours: '17:00 – 23:30' },
  { day: 'Sexta-feira', hours: '17:00 – 00:30' },
  { day: 'Sábado', hours: '12:00 – 00:30' },
];

function Hero({ onDetails }: { onDetails: (product: Product) => void }) {
  const [modal, setModal] = useState<'location' | 'hours' | null>(null);
  const today = new Date().getDay();
  return <section className="hero">
    <img src={images.burger} alt="Hambúrguer gourmet do Black Cat" />
    <div className="hero-shade" />
    <img className="hero-logo" src={logoBlackCat} alt="" />
    <div className="hero-content"><div className="status-pill"><span /> Aberto agora</div><h1>Black Cat</h1><p>Burgers, porções e muito mais</p><div className="hero-links"><button type="button" className="static"><Package size={16} /> Entrega e retirada</button><button type="button" onClick={() => setModal('location')}><MapPin size={16} /> Ver localização</button><button type="button" onClick={() => setModal('hours')}><Clock3 size={16} /> Ver horários</button></div></div>
    <div className="hero-info"><div><Sparkles size={17} /><strong>4,8</strong><span>avaliação média</span></div><div><Clock3 size={17} /><strong>30–45 min</strong><span>tempo de entrega</span></div><div><ShoppingBag size={17} /><strong>Entrega</strong><span>verifique sua região</span></div></div>
    {modal === 'location' && <Modal title="Localização" onClose={() => setModal(null)}><div className="modal-body"><div className="modal-row"><MapPin size={18} /><div><strong>{storeInfo.address}</strong><span>{storeInfo.city} · CEP {storeInfo.cep}</span><span>{storeInfo.reference}</span></div></div><div className="modal-row"><Phone size={18} /><div><strong>{storeInfo.phone}</strong><span>Telefone da loja</span></div></div><a className="primary-button" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${storeInfo.address}, ${storeInfo.city}`)}`} target="_blank" rel="noreferrer"><MapPin size={15} /> Abrir no mapa</a></div></Modal>}
    {modal === 'hours' && <Modal title="Horário de funcionamento" onClose={() => setModal(null)}><div className="modal-body"><div className="hours-list">{storeHours.map((item, index) => <div key={item.day} className={`${index === today ? 'today' : ''} ${item.hours === 'Fechado' ? 'closed' : ''}`}><span>{item.day}{index === today && <em>Hoje</em>}</span><b>{item.hours}</b></div>)}</div></div></Modal>}
  </section>;
}

const categories = ['Promoção', 'Hambúrgueres', 'Porções', 'Bebidas', 'Sobremesas', 'Refeições'];
const categoryId = (category: string) => `categoria-${category}`;

function CategoryNav({ active, onSelect }: { active: string; onSelect: (value: string) => void }) {
  const navRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const button = navRef.current?.querySelector<HTMLElement>('button.active');
    const nav = navRef.current;
    if (button && nav) nav.scrollTo({ left: button.offsetLeft - nav.clientWidth / 2 + button.clientWidth / 2, behavior: 'smooth' });
  }, [active]);
  return <div className="category-scroll" ref={navRef}>{categories.map(category => <button key={category} className={active === category ? 'active' : ''} onClick={() => onSelect(category)}>{category}</button>)}</div>;
}

function ProductCard({ product, onAdd, onOpen }: { product: Product; onAdd: (product: Product) => void; onOpen: (product: Product) => void }) {
  return <article className={`product-card ${product.available === false ? 'unavailable' : ''}`} onClick={() => product.available !== false && onOpen(product)}>
    <div className="product-image-wrap"><img src={product.image} alt={product.name} />{product.badge && <span className={`product-badge ${product.available === false ? 'danger' : product.badge.startsWith('-') ? 'discount' : ''}`}>{product.badge}</span>}<button className="quick-add" disabled={product.available === false} onClick={(event) => { event.stopPropagation(); onAdd(product); }} aria-label={`Adicionar ${product.name}`}><Plus size={17} /></button></div>
    <div className="product-copy"><h3>{product.name}</h3><p>{product.description}</p><div className="price-row"><strong>{formatPrice(product.price)}</strong>{product.originalPrice && <del>{formatPrice(product.originalPrice)}</del>}</div></div>
  </article>;
}

function MenuSection({ title, items, onAdd, onOpen }: { title: string; items: Product[]; onAdd: (product: Product) => void; onOpen: (product: Product) => void }) {
  return <section className="menu-section" id={categoryId(title)}><div className="section-heading"><div><span className="section-marker" /><h2>{title}</h2></div></div><div className="product-grid">{items.map(product => <ProductCard key={product.id} product={product} onAdd={onAdd} onOpen={onOpen} />)}</div></section>;
}

const featuredIds = ['blackcat', 'artesanal', 'cheddar', 'smash', 'hotdog', 'marmita'];

function FeaturedSection({ onOpen }: { onOpen: (product: Product) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const resumeTimer = useRef<number>();
  const featured = featuredIds.flatMap(id => products.find(product => product.id === id) || []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const speed = 45;
    let frame = 0;
    let last = performance.now();
    let position = trackRef.current?.scrollLeft || 0;
    let wasPaused = false;
    const tick = (now: number) => {
      const track = trackRef.current;
      const delta = Math.min(now - last, 64);
      last = now;
      if (track) {
        const cards = track.querySelectorAll<HTMLElement>('.featured-card');
        const loop = cards.length > featured.length ? cards[featured.length].offsetLeft - cards[0].offsetLeft : 0;
        if (paused.current) wasPaused = true;
        else {
          if (wasPaused) { position = track.scrollLeft; wasPaused = false; }
          position += (speed * delta) / 1000;
          if (loop > 0 && position >= loop) position -= loop;
          track.scrollLeft = position;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [featured.length]);
  const pause = () => { window.clearTimeout(resumeTimer.current); paused.current = true; };
  const resume = (delay = 0) => { window.clearTimeout(resumeTimer.current); resumeTimer.current = window.setTimeout(() => { paused.current = false; }, delay); };
  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const cards = track.querySelectorAll<HTMLElement>('.featured-card');
    const width = cards[0].offsetWidth + 16;
    const loop = cards[featured.length].offsetLeft - cards[0].offsetLeft;
    pause();
    if (direction === -1 && track.scrollLeft < width) track.scrollLeft += loop;
    track.scrollBy({ left: direction * width, behavior: 'smooth' });
    resume(1200);
  };
  const renderCard = (product: Product, copy: boolean) => <article className="featured-card" key={`${copy ? 'copy-' : ''}${product.id}`} aria-hidden={copy || undefined} onClick={() => onOpen(product)}><img src={product.image} alt={copy ? '' : product.name} /><div className="featured-shade" />{product.badge && <span className="featured-badge">{product.badge}</span>}<div className="featured-info"><h3>{product.name}</h3><p>{product.description}</p><div className="featured-bottom"><div className="featured-price"><strong>{formatPrice(product.price)}</strong>{product.originalPrice && <del>{formatPrice(product.originalPrice)}</del>}</div><button className="featured-button" tabIndex={copy ? -1 : undefined} onClick={event => { event.stopPropagation(); onOpen(product); }} aria-label={`Ver detalhes de ${product.name}`}><Plus size={20} /></button></div></div></article>;
  return <section className="featured-section"><div className="section-heading"><div><span className="section-marker" /><h2>Produtos em destaque</h2></div></div><div className="featured-wrap"><button className="featured-arrow left" onClick={() => step(-1)} aria-label="Produto anterior"><ArrowLeft size={18} /></button><button className="featured-arrow right" onClick={() => step(1)} aria-label="Próximo produto"><ArrowRight size={18} /></button><div className="featured-track" ref={trackRef} onMouseEnter={pause} onMouseLeave={() => resume(0)} onTouchStart={pause} onTouchEnd={() => resume(1800)} onWheel={() => { pause(); resume(1500); }} onFocus={pause} onBlur={() => resume(0)}>{featured.map(product => renderCard(product, false))}{featured.map(product => renderCard(product, true))}</div></div></section>;
}

function Menu({ active, setActive, onAdd, onOpen }: { active: string; setActive: (value: string) => void; onAdd: (product: Product) => void; onOpen: (product: Product) => void }) {
  const locked = useRef(false);
  const lockTimer = useRef<number>();
  useEffect(() => {
    const onScroll = () => {
      if (locked.current) return;
      let current = categories[0];
      for (const category of categories) {
        const element = document.getElementById(categoryId(category));
        if (element && element.getBoundingClientRect().top <= 140) current = category;
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = categories[categories.length - 1];
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [setActive]);
  const select = (category: string) => {
    setActive(category);
    locked.current = true;
    window.clearTimeout(lockTimer.current);
    lockTimer.current = window.setTimeout(() => { locked.current = false; }, 900);
    document.getElementById(categoryId(category))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return <div className="menu-area"><CategoryNav active={active} onSelect={select} />{categories.map(category => <MenuSection key={category} title={category} items={products.filter(product => product.category === category)} onAdd={onAdd} onOpen={onOpen} />)}</div>;
}

function Storefront({ cart, onAdd, onChange, onRemove, onOpen, onCart }: { cart: CartItem[]; onAdd: (product: Product) => void; onChange: (id: string, amount: number) => void; onRemove: (id: string) => void; onOpen: (product: Product) => void; onCart: () => void }) {
  const [active, setActive] = useState('Promoção');
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  return <><Header cartCount={count} onCart={onCart} onHome={() => { setActive('Promoção'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} /><main><Hero onDetails={onOpen} /><div className="featured-full"><FeaturedSection onOpen={onOpen} /></div><div className="store-layout"><Menu active={active} setActive={setActive} onAdd={onAdd} onOpen={onOpen} /><aside><CartCard items={cart} onChange={onChange} onRemove={onRemove} onCheckout={onCart} /></aside></div></main><MobileNav active="home" /></>;
}

function ProductDetail({ product, cart, onAdd, onChange, onRemove, onBack, onCart, initialExtras, initialRemoved }: { product: Product; cart: CartItem[]; onAdd: (product: Product, extras: string[], quantity: number, removed: string[]) => void; onChange: (id: string, amount: number) => void; onRemove: (id: string) => void; onBack: () => void; onCart: () => void; initialExtras?: string[]; initialRemoved?: string[] }) {
  const [removedIds, setRemovedIds] = useState<string[]>(() => ingredients.filter(item => initialRemoved?.includes(item.name)).map(item => item.id));
  const removedNames = ingredients.filter(item => removedIds.includes(item.id)).map(item => item.name);
  const addItem = () => { onAdd(product, extras.filter(extra => selected[extra.id]).map(extra => extra.name), quantity, removedNames); setAdded(true); window.setTimeout(() => setAdded(false), 1800); };
  const toggleIngredient = (id: string) => setRemovedIds(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const [selected, setSelected] = useState<Record<string, number>>(() => Object.fromEntries(extras.filter(extra => initialExtras?.includes(extra.name)).map(extra => [extra.id, 1])));
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const selectedCount = Object.values(selected).reduce((sum, value) => sum + value, 0);
  const extraTotal = extras.reduce((sum, extra) => sum + (selected[extra.id] || 0) * extra.price, 0);
  const itemTotal = (product.price + extraTotal) * quantity;
  const toggleExtra = (id: string) => setSelected(current => { const currentValue = current[id] || 0; if (id !== 'talheres' && currentValue === 0 && selectedCount >= 2) return current; return { ...current, [id]: currentValue ? 0 : 1 }; });
  const changeExtra = (id: string, amount: number) => setSelected(current => { const next = Math.max(0, Math.min(id === 'talheres' ? 1 : 2, (current[id] || 0) + amount)); if (id !== 'talheres' && next > 0 && selectedCount - (current[id] || 0) >= 2) return current; return { ...current, [id]: next }; });
  return <><Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onCart={onCart} onHome={onBack} /><main className="detail-page"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Voltar ao cardápio</button><div className="closed-notice"><Bell size={17} /><div><strong>A loja está fechada no momento.</strong><span>Faça seu pedido mais tarde ou veja outras opções.</span></div></div><div className="detail-layout"><div className="detail-main"><section className="product-detail-card"><div className="detail-image"><img src={product.image} alt={product.name} /><button className="favorite" aria-label="Favoritar"><Heart size={19} /></button><div className="image-dots"><span className="active" /><span /><span /></div></div><div className="detail-copy"><div className="detail-kicker">MAIS PEDIDO</div><h1>{product.name}</h1><p className="detail-subtitle">Arroz, carne e salada</p><div className="rating"><span>★</span> 4,8 <em>(320 avaliações)</em><i /> <strong><Sparkles size={14} /> Mais pedido</strong></div><div className="detail-price"><strong>{formatPrice(product.price)}</strong><del>{formatPrice(product.originalPrice || 20)}</del><span>-10%</span></div><p className="detail-description">Uma refeição completa com arroz, carne grelhada, feijão e salada fresca.</p></div></section><section className="extras-card ingredients-card"><div className="extras-heading"><div className="extras-title"><ShoppingBag size={20} /><div><h2>Ingredientes</h2><span>Remova o que você não quer no seu lanche</span></div></div><div className="extras-meta"><span>{removedNames.length ? `${removedNames.length} removido${removedNames.length > 1 ? 's' : ''}` : 'Nenhum removido'}</span></div></div><div className="extras-list">{ingredients.map(item => { const removed = removedIds.includes(item.id); return <div className={`extra-row ingredient-row ${removed ? 'removed' : ''}`} key={item.id}><div><strong>{item.name}</strong><span>{item.description}</span></div>{item.removable ? <label className="ingredient-toggle"><span>{removed ? `Sem ${item.name.toLowerCase()}` : 'Remover'}</span><button className={`checkbox ${removed ? 'checked' : ''}`} onClick={() => toggleIngredient(item.id)} aria-label={`Remover ${item.name}`}>{removed ? '✓' : ''}</button></label> : <span className="ingredient-fixed">Essencial</span>}</div>; })}</div></section><section className="extras-card"><div className="extras-heading"><div className="extras-title"><Utensils size={20} /><div><h2>Adicionais</h2><span>Escolha até 2 opções</span></div></div><div className="extras-meta"><b>Obrigatório</b><span>{selectedCount} de 2 selecionados</span></div></div><div className="extras-list">{extras.map(extra => <div className="extra-row" key={extra.id}><div><strong>{extra.name}</strong><span>{extra.description}</span></div><strong className="extra-price">{formatPrice(extra.price)}</strong>{extra.id === 'talheres' ? <button className={`checkbox ${selected[extra.id] ? 'checked' : ''}`} onClick={() => toggleExtra(extra.id)} aria-label="Selecionar talheres">{selected[extra.id] ? '✓' : ''}</button> : <QuantityControl quantity={selected[extra.id] || 0} onDecrease={() => changeExtra(extra.id, -1)} onIncrease={() => changeExtra(extra.id, 1)} />}</div>)}</div></section></div><aside className="detail-side"><CartCard items={cart} onChange={onChange} onRemove={onRemove} onCheckout={onCart} /><section className="choice-card"><div className="card-heading"><div><p className="eyebrow">PERSONALIZE SEU PRATO</p><h2>Sua escolha</h2></div></div><div className="choice-list"><div><span>{product.name} <small>preço base</small></span><strong>{formatPrice(product.price)}</strong></div>{extras.map(extra => selected[extra.id] ? <div key={extra.id}><span>{extra.name}</span><strong>{formatPrice(extra.price * selected[extra.id])}</strong></div> : null)}{removedNames.map(name => <div className="choice-removed" key={name}><span>Sem {name.toLowerCase()}</span><strong>—</strong></div>)}</div><div className="choice-total"><span>Total do item</span><strong>{formatPrice(itemTotal)}</strong></div><button className="primary-button" onClick={addItem}>{added ? <><Check size={17} /> Adicionado ao carrinho</> : <><ShoppingCart size={17} /> Adicionar ao carrinho <span>• {formatPrice(itemTotal)}</span></>}</button></section></aside></div></main><div className="mobile-purchase"><QuantityControl quantity={quantity} onDecrease={() => setQuantity(value => Math.max(1, value - 1))} onIncrease={() => setQuantity(value => value + 1)} /><button className="primary-button" onClick={addItem}>Adicionar <span>• {formatPrice(itemTotal)}</span></button></div></>;
}

function MobileNav({ active }: { active: 'home' | 'cart' | 'orders' | 'account' }) {
  const { user, cartCount, openHome, openCart, openOrders, openAccount } = useContext(SessionContext);
  const items = [
    { id: 'home' as const, label: 'Cardápio', icon: <Utensils size={21} />, action: openHome },
    { id: 'cart' as const, label: 'Carrinho', icon: <ShoppingCart size={21} />, action: openCart, badge: cartCount },
    { id: 'orders' as const, label: 'Pedidos', icon: <ReceiptText size={21} />, action: openOrders },
    { id: 'account' as const, label: user ? user.name.split(' ')[0] : 'Entrar', icon: <User size={21} />, action: openAccount },
  ];
  return <nav className="mobile-nav" aria-label="Navegação principal">{items.map(item => <button key={item.id} className={active === item.id ? 'active' : ''} onClick={item.action}><span className="nav-icon">{item.icon}{item.badge ? <b>{item.badge}</b> : null}</span><span>{item.label}</span></button>)}</nav>;
}

type CheckoutStep = 'cart' | 'delivery' | 'confirmation';
type DeliveryForm = { name: string; phone: string; method: 'pickup' | 'delivery' | ''; cep: string; street: string; number: string; complement: string; neighborhood: string; city: string; state: string; reference: string; notes: string; payment: 'pix' | 'credit' | 'debit' | 'cash'; change: string };

const deliveryDefaults: DeliveryForm = { name: '', phone: '', method: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', reference: '', notes: '', payment: 'pix', change: '' };

function StepIndicator({ step }: { step: CheckoutStep }) {
  const steps: { id: CheckoutStep; label: string }[] = [{ id: 'cart', label: 'Carrinho' }, { id: 'delivery', label: 'Entrega' }, { id: 'confirmation', label: 'Confirmação' }];
  const current = steps.findIndex(item => item.id === step);
  return <div className="step-indicator">{steps.map((item, index) => <div className={`step ${index <= current ? 'done' : ''} ${item.id === step ? 'current' : ''}`} key={item.id}><span>{index < current ? <Check size={13} /> : index + 1}</span><strong>{item.label}</strong>{index < steps.length - 1 && <i />}</div>)}</div>;
}

function OrderSummary({ cart, deliveryFee, discount, onContinue }: { cart: CartItem[]; deliveryFee: number | null; discount: number; onContinue?: () => void }) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (deliveryFee ?? 0) - discount;
  return <section className="checkout-summary"><div className="summary-title"><p className="eyebrow">RESUMO DO PEDIDO</p><h2>Seu pedido</h2></div><div className="summary-items">{cart.map(item => <div className="summary-item" key={item.id + (item.extras || []).join() + (item.removed || []).join()}><img src={item.image} alt="" /><div><strong>{item.quantity}x {item.name}</strong>{(item.extras?.length || item.removed?.length) ? <small>{[...(item.extras || []), ...(item.removed || []).map(name => `sem ${name.toLowerCase()}`)].join(', ')}</small> : null}</div><b>{formatPrice(item.price * item.quantity)}</b></div>)}</div><div className="summary-totals"><div><span>Subtotal</span><b>{formatPrice(subtotal)}</b></div><div><span>Entrega</span><b>{deliveryFee === null ? 'A calcular' : deliveryFee ? formatPrice(deliveryFee) : 'Grátis'}</b></div>{discount > 0 && <div className="discount-line"><span>Desconto</span><b>- {formatPrice(discount)}</b></div>}<hr /><div className="grand-total"><span>Total</span><b>{formatPrice(total)}</b></div></div>{onContinue && <button className="primary-button" onClick={onContinue}>Avançar <ArrowRight size={16} /></button>}</section>;
}

function CartPage({ cart, discount, setDiscount, onChange, onRemove, onClear, onContinue, onEdit, onBack, onAdd }: { onAdd: (product: Product) => void; cart: CartItem[]; discount: number; setDiscount: (value: number) => void; onChange: (id: string, amount: number) => void; onRemove: (id: string) => void; onClear: () => void; onContinue: () => void; onEdit: (item: CartItem) => void; onBack: () => void }) {
  const [coupon, setCoupon] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const applyCoupon = () => { if (coupon.trim().toUpperCase() === 'BLACKCAT10') { setDiscount(subtotal * 0.1); setCouponMessage('Cupom aplicado: 10% de desconto.'); } else { setDiscount(0); setCouponMessage('Digite o cupom BLACKCAT10 para aplicar o desconto.'); } };
  return <><Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onCart={() => undefined} onHome={onBack} /><main className="checkout-page"><button className="back-button mobile-back" onClick={onBack}><ArrowLeft size={17} /> Voltar ao cardápio</button><StepIndicator step="cart" /><div className="page-title-row"><div><p className="eyebrow">BLACK CAT</p><h1>Seu carrinho</h1><p>{cart.length ? `${cart.length} itens selecionados para o seu pedido` : 'Confira seus itens antes de continuar'}</p></div>{cart.length > 0 && <button className="text-button" onClick={onClear}><Trash2 size={15} /> Limpar carrinho</button>}</div>{cart.length === 0 ? <div className="checkout-empty"><ShoppingBag size={34} /><h2>Seu carrinho está vazio</h2><p>Escolha seus favoritos no cardápio para começar.</p><button className="primary-button" onClick={onBack}>Voltar ao cardápio</button></div> : <div className="cart-page-layout"><section className="cart-products"><div className="cart-list-heading"><span>Itens do pedido</span><b>{formatPrice(subtotal)}</b></div>{cart.map(item => <article className="full-cart-item" key={item.id + (item.extras || []).join()}><img src={item.image} alt={item.name} /><div className="full-cart-content"><div className="full-cart-top"><div><h2>{item.name}</h2><p>{item.description}</p></div><strong>{formatPrice(item.price * item.quantity)}</strong></div>{item.extras?.length ? <div className="cart-extras"><span>Adicionais:</span> {item.extras.join(', ')}</div> : null}{item.removed?.length ? <div className="cart-extras removed"><span>Sem:</span> {item.removed.map(name => name.toLowerCase()).join(', ')}</div> : null}<div className="full-cart-actions"><QuantityControl quantity={item.quantity} onDecrease={() => onChange(item.id, -1)} onIncrease={() => onChange(item.id, 1)} /><button onClick={() => onEdit(item)}><Pencil size={14} /> Editar</button><button onClick={() => onRemove(item.id)} className="remove-action"><Trash2 size={14} /> Remover</button></div></div></article>)}<section className="upsell"><div className="upsell-heading"><h2>Complete seu pedido</h2><span>Peça junto e aproveite</span></div><div className="upsell-grid">{suggestions.map(item => { const inCart = cart.find(c => c.id === item.id); return <article className="upsell-card" key={item.id}><img src={item.image} alt={item.name} /><div className="upsell-info"><strong>{item.name}</strong><span>{item.description}</span><b>{formatPrice(item.price)}</b></div><button className={inCart ? 'added' : ''} onClick={() => onAdd(item)} aria-label={`Adicionar ${item.name}`}>{inCart ? <><Check size={14} /> {inCart.quantity}</> : <><Plus size={14} /> Adicionar</>}</button></article>; })}</div></section></section><aside className="checkout-aside"><OrderSummary cart={cart} deliveryFee={5} discount={0} onContinue={onContinue} /><button className="secondary-button" onClick={onBack}><ArrowLeft size={15} /> Continuar comprando</button></aside></div>} </main><div className="mobile-checkout-bar"><div><span>Total</span><strong>{formatPrice(subtotal + 5)}</strong></div><button className="primary-button" disabled={!cart.length} onClick={onContinue}>Avançar <ArrowRight size={16} /></button></div></>;
}

function Field({ label, value, onChange, placeholder, required = false, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; required?: boolean; type?: string }) { return <label className="field"><span>{label}{required && <em> *</em>}</span><input type={type} value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} /></label>; }

const maskPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : '';
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const knownCustomers: Record<string, Partial<DeliveryForm>> = {
  '21999545771': { name: 'Daniel', cep: '22041-001', street: 'Rua Barata Ribeiro', number: '100', complement: 'Apto 301', neighborhood: 'Copacabana', city: 'Rio de Janeiro', state: 'RJ', reference: 'Próximo ao metrô Siqueira Campos' },
};

const customerStatus = (phone: string): 'idle' | 'found' | 'new' => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 11) return 'idle';
  return knownCustomers[digits] ? 'found' : 'new';
};

function AccountPage({ user, onLogin, onSave, onLogout, onBack }: { user: Profile | null; onLogin: (profile: Profile) => void; onSave: (profile: Profile) => void; onLogout: () => void; onBack: () => void }) {
  const empty: Profile = { name: '', phone: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', reference: '' };
  const [profile, setProfile] = useState<Profile>(user || empty);
  const [error, setError] = useState('');
  const status = customerStatus(profile.phone);
  const update = (key: keyof Profile, value: string) => setProfile({ ...profile, [key]: value });
  const changePhone = (value: string) => {
    const phone = maskPhone(value);
    const next = customerStatus(phone);
    const known = knownCustomers[phone.replace(/\D/g, '')];
    if (next === 'found' && known) { const found = { ...empty, ...known, phone } as Profile; setProfile(found); onLogin(found); }
    else setProfile({ ...empty, phone });
    setError('');
  };
  const save = () => {
    if (status === 'idle') { setError('Digite o telefone completo.'); return; }
    if (!profile.name.trim()) { setError('Informe seu nome.'); return; }
    if (!profile.cep || !profile.street || !profile.number || !profile.neighborhood || !profile.city || !profile.state) { setError('Preencha os campos obrigatórios do endereço.'); return; }
    onSave(profile);
  };
  return <><Header cartCount={0} onCart={() => undefined} onHome={onBack} /><main className="checkout-page account-page"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Voltar ao cardápio</button><div className="page-title-row"><div><p className="eyebrow">MINHA CONTA</p><h1>{user ? `Olá, ${user.name.split(' ')[0]}` : 'Entrar ou cadastrar'}</h1><p>Digite seu telefone para encontrar seu cadastro.</p></div>{user && <button className="logout-button" onClick={onLogout}><LogOut size={15} /> Sair</button>}</div><section className="form-section"><div className="form-section-title"><div><h2>Telefone</h2><p>Usamos o número para localizar seus dados.</p></div><Phone size={20} /></div><div className="field-grid"><Field label="Telefone" required value={profile.phone} onChange={changePhone} placeholder="(00) 00000-0000" type="tel" /></div>{status === 'found' && <div className="customer-found"><Check size={16} /> Cliente encontrado.</div>}{status === 'new' && <div className="customer-new">Não encontramos esse telefone. Preencha seus dados para cadastrar.</div>}</section>{status !== 'idle' && <><section className="form-section"><div className="form-section-title"><div><h2>Seus dados</h2></div><User size={20} /></div><div className="field-grid"><Field label="Nome" required value={profile.name} onChange={value => update('name', value)} placeholder="Como podemos te chamar?" /></div></section><section className="form-section"><div className="form-section-title"><div><h2>Endereço</h2></div><MapPin size={20} /></div><div className="field-grid address-grid"><Field label="CEP" required value={profile.cep} onChange={value => update('cep', value)} placeholder="00000-000" /><Field label="Número" required value={profile.number} onChange={value => update('number', value)} placeholder="Nº" /><Field label="Rua" required value={profile.street} onChange={value => update('street', value)} placeholder="Nome da rua" /><Field label="Complemento" value={profile.complement} onChange={value => update('complement', value)} placeholder="Apto, bloco..." /><Field label="Bairro" required value={profile.neighborhood} onChange={value => update('neighborhood', value)} placeholder="Seu bairro" /><Field label="Cidade" required value={profile.city} onChange={value => update('city', value)} placeholder="Sua cidade" /><Field label="Estado" required value={profile.state} onChange={value => update('state', value)} placeholder="UF" /><Field label="Referência" value={profile.reference} onChange={value => update('reference', value)} placeholder="Perto de..." /></div></section>{error && <div className="form-error">{error}</div>}<div className="account-actions"><button className="primary-button" onClick={save}><Check size={16} /> Salvar</button></div></>}{status === 'idle' && error && <div className="form-error">{error}</div>}</main><MobileNav active="account" /></>;
}

type OrderStatus = 'Recebido' | 'Em preparo' | 'A caminho' | 'Entregue' | 'Cancelado';
type MockOrder = { id: string; date: string; status: OrderStatus; items: { productId: string; quantity: number; extras?: string[] }[]; deliveryFee: number; payment: string };

const mockOrders: MockOrder[] = [
  { id: 'BC-2051', date: 'Hoje, 19:42', status: 'A caminho', items: [{ productId: 'blackcat', quantity: 2 }, { productId: 'batata-grande', quantity: 1 }, { productId: 'coca', quantity: 2 }], deliveryFee: 5, payment: 'Pix' },
  { id: 'BC-2037', date: '12 out, 20:15', status: 'Entregue', items: [{ productId: 'cheddar', quantity: 1, extras: ['Carne extra'] }, { productId: 'suco-laranja', quantity: 1 }], deliveryFee: 5, payment: 'Cartão de crédito' },
  { id: 'BC-2019', date: '05 out, 13:08', status: 'Entregue', items: [{ productId: 'marmita', quantity: 2, extras: ['Arroz extra'] }], deliveryFee: 5, payment: 'Dinheiro' },
  { id: 'BC-1996', date: '28 set, 21:30', status: 'Entregue', items: [{ productId: 'smash', quantity: 2 }, { productId: 'onion-porcao', quantity: 1 }, { productId: 'brownie', quantity: 2 }], deliveryFee: 5, payment: 'Pix' },
  { id: 'BC-1974', date: '20 set, 19:50', status: 'Cancelado', items: [{ productId: 'hotdog', quantity: 3 }], deliveryFee: 5, payment: 'Pix' },
];

const orderSteps: OrderStatus[] = ['Recebido', 'Em preparo', 'A caminho', 'Entregue'];

function OrdersPage({ user, onLogin, onReorder, onBack }: { user: Profile | null; onLogin: () => void; onReorder: (items: { product: Product; quantity: number; extras: string[] }[]) => void; onBack: () => void }) {
  const [openId, setOpenId] = useState<string | null>(mockOrders[0].id);
  const lines = (order: MockOrder) => order.items.flatMap(item => { const product = products.find(entry => entry.id === item.productId); return product ? [{ product, quantity: item.quantity, extras: item.extras || [] }] : []; });
  const totalOf = (order: MockOrder) => lines(order).reduce((sum, line) => sum + line.product.price * line.quantity, 0) + order.deliveryFee;
  const active = mockOrders.filter(order => !['Entregue', 'Cancelado'].includes(order.status));
  const past = mockOrders.filter(order => ['Entregue', 'Cancelado'].includes(order.status));
  const card = (order: MockOrder) => {
    const orderLines = lines(order);
    const open = openId === order.id;
    const step = orderSteps.indexOf(order.status);
    return <article className={`order-card ${open ? 'open' : ''}`} key={order.id}>
      <button className="order-head" onClick={() => setOpenId(open ? null : order.id)}>
        <div className="order-thumbs">{orderLines.slice(0, 3).map(line => <img key={line.product.id} src={line.product.image} alt="" />)}</div>
        <div className="order-meta"><strong>Pedido #{order.id}</strong><span>{order.date} · {orderLines.reduce((sum, line) => sum + line.quantity, 0)} itens</span></div>
        <span className={`order-status ${order.status === 'Entregue' ? 'done' : order.status === 'Cancelado' ? 'canceled' : 'active'}`}>{order.status}</span>
        <b className="order-total">{formatPrice(totalOf(order))}</b>
      </button>
      {open && <div className="order-body">
        {step >= 0 && order.status !== 'Entregue' && <div className="order-track">{orderSteps.map((label, index) => <div key={label} className={index <= step ? 'on' : ''}><span>{index < step ? <Check size={12} /> : index + 1}</span><small>{label}</small></div>)}</div>}
        <div className="order-lines">{orderLines.map(line => <div key={line.product.id}><span>{line.quantity}x {line.product.name}{line.extras.length > 0 && <small> ({line.extras.join(', ')})</small>}</span><b>{formatPrice(line.product.price * line.quantity)}</b></div>)}<div><span>Entrega</span><b>{formatPrice(order.deliveryFee)}</b></div></div>
        <div className="order-foot"><span>Pagamento: {order.payment}</span><button className="secondary-button" onClick={() => onReorder(orderLines)}><ShoppingBag size={15} /> Pedir novamente</button></div>
      </div>}
    </article>;
  };
  return <><Header cartCount={0} onCart={() => undefined} onHome={onBack} /><main className="checkout-page orders-page"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Voltar ao cardápio</button><div className="page-title-row"><div><p className="eyebrow">MEUS PEDIDOS</p><h1>Pedidos</h1><p>{user ? `Acompanhe e repita os pedidos de ${user.name.split(' ')[0]}.` : 'Entre com seu telefone para ver seus pedidos.'}</p></div></div>
    {!user ? <div className="checkout-empty"><ReceiptText size={34} /><h2>Você não está logado</h2><p>Digite seu telefone para ver o histórico de pedidos.</p><button className="primary-button" onClick={onLogin}>Entrar</button></div> : <>
      {active.length > 0 && <section className="orders-group"><h2>Em andamento</h2>{active.map(card)}</section>}
      <section className="orders-group"><h2>Anteriores</h2>{past.map(card)}</section></>}
  </main><MobileNav active="orders" /></>;
}

const DELIVERY_FEE = 5;
const FREE_SHIPPING_MIN = 80;
const cartSubtotal = (cart: CartItem[]) => cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
const deliveryFeeFor = (cart: CartItem[]) => cartSubtotal(cart) >= FREE_SHIPPING_MIN ? 0 : DELIVERY_FEE;

function FreeShippingCard({ cart, onShop, addressReady, className = '' }: { cart: CartItem[]; onShop: () => void; addressReady: boolean; className?: string }) {
  const subtotal = cartSubtotal(cart);
  const missing = Math.max(0, FREE_SHIPPING_MIN - subtotal);
  const done = missing === 0;
  const percent = Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100);
  return <div className={`form-section free-shipping ${className} ${done ? 'done' : ''}`}>
    <div className="free-shipping-head"><div><span>Total</span><strong>{formatPrice(subtotal)}</strong></div><span className="free-shipping-tag"><Truck size={15} /> {done ? 'Frete grátis' : addressReady ? `Frete ${formatPrice(DELIVERY_FEE)}` : 'Frete a calcular'}</span></div>
    <div className="free-shipping-bar" role="progressbar" aria-valuemin={0} aria-valuemax={FREE_SHIPPING_MIN} aria-valuenow={Math.min(subtotal, FREE_SHIPPING_MIN)}><div style={{ width: `${percent}%` }} /></div>
    <p>{done ? <><Check size={15} /><span>Parabéns! Você ganhou frete grátis neste pedido.</span></> : <span>Faltam <b>{formatPrice(missing)}</b> para ganhar frete grátis (a partir de {formatPrice(FREE_SHIPPING_MIN)}).</span>}</p>
    {!done && !addressReady && <p className="free-shipping-note">Preencha o endereço de entrega para calcular o valor do frete.</p>}
    <button type="button" className="free-shipping-shop" onClick={onShop}><ShoppingBag size={15} /> Continuar comprando</button>
  </div>;
}

function DeliveryPage({ cart, form, setForm, onBack, onShop, onContinue }: { cart: CartItem[]; form: DeliveryForm; setForm: (form: DeliveryForm) => void; onBack: () => void; onShop: () => void; onContinue: () => void }) {
  const [error, setError] = useState('');
  const update = (key: keyof DeliveryForm, value: string) => setForm({ ...form, [key]: value });
  const status = customerStatus(form.phone);
  const addressReady = !!(form.cep && form.street && form.number && form.neighborhood && form.city && form.state);
  const changePhone = (value: string) => {
    const phone = maskPhone(value);
    const next = customerStatus(phone);
    const blank = { name: '', cep: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '', reference: '' };
    if (next === 'found') setForm({ ...form, ...knownCustomers[phone.replace(/\D/g, '')], phone });
    else if (status === 'found') setForm({ ...form, ...blank, phone });
    else setForm({ ...form, phone });
  };
  const continueDelivery = () => { if (!form.method) { setError('Selecione a forma de recebimento.'); return; } if (status === 'idle') { setError('Informe o telefone completo para continuar.'); return; } if (!form.name.trim()) { setError('Informe seu nome para continuar.'); return; } if (form.method === 'delivery' && (!form.cep || !form.street || !form.number || !form.neighborhood || !form.city || !form.state)) { setError('Preencha os campos obrigatórios do endereço.'); return; } setError(''); onContinue(); };
  return <><Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onCart={() => undefined} onHome={onBack} /><main className="checkout-page"><button className="back-button mobile-back" onClick={onBack}><ArrowLeft size={17} /> Voltar ao carrinho</button><StepIndicator step="delivery" /><div className="page-title-row"><div><p className="eyebrow">ETAPA 2 DE 3</p><h1>Informações para entrega</h1><p>Como podemos entregar seu pedido?</p></div></div><div className="delivery-layout"><section className="delivery-form"><div className="form-section"><div className="form-section-title"><div><h2>Seus dados</h2><p>Usaremos essas informações para falar com você.</p></div><Phone size={20} /></div><div className="field-grid"><Field label="Telefone" required value={form.phone} onChange={changePhone} placeholder="(00) 00000-0000" type="tel" />{status !== 'idle' && <Field label="Nome" required value={form.name} onChange={value => update('name', value)} placeholder="Como podemos te chamar?" />}</div>{status === 'found' && <div className="customer-found"><Check size={16} /> Cliente encontrado.</div>}{status === 'new' && <div className="customer-new">Cliente não encontrado. Preencha os dados para se cadastrar</div>}</div><div className="form-section"><div className="form-section-title"><div><h2>Forma de recebimento</h2><p>Selecione uma opção para continuar.</p></div><Truck size={20} /></div><div className="method-options"><button className={`method-card ${form.method === 'pickup' ? 'selected' : ''}`} onClick={() => update('method', 'pickup')}><span className="method-icon"><ShoppingBag size={18} /></span><span><strong>Retirada no local</strong><small>Pronto em aproximadamente 20 min</small></span>{form.method === 'pickup' && <Check size={18} />}</button><button className={`method-card ${form.method === 'delivery' ? 'selected' : ''}`} onClick={() => update('method', 'delivery')}><span className="method-icon"><Truck size={18} /></span><span><strong>Receber em casa</strong><small>Entrega estimada em 30–45 min</small></span>{form.method === 'delivery' && <Check size={18} />}</button></div></div>{form.method === 'delivery' && <div className="form-section address-section"><div className="form-section-title"><div><h2>Endereço de entrega</h2><p>Entregamos em toda a região próxima ao restaurante.</p></div><MapPin size={20} /></div><div className="field-grid address-grid"><Field label="CEP" required value={form.cep} onChange={value => update('cep', value)} placeholder="00000-000" /><Field label="Número" required value={form.number} onChange={value => update('number', value)} placeholder="Nº" /><Field label="Rua" required value={form.street} onChange={value => update('street', value)} placeholder="Nome da rua" /><Field label="Complemento" value={form.complement} onChange={value => update('complement', value)} placeholder="Apto, bloco..." /><Field label="Bairro" required value={form.neighborhood} onChange={value => update('neighborhood', value)} placeholder="Seu bairro" /><Field label="Cidade" required value={form.city} onChange={value => update('city', value)} placeholder="Sua cidade" /><Field label="Estado" required value={form.state} onChange={value => update('state', value)} placeholder="UF" /><Field label="Referência" value={form.reference} onChange={value => update('reference', value)} placeholder="Perto de..." /></div></div>}{form.method === 'delivery' && <FreeShippingCard cart={cart} onShop={onShop} addressReady={addressReady} className="free-shipping-mobile" />}{error && <div className="form-error">{error}</div>}<div className="form-actions actions-inline"><button className="secondary-button" onClick={onBack}><ArrowLeft size={15} /> Voltar</button><button className="primary-button" disabled={!form.method} onClick={continueDelivery}>Continuar <ArrowRight size={16} /></button></div></section><aside className="checkout-aside">{form.method === 'delivery' && <FreeShippingCard cart={cart} onShop={onShop} addressReady={addressReady} />}<OrderSummary cart={cart} deliveryFee={form.method === 'pickup' ? 0 : cartSubtotal(cart) >= FREE_SHIPPING_MIN ? 0 : addressReady ? DELIVERY_FEE : null} discount={0} /><div className="form-actions actions-side"><button className="secondary-button" onClick={onBack}><ArrowLeft size={15} /> Voltar</button><button className="primary-button" disabled={!form.method} onClick={continueDelivery}>Continuar <ArrowRight size={16} /></button></div></aside></div></main></>;
}

function ConfirmationPage({ cart, form, setForm, onBack, onEdit, onConfirm }: { cart: CartItem[]; form: DeliveryForm; setForm: (form: DeliveryForm) => void; onBack: () => void; onEdit: () => void; onConfirm: () => void }) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fee = form.method === 'delivery' ? deliveryFeeFor(cart) : 0;
  const confirm = () => { if (!form.payment) { setError('Escolha uma forma de pagamento.'); return; } setSubmitting(true); window.setTimeout(() => { setSubmitting(false); onConfirm(); }, 500); };
  return <><Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} onCart={() => undefined} onHome={onBack} /><main className="checkout-page"><button className="back-button mobile-back" onClick={onEdit}><ArrowLeft size={17} /> Voltar para entrega</button><StepIndicator step="confirmation" /><div className="page-title-row"><div><p className="eyebrow">ÚLTIMA ETAPA</p><h1>Confirme seu pedido</h1><p>Confira os dados antes de enviar o pedido.</p></div></div><div className="confirmation-layout"><div className="confirmation-main"><section className="review-card"><div className="review-heading"><h2>Itens do pedido</h2><button className="text-button" onClick={onBack}>Editar carrinho</button></div>{cart.map(item => <div className="review-item" key={item.id + (item.extras || []).join()}><img src={item.image} alt="" /><div><strong>{item.quantity}x {item.name}</strong><span>{item.extras?.length ? item.extras.join(', ') : 'Item tradicional'}</span></div><b>{formatPrice(item.price * item.quantity)}</b></div>)}</section><section className="review-card"><div className="review-heading"><h2>Entrega</h2><button className="text-button" onClick={onEdit}><Pencil size={14} /> Alterar</button></div><div className="review-info"><span className="review-icon">{form.method === 'delivery' ? <Truck size={17} /> : <ShoppingBag size={17} />}</span><div><strong>{form.method === 'delivery' ? 'Receber em casa' : 'Retirada no local'}</strong><p>{form.name} · {form.phone}</p>{form.method === 'delivery' && <p>{form.street}, {form.number}{form.complement ? `, ${form.complement}` : ''} — {form.neighborhood}, {form.city}/{form.state}</p>}</div></div>{form.method === 'delivery' && <div className="review-fee"><div><span>Total em produtos</span><b>{formatPrice(cartSubtotal(cart))}</b></div><div><span>Frete</span><b className={fee === 0 ? 'free' : ''}>{fee === 0 ? 'Grátis' : formatPrice(fee)}</b></div><div className="review-fee-total"><span>Total</span><b>{formatPrice(cartSubtotal(cart) + fee)}</b></div></div>}</section><section className="review-card"><div className="review-heading"><h2>Forma de pagamento</h2></div><div className="payment-options">{([['pix', 'Pix', Wallet], ['credit', 'Cartão de crédito', CreditCard], ['debit', 'Cartão de débito', CreditCard], ['cash', 'Dinheiro', Banknote]] as const).map(([id, label, Icon]) => <button key={id} className={`payment-option ${form.payment === id ? 'selected' : ''}`} onClick={() => setForm({ ...form, payment: id })}><Icon size={17} /><span>{label}</span>{form.payment === id && <Check size={16} />}</button>)}</div>{form.payment === 'cash' && <Field label="Precisa de troco para quanto?" value={form.change} onChange={value => setForm({ ...form, change: value })} placeholder="R$ 0,00" />}</section>{error && <div className="form-error">{error}</div>}<div className="form-actions actions-inline"><button className="secondary-button" onClick={onEdit}><ArrowLeft size={15} /> Alterar entrega</button><button className="primary-button" disabled={submitting} onClick={confirm}>{submitting ? 'Enviando...' : 'Confirmar pedido'} {!submitting && <Check size={16} />}</button></div></div><aside className="checkout-aside"><OrderSummary cart={cart} deliveryFee={fee} discount={0} /><div className="form-actions actions-side"><button className="secondary-button" onClick={onEdit}><ArrowLeft size={15} /> Alterar entrega</button><button className="primary-button" disabled={submitting} onClick={confirm}>{submitting ? 'Enviando...' : 'Confirmar pedido'} {!submitting && <Check size={16} />}</button></div></aside></div></main></>;
}

function SuccessPage({ onHome }: { onHome: () => void }) { return <main className="success-page"><div className="success-icon"><Check size={30} /></div><p className="eyebrow">PEDIDO RECEBIDO</p><h1>Pedido confirmado!</h1><p>Obrigado, seu pedido foi enviado para o Black Cat. Você poderá acompanhar tudo pelo seu telefone.</p><div className="success-number">Pedido #BC-2048</div><button className="primary-button" onClick={onHome}>Voltar ao cardápio <ArrowRight size={16} /></button></main>; }

function App() {
  const [view, setView] = useState<'store' | 'detail' | 'cart' | 'checkout' | 'success' | 'account' | 'orders'>('store');
  const [user, setUser] = useState<Profile | null>(loadUser);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('delivery');
  const [selectedProduct, setSelectedProduct] = useState<Product>(products[8]);
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([{ ...products[0], quantity: 1 }, { ...products[3], quantity: 1 }]);
  const [form, setForm] = useState<DeliveryForm>(() => ({ ...deliveryDefaults, ...(user || {}) }));
  const [discount, setDiscount] = useState(0);
  const [toast, setToast] = useState<{ id: number; name: string; image: string } | null>(null);
  useEffect(() => { if (!toast) return; const timer = window.setTimeout(() => setToast(null), 2600); return () => window.clearTimeout(timer); }, [toast]);
  const addToCart = (product: Product, productExtras: string[] = [], quantity = 1, removed: string[] = []) => { setToast({ id: Date.now(), name: product.name, image: product.image }); addToCartItem(product, productExtras, quantity, removed); };
  const addToCartItem = (product: Product, productExtras: string[] = [], quantity = 1, removed: string[] = []) => setCart(current => { const existing = current.find(item => item.id === product.id && JSON.stringify(item.extras || []) === JSON.stringify(productExtras) && JSON.stringify(item.removed || []) === JSON.stringify(removed)); if (existing) return current.map(item => item === existing ? { ...item, quantity: item.quantity + quantity } : item); return [...current, { ...product, quantity, extras: productExtras, removed }]; });
  const changeCart = (id: string, amount: number) => setCart(current => current.map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + amount) } : item).filter(item => item.quantity > 0));
  const removeFromCart = (id: string) => setCart(current => current.filter(item => item.id !== id));
  const openProduct = (product: Product, item?: CartItem) => { setSelectedProduct(product); setEditingItem(item || null); setView('detail'); };
  const openCart = () => setView('cart');
  const continueCheckout = () => { setCheckoutStep('delivery'); setView('checkout'); };
  const backHome = () => { setView('store'); setEditingItem(null); };
  const openCheckout = (step: CheckoutStep) => { setCheckoutStep(step); setView('checkout'); };
  const loginUser = (profile: Profile) => { try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(profile)); } catch { /* sessionStorage indisponível */ } setUser(profile); setForm(current => ({ ...current, ...profile })); };
  const logoutUser = () => { try { sessionStorage.removeItem(SESSION_KEY); } catch { /* sessionStorage indisponível */ } setUser(null); setForm(deliveryDefaults); setView('store'); };
  const saveUser = (profile: Profile) => { loginUser(profile); setView('store'); };
  const reorder = (lines: { product: Product; quantity: number; extras: string[] }[]) => { lines.forEach(line => addToCart(line.product, line.extras, line.quantity)); setView('cart'); };
  const session = { user, openAccount: () => setView('account'), openOrders: () => setView('orders'), openHome: backHome, openCart: () => setView('cart'), cartCount: cart.reduce((sum, item) => sum + item.quantity, 0) };
  const renderScreen = () => {
  if (view === 'orders') return <OrdersPage user={user} onLogin={() => setView('account')} onReorder={reorder} onBack={backHome} />;
  if (view === 'account') return <AccountPage user={user} onLogin={loginUser} onSave={saveUser} onLogout={logoutUser} onBack={backHome} />;
  if (view === 'success') return <SuccessPage onHome={backHome} />;
  if (view === 'cart') return <CartPage onAdd={product => addToCart(product)} cart={cart} discount={discount} setDiscount={setDiscount} onChange={changeCart} onRemove={removeFromCart} onClear={() => setCart([])} onContinue={continueCheckout} onEdit={item => openProduct(item, item)} onBack={backHome} />;
  if (view === 'checkout') return checkoutStep === 'delivery' ? <DeliveryPage cart={cart} form={form} setForm={setForm} onBack={openCart} onShop={backHome} onContinue={() => openCheckout('confirmation')} /> : <ConfirmationPage cart={cart} form={form} setForm={setForm} onBack={openCart} onEdit={() => openCheckout('delivery')} onConfirm={() => setView('success')} />;
  return view === 'store' ? <Storefront cart={cart} onAdd={product => addToCart(product)} onChange={changeCart} onRemove={removeFromCart} onOpen={openProduct} onCart={openCart} /> : <ProductDetail product={selectedProduct} cart={cart} initialExtras={editingItem?.extras} initialRemoved={editingItem?.removed} onAdd={(product, extraNames, quantity, removed) => { if (editingItem) setCart(current => [...current.filter(item => item !== editingItem), { ...product, quantity, extras: extraNames, removed }]); else addToCart(product, extraNames, quantity, removed); if (editingItem) { setEditingItem(null); setView('cart'); } }} onChange={changeCart} onRemove={removeFromCart} onBack={backHome} onCart={openCart} />;
  };
  return <SessionContext.Provider value={session}>{renderScreen()}{toast && <div className="toast" key={toast.id} role="status" aria-live="polite"><img src={toast.image} alt="" /><div><strong>Adicionado ao carrinho</strong><span>{toast.name}</span></div><span className="toast-check"><Check size={16} /></span></div>}</SessionContext.Provider>;
}

export default App;
