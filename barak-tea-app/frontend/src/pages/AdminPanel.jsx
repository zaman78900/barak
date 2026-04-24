import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Truck, Tag,
  Star, FileText, Settings, ChevronDown, ChevronRight, Search,
  Plus, Edit2, Trash2, Eye, Check, X, AlertTriangle, TrendingUp,
  TrendingDown, Bell, LogOut, BarChart2, RefreshCw, Copy,
  MessageCircle, Send, Filter, Download, Upload, Archive,
  ShieldCheck, Inbox, MoreVertical, CheckCircle, Clock,
  XCircle, MapPin, Phone, Mail, Box, Layers, Percent,
  IndianRupee, ChevronLeft, Globe, Zap, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import adminAPI from "../utils/adminApi";

// ─── Brand Palette ────────────────────────────────────────────────────────────
const C = {
  bg:       "#0D0905",
  surface:  "#1A110A",
  card:     "#221508",
  border:   "#3A2415",
  gold:     "#C8922A",
  goldLight:"#E8B84B",
  goldDim:  "#8A6118",
  cream:    "#FAF3E0",
  muted:    "#9E8C78",
  success:  "#2D7A4F",
  error:    "#C0392B",
  warning:  "#D4870A",
  info:     "#2563EB",
  white:    "#FFFFFF",
};

// ─── Utility Functions ────────────────────────────────────────────────────────
const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
const pct = (a, b) => b ? ((a-b)/b*100).toFixed(1) : 0;

// ─── Components ───────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, trend, color="#C8922A" }) {
  const up = parseFloat(trend) >= 0;
  return (
    <div style={{ background: C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:"20px 22px", position:"relative", overflow:"hidden" }}>
      <div style={{ position:"absolute", top:-20, right:-20, width:80, height:80, background:`${color}12`, borderRadius:"50%" }} />
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <div style={{ color:C.muted, fontSize:11, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:8 }}>{label}</div>
          <div style={{ color:C.cream, fontSize:26, fontWeight:700, letterSpacing:"-0.02em" }}>{value}</div>
          {sub && <div style={{ color:C.muted, fontSize:11, marginTop:4 }}>{sub}</div>}
        </div>
        <div style={{ background:`${color}20`, borderRadius:10, padding:10, color }}>
          <Icon size={20} />
        </div>
      </div>
      {trend !== undefined && (
        <div style={{ display:"flex", alignItems:"center", gap:4, marginTop:14, fontSize:11 }}>
          {up ? <ArrowUpRight size={13} color={C.success}/> : <ArrowDownRight size={13} color={C.error}/>}
          <span style={{ color: up ? C.success : C.error, fontWeight:600 }}>{Math.abs(trend)}%</span>
          <span style={{ color:C.muted }}>vs last month</span>
        </div>
      )}
    </div>
  );
}

function Badge({ status }) {
  const map = {
    delivered:  { bg:"#0D2B1A", text:"#34D399", label:"Delivered" },
    shipped:    { bg:"#0D1F3C", text:"#60A5FA", label:"Shipped" },
    processing: { bg:"#2D1B00", text:"#FBBF24", label:"Processing" },
    confirmed:  { bg:"#1A1A00", text:"#D4D400", label:"Confirmed" },
    cancelled:  { bg:"#2D0D0D", text:"#F87171", label:"Cancelled" },
    active:     { bg:"#0D2B1A", text:"#34D399", label:"Active" },
    inactive:   { bg:"#2D2D2D", text:"#9CA3AF", label:"Inactive" },
    pending:    { bg:"#2D1B00", text:"#FBBF24", label:"Pending" },
    approved:   { bg:"#0D2B1A", text:"#34D399", label:"Approved" },
    rejected:   { bg:"#2D0D0D", text:"#F87171", label:"Rejected" },
    expired:    { bg:"#2D2D2D", text:"#9CA3AF", label:"Expired" },
    in_transit: { bg:"#0D1F3C", text:"#60A5FA", label:"In Transit" },
    out_for_delivery: { bg:"#1A2B00", text:"#84CC16", label:"Out for Delivery" },
    new:        { bg:"#0D1F3C", text:"#60A5FA", label:"New" },
    contacted:  { bg:"#2D1B00", text:"#FBBF24", label:"Contacted" },
    converted:  { bg:"#0D2B1A", text:"#34D399", label:"Converted" },
    gold:       { bg:"#3A2800", text:"#F59E0B", label:"Gold" },
    silver:     { bg:"#1E2A2A", text:"#94A3B8", label:"Silver" },
    bronze:     { bg:"#2D1A0D", text:"#D97706", label:"Bronze" },
    percent:    { bg:"#0D1F3C", text:"#60A5FA", label:"%" },
    fixed:      { bg:"#0D2B1A", text:"#34D399", label:"₹ Off" },
    shipping:   { bg:"#1A1A00", text:"#D4D400", label:"Free Ship" },
    whatsapp:   { bg:"#0D2B1A", text:"#34D399", label:"WhatsApp" },
    web:        { bg:"#0D1F3C", text:"#60A5FA", label:"Web" },
  };
  const s = map[status] || { bg:C.border, text:C.muted, label:status };
  return (
    <span style={{ background:s.bg, color:s.text, padding:"3px 9px", borderRadius:20, fontSize:10, fontWeight:700, letterSpacing:"0.05em", whiteSpace:"nowrap" }}>
      {s.label}
    </span>
  );
}

function Modal({ title, onClose, children, width=600, maxHeight="90vh" }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px 20px", overflowY:"auto" }} onClick={onClose}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:"100%", maxWidth:width, maxHeight, overflowY:"auto", margin:"auto 0" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", borderBottom:`1px solid ${C.border}` }}>
          <span style={{ color:C.cream, fontWeight:700, fontSize:16 }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer" }}><X size={18}/></button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type="text", placeholder="", disabled=false, step }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", color:C.muted, fontSize:11, fontWeight:600, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} step={step}
        style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.cream, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box", opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "text" }} />
    </div>
  );
}

function Select({ label, value, onChange, options, disabled=false }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", color:C.muted, fontSize:11, fontWeight:600, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <select value={value} onChange={onChange} disabled={disabled}
        style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.cream, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box", opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Btn({ children, onClick, variant="primary", size="md", icon:Icon, disabled }) {
  const styles = {
    primary: { bg:C.gold, color:"#0D0905", hover:C.goldLight },
    secondary: { bg:"transparent", color:C.cream, border:`1px solid ${C.border}` },
    danger: { bg:"#2D0D0D", color:"#F87171", border:"1px solid #5A1A1A" },
    success: { bg:"#0D2B1A", color:"#34D399", border:"1px solid #1A5A35" },
    ghost: { bg:"transparent", color:C.muted },
  };
  const s = styles[variant];
  const pad = size === "sm" ? "6px 12px" : size === "lg" ? "12px 22px" : "9px 16px";
  const fs = size === "sm" ? 12 : 14;
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ background:s.bg, color:s.color, border:s.border||"none", borderRadius:8, padding:pad, fontSize:fs, fontWeight:600, cursor:disabled?"not-allowed":"pointer", display:"inline-flex", alignItems:"center", gap:6, opacity:disabled?0.5:1, transition:"opacity 0.2s" }}>
      {Icon && <Icon size={fs-1}/>}{children}
    </button>
  );
}

function Table({ headers, rows, emptyMsg="No data found." }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ borderBottom:`2px solid ${C.border}` }}>
            {headers.map((h,i) => (
              <th key={i} style={{ color:C.muted, fontWeight:600, fontSize:11, textTransform:"uppercase", letterSpacing:"0.07em", padding:"10px 14px", textAlign:"left", whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={headers.length} style={{ textAlign:"center", color:C.muted, padding:40 }}>{emptyMsg}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom:`1px solid ${C.border}`, transition:"background 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.card}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {row.map((cell, j) => (
                <td key={j} style={{ color:C.cream, padding:"12px 14px", verticalAlign:"middle" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeader({ title, sub, action }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
      <div>
        <h2 style={{ color:C.cream, fontSize:20, fontWeight:700, margin:0, letterSpacing:"-0.01em" }}>{title}</h2>
        {sub && <p style={{ color:C.muted, fontSize:13, margin:"4px 0 0" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
// ─── Mock Data ────────────────────────────────────────────────────────────────
// These can be replaced with actual API calls
const MOCK_PRODUCTS = [
  { id:1, name:"Classic CTC Dust", category:"Everyday", price:180, mrp:220, stock:142, sold:340, status:"active", img:"🍵" },
  { id:2, name:"Premium Leaf Grade CTC", category:"Premium", price:280, mrp:340, stock:68, sold:188, status:"active", img:"🌿" },
  { id:3, name:"Morning Masala Blend", category:"Blends", price:220, mrp:260, stock:12, sold:220, status:"active", img:"✨" },
];

const MOCK_CUSTOMERS = [
  { id:"C001", name:"Priya Sharma", phone:"+91 9876543210", email:"priya@email.com", city:"Silchar", orders:12, spent:4820, points:482, tier:"Gold" },
  { id:"C002", name:"Rashed Ahmed", phone:"+91 9123456789", email:"rashed@email.com", city:"Guwahati", orders:5, spent:2100, points:210, tier:"Silver" },
];

const MOCK_SHIPMENTS = [
  { id:"SHP-441", orderId:"ORD-1082", customer:"Priya Sharma", city:"Silchar", partner:"India Post", tracking:"IP9876543IN", status:"delivered", dispatched:"2026-04-21", eta:"2026-04-23" },
  { id:"SHP-440", orderId:"ORD-1081", customer:"Rashed Ahmed", city:"Guwahati", partner:"DTDC", tracking:"DTDC789012", status:"in_transit", dispatched:"2026-04-20", eta:"2026-04-24" },
];

const MOCK_COUPONS = [
  { id:"CP001", code:"EID2026", type:"percent", value:15, minOrder:299, usageLimit:200, used:87, validFrom:"2026-03-28", validUntil:"2026-04-10", status:"expired" },
  { id:"CP002", code:"FIRST10", type:"percent", value:10, minOrder:200, usageLimit:500, used:143, validFrom:"2026-01-01", validUntil:"2026-12-31", status:"active" },
];

const MOCK_REVIEWS = [
  { id:"RV001", product:"Classic CTC Dust", customer:"Priya S.", rating:5, headline:"Best chai ever!", body:"The aroma is incredible. Perfect for morning chai.", status:"pending", date:"2026-04-21" },
  { id:"RV002", product:"Morning Masala Blend", customer:"Rashed A.", rating:4, headline:"Great masala blend", body:"Nice spice balance. Could be a bit stronger.", status:"pending", date:"2026-04-20" },
];

const MOCK_ENQUIRIES = [
  { id:"WS001", business:"Noor Traders", contact:"Mr. Noor", phone:"+91 9876001122", city:"Silchar", monthlyKg:50, message:"Interested in bulk CTC. Please send pricing.", status:"new" },
  { id:"WS002", business:"Ahmed Kirana Store", contact:"Ahmed Ali", phone:"+91 9876003344", city:"Karimganj", monthlyKg:20, message:"Want monthly supply for our store.", status:"contacted" },
];
// ─── PAGE: Products ───────────────────────────────────────────────────────────
function ProductsPage() {
  const createEmptyVariant = () => ({ variant_name: "", price: "", stock: "", image_url: "" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name:"", category:"Everyday", price:"", mrp:"", stock_quantity:"", status:"active", image_url:"", images:[], variants:[] });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.products.getAll(1, 100);
      setProducts(data.products || []);
      setError("");
    } catch (err) {
      setError("Failed to load products");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { 
    setForm({ name:"", category:"Everyday", price:"", mrp:"", stock_quantity:"", status:"active", image_url:"", images:[], variants:[] }); 
    setEditing(null); 
    setShowModal(true); 
  };

  const openEdit = async (p) => { 
    try {
      setLoading(true);
      const fullProduct = await adminAPI.products.getById(p.id);
      setForm({ 
        name:fullProduct.name, 
        category:fullProduct.category, 
        price:fullProduct.price, 
        mrp:fullProduct.mrp, 
        stock_quantity:fullProduct.stock_quantity, 
        status:fullProduct.status,
        image_url:fullProduct.image_url || "",
        images:fullProduct.images || [],
        variants:(fullProduct.variants || []).map(v => ({
          ...createEmptyVariant(),
          ...v,
          variant_name: v.variant_name || "",
          price: v.price ?? "",
          stock: v.stock ?? "",
          image_url: v.image_url || ""
        }))
      }); 
      setEditing(p.id); 
      setShowModal(true);
    } catch (err) {
      setError("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const [uploading, setUploading] = useState(false); // false or target string

  const handleFileUpload = async (e, target = 'image_url', index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const targetKey = index !== null ? `${target}-${index}` : target;
      setUploading(targetKey);
      setError("");
      const result = await adminAPI.upload.uploadImage(file);
      
      if (target === 'image_url') {
        setForm(f => ({ ...f, image_url: result.url }));
      } else if (target === 'gallery') {
        setForm(f => ({ ...f, images: [...(f.images || []), result.url] }));
      } else if (target === 'variant') {
        setForm(f => ({
          ...f,
          variants: (f.variants || []).map((variant, variantIndex) =>
            variantIndex === index ? { ...variant, image_url: result.url } : variant
          )
        }));
      }
    } catch (err) {
      setError("Image upload failed");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (idx) => {
    setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const addVariant = () => {
    setForm(f => ({ ...f, variants: [...(f.variants || []), createEmptyVariant()] }));
  };

  const removeVariant = (idx) => {
    setForm(f => ({ ...f, variants: (f.variants || []).filter((_, i) => i !== idx) }));
  };

  const updateVariant = (idx, key, val) => {
    setForm(f => ({
      ...f,
      variants: (f.variants || []).map((variant, variantIndex) =>
        variantIndex === idx ? { ...variant, [key]: val } : variant
      )
    }));
  };

  const save = async () => {
    if (!form.name || !form.price) {
      setError("Name and price are required");
      return;
    }
    
    try {
      setLoading(true);
      
      // Cast numeric fields to actual numbers before sending to API
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        mrp: parseFloat(form.mrp) || parseFloat(form.price) || 0,
        stock_quantity: parseInt(form.stock_quantity) || 0,
        variants: (form.variants || []).map(v => ({
          ...v,
          price: parseFloat(v.price) || 0,
          stock: parseInt(v.stock) || 0
        }))
      };

      if(editing) {
        await adminAPI.products.update(editing, payload);
      } else {
        await adminAPI.products.create(payload);
      }
      await loadProducts();
      setShowModal(false);
      setError("");
    } catch (err) {
      setError("Failed to save product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    if (confirm("Delete this product?")) {
      try {
        await adminAPI.products.delete(id);
        await loadProducts();
      } catch (err) {
        setError("Failed to delete product");
        console.error(err);
      }
    }
  };

  const toggleStatus = async (id) => {
    const product = products.find(p => p.id === id);
    try {
      await adminAPI.products.update(id, { status: product.status === "active" ? "inactive" : "active" });
      await loadProducts();
    } catch (err) {
      setError("Failed to update status");
      console.error(err);
    }
  };

  if (loading && products.length === 0) {
    return <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Loading products...</div>;
  }

  return (
    <div>
      <SectionHeader title="Products" sub={`${products.length} total products · ${products.filter(p=>p.status==="active").length} active`}
        action={<Btn icon={Plus} onClick={openAdd}>Add Product</Btn>} />

      {error && <div style={{ background:"#2D0D0D", border:"1px solid #5A1A1A", color:"#F87171", padding:12, borderRadius:8, marginBottom:16 }}>{error}</div>}

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        <div style={{ display:"flex", gap:12, marginBottom:18 }}>
          <div style={{ flex:1, position:"relative" }}>
            <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.muted }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
              style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.cream, padding:"9px 12px 9px 34px", fontSize:13, outline:"none", boxSizing:"border-box" }}/>
          </div>
        </div>

        <Table headers={["Product","Category","Price","MRP","Stock","Status","Actions"]}
          rows={filtered.map(p=>[
            <div style={{display:"flex", alignItems:"center", gap:12}}>
              <div style={{width:40, height:40, borderRadius:6, overflow:"hidden", background:C.bg, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                {p.image_url ? <img src={p.image_url} style={{width:"100%", height:"100%", objectFit:"cover"}}/> : <span style={{fontSize:18}}>🍵</span>}
              </div>
              <div><div style={{fontWeight:600,color:C.cream}}>{p.name}</div><div style={{fontSize:11,color:C.muted}}>{p.id}</div></div>
            </div>,
            p.category,
            <span style={{fontWeight:600,color:C.gold}}>{fmt(p.price)}</span>,
            <span style={{color:C.muted,textDecoration:"line-through"}}>{fmt(p.mrp || p.price)}</span>,
            <span style={{color:p.stock_quantity===0?C.error:p.stock_quantity<15?C.warning:C.success,fontWeight:600}}>{p.stock_quantity}</span>,
            <Badge status={p.status}/>,
            <div style={{display:"flex",gap:6}}>
              <Btn size="sm" variant="secondary" icon={Edit2} onClick={()=>openEdit(p)}>Edit</Btn>
              <Btn size="sm" variant={p.status==="active"?"ghost":"success"} onClick={()=>toggleStatus(p.id)}>{p.status==="active"?"Disable":"Enable"}</Btn>
              <Btn size="sm" variant="danger" icon={Trash2} onClick={()=>del(p.id)}/>
            </div>
          ])}
        />
      </div>

      {showModal && (
        <Modal title={editing?"Edit Product":"Add New Product"} onClose={()=>setShowModal(false)} width={1120} maxHeight="calc(100vh - 24px)">
          <div style={{display:"grid", gridTemplateColumns:"minmax(0, 1.75fr) 320px", gap:24}}>
            {/* Left Column: Basic Info & Variants */}
            <div>
              <div style={{color:C.gold, fontSize:12, fontWeight:700, textTransform:"uppercase", marginBottom:16, display:"flex", alignItems:"center", gap:8}}><Layers size={14}/> Basic Information</div>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0 16px"}}>
                <div style={{gridColumn:"1/-1"}}><Input label="Product Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
                <Select label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={["Everyday","Premium","Blends","Gifts"].map(v=>({value:v,label:v}))}/>
                <Select label="Status" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} options={[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"}]}/>
                <Input label="Selling Price (₹)" type="number" step="any" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
                <Input label="MRP (₹)" type="number" step="any" value={form.mrp} onChange={e=>setForm({...form,mrp:e.target.value})}/>
                <Input label="Stock Quantity" type="number" value={form.stock_quantity} onChange={e=>setForm({...form,stock_quantity:e.target.value})}/>
              </div>

              {/* Variants Section */}
              <div style={{marginTop:32, borderTop:`1px solid ${C.border}`, paddingTop:24}}>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
                  <div style={{color:C.gold, fontSize:12, fontWeight:700, textTransform:"uppercase", display:"flex", alignItems:"center", gap:8}}><Box size={14}/> Product Variants</div>
                  <Btn size="sm" variant="secondary" icon={Plus} onClick={addVariant}>Add Variant</Btn>
                </div>
                
                <div style={{display:"flex", flexDirection:"column", gap:12}}>
                  {(form.variants || []).map((v, idx) => (
                    <div key={idx} style={{background:C.bg, borderRadius:12, padding:16, border:`1px solid ${C.border}`, display:"grid", gridTemplateColumns:"40px minmax(120px, 1.7fr) minmax(120px, 1fr) 100px 40px", gap:12, alignItems:"center"}}>
                      <div style={{width:40, height:40, borderRadius:6, background:C.card, border:`1px solid ${C.border}`, overflow:"hidden", cursor:"pointer", position:"relative"}} onClick={() => document.getElementById(`v-up-${idx}`).click()}>
                        {v.image_url ? <img src={v.image_url} style={{width:"100%", height:"100%", objectFit:"cover"}}/> : <Upload size={14} style={{position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", color:C.muted}}/>}
                        {uploading === `variant-${idx}` && <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center"}}><RefreshCw size={12} className="animate-spin"/></div>}
                        <input type="file" id={`v-up-${idx}`} hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'variant', idx)}/>
                      </div>
                      <input value={v.variant_name} onChange={e => updateVariant(idx, 'variant_name', e.target.value)} placeholder="e.g. 500g Pack" 
                        style={{background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 12px", color:C.cream, fontSize:13, outline:"none", minWidth:0, boxSizing:"border-box"}}/>
                      <div style={{display:"flex", alignItems:"center", gap:6, background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"8px 12px", minWidth:0, boxSizing:"border-box"}}>
                        <span style={{color:C.muted, fontSize:12}}>₹</span>
                        <input value={v.price} onChange={e => updateVariant(idx, 'price', e.target.value)} type="number" step="any" placeholder="Price" 
                          style={{background:"transparent", border:"none", color:C.cream, fontSize:13, width:"100%", flex:1, minWidth:0, outline:"none"}}/>
                      </div>
                      <div style={{display:"flex", alignItems:"center", gap:4, background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"6px 10px", minWidth:0, boxSizing:"border-box"}}>
                        <span style={{color:C.muted, fontSize:12}}>Qty:</span>
                        <input value={v.stock} onChange={e => updateVariant(idx, 'stock', e.target.value)} type="number" placeholder="0" 
                          style={{background:"transparent", border:"none", color:C.cream, fontSize:13, width:"100%", flex:1, minWidth:0, outline:"none"}}/>
                      </div>
                      <button onClick={() => removeVariant(idx)} style={{background:"none", border:"none", color:C.error, cursor:"pointer", opacity:0.6}}><Trash2 size={16}/></button>
                    </div>
                  ))}
                  {(!form.variants || form.variants.length === 0) && (
                    <div style={{textAlign:"center", padding:20, color:C.muted, fontSize:12, border:`1px dashed ${C.border}`, borderRadius:12}}>No variants added.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Images & Gallery */}
            <div style={{borderLeft:`1px solid ${C.border}`, paddingLeft:24}}>
              <div style={{color:C.gold, fontSize:12, fontWeight:700, textTransform:"uppercase", marginBottom:16, display:"flex", alignItems:"center", gap:8}}><Upload size={14}/> Product Images</div>
              
              {/* Main Image */}
              <div style={{marginBottom:24}}>
                <div style={{fontSize:11, color:C.muted, marginBottom:8}}>MAIN IMAGE</div>
                <div style={{width:"100%", aspectRatio:"1", background:C.bg, borderRadius:12, border:`2px dashed ${C.border}`, overflow:"hidden", position:"relative", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"border-color 0.2s"}}
                  onClick={() => document.getElementById('main-up').click()}>
                  {form.image_url ? (
                    <img src={form.image_url} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                  ) : (
                    <div style={{textAlign:"center", color:C.muted}}><Plus size={24} style={{marginBottom:8}}/><div>Add Main Image</div></div>
                  )}
                  {uploading === 'image_url' && <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"center", justifyContent:"center"}}><RefreshCw size={24} className="animate-spin"/></div>}
                  <input type="file" id="main-up" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'image_url')}/>
                </div>
              </div>

              {/* Gallery */}
              <div>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8}}>
                  <div style={{fontSize:11, color:C.muted}}>GALLERY</div>
                  <Btn size="sm" variant="ghost" onClick={() => document.getElementById('gal-up').click()} disabled={uploading==='gallery'}>
                    {uploading === 'gallery' ? <RefreshCw size={12} className="animate-spin"/> : <Plus size={12}/>} Add
                    <input type="file" id="gal-up" hidden accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery')}/>
                  </Btn>
                </div>
                <div style={{display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8}}>
                  {(form.images || []).map((img, idx) => (
                    <div key={idx} style={{aspectRatio:"1", borderRadius:8, overflow:"hidden", border:`1px solid ${C.border}`, position:"relative", group:"true"}}>
                      <img src={img} style={{width:"100%", height:"100%", objectFit:"cover"}}/>
                      <button onClick={() => removeGalleryImage(idx)} style={{position:"absolute", top:4, right:4, background:"rgba(255,255,255,0.2)", backdropFilter:"blur(4px)", border:"none", borderRadius:4, color:"#fff", padding:4, cursor:"pointer"}}><X size={12}/></button>
                      <button onClick={() => setForm({...form, image_url:img})} style={{position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,0,0,0.5)", color:"#fff", fontSize:9, border:"none", padding:4, cursor:"pointer"}}>Set Main</button>
                    </div>
                  ))}
                  {[...Array(Math.max(0, 6 - (form.images?.length || 0)))].map((_, i) => (
                    <div key={i} style={{aspectRatio:"1", borderRadius:8, border:`1px dashed ${C.border}`, background:`${C.border}22`}}/>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={{display:"flex", gap:10, justifyContent:"flex-end", marginTop:32, borderTop:`1px solid ${C.border}`, paddingTop:24}}>
            <Btn variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Btn>
            <Btn onClick={save} loading={loading}>{editing?"Save Changes":"Add Product"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: Orders ─────────────────────────────────────────────────────────────
function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [statusNotice, setStatusNotice] = useState("");

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const filters = filter === "all" ? {} : { status: filter };
      const data = await adminAPI.orders.getAll(1, 100, filters);
      setOrders(data.orders || []);
      setError("");
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ["all","pending","confirmed","processing","shipped","delivered","cancelled"];

  const getCustomerName = (order) =>
    order?.contact_details?.name || order?.customer_name || "Guest Customer";

  const getShippingDetails = (order) =>
    order?.shipping_address_details || {
      line1: "",
      line2: "",
      city: order?.customer_city || "",
      state: "",
      pin: "",
      formatted: order?.shipping_address || "",
    };

  const formatNotificationResult = (label, result) => {
    if (!result) return `${label}: not attempted`;
    if (result.sent) return `${label}: sent`;
    if (result.skipped) return `${label}: skipped${result.reason ? ` (${result.reason})` : ""}`;
    return `${label}: failed${result.reason ? ` (${result.reason})` : ""}`;
  };

  const buildStatusNotice = (status, notifications) => {
    const parts = [
      `Order marked as ${status}.`,
      formatNotificationResult("Email", notifications?.email),
      formatNotificationResult("WhatsApp", notifications?.whatsapp),
    ];
    return parts.join(" ");
  };

  const openOrder = async (order) => {
    setSelected(order);
    try {
      const fullOrder = await adminAPI.orders.getById(order.id);
      setSelected(fullOrder);
    } catch (err) {
      setError("Failed to load complete order details");
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const updatedOrder = await adminAPI.orders.updateStatus(id, status);
      setStatusNotice(buildStatusNotice(status, updatedOrder.notifications));
      await loadOrders();
      setSelected(null);
      setError("");
    } catch (err) {
      setError("Failed to update order status");
      setStatusNotice("");
      console.error(err);
    }
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: 40, color: C.muted }}>Loading orders...</div>;
  }

  return (
    <div>
      <SectionHeader title="Orders" sub={`${orders.length} total orders`} />

      {error && <div style={{ background:"#2D0D0D", border:"1px solid #5A1A1A", color:"#F87171", padding:12, borderRadius:8, marginBottom:16 }}>{error}</div>}
      {statusNotice && <div style={{ background:"#0D2B1A", border:"1px solid #1A5A35", color:"#34D399", padding:12, borderRadius:8, marginBottom:16 }}>{statusNotice}</div>}

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
          {statuses.map(s=>(
            <button key={s} onClick={()=>setFilter(s)}
              style={{ background:filter===s?C.gold:"transparent", color:filter===s?"#0D0905":C.muted, border:`1px solid ${filter===s?C.gold:C.border}`, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer", textTransform:"capitalize" }}>
              {s==="all"?"All Orders":s}
            </button>
          ))}
        </div>

        <Table headers={["Order ID","Customer","Products","Total","Status","Date","Actions"]}
          rows={orders.map(o=>[
            <span style={{color:C.gold,fontWeight:700}}>{o.order_number || o.id}</span>,
            <div>
              <div style={{fontWeight:600}}>{getCustomerName(o)}</div>
              <div style={{fontSize:11,color:C.muted}}>
                {o.contact_details?.phone || o.customer_phone || o.contact_details?.email || o.customer_email || "—"}
              </div>
            </div>,
            <div style={{maxWidth:180}}>
              {(o.order_items && o.order_items.length > 0) ? (
                o.order_items.map((item, idx) => (
                  <div key={idx} style={{fontSize:12, color:C.cream, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", fontWeight: idx===0?600:400}}>
                    {item.product_name || "Unknown"}
                    {item.variant && item.variant !== "Standard" ? <span style={{color:C.muted}}> · {item.variant}</span> : null}
                    {o.order_items.length > 1 && <span style={{color:C.muted}}> ×{item.quantity}</span>}
                  </div>
                ))
              ) : (
                <span style={{color:C.muted,fontSize:12}}>—</span>
              )}
            </div>,
            <span style={{fontWeight:700,color:C.gold}}>{fmt(o.total_amount)}</span>,
            <Badge status={o.status}/>,
            <span style={{color:C.muted,fontSize:11}}>{new Date(o.created_at).toLocaleDateString()}</span>,
            <div style={{display:"flex",gap:6}}>
              <Btn size="sm" variant="secondary" icon={Eye} onClick={()=>openOrder(o)}>View</Btn>
            </div>
          ])}
        />
      </div>

      {selected && (
        <Modal title={`Order ${selected.order_number || selected.id}`} onClose={()=>setSelected(null)} width={760}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
            <div style={{background:C.bg,borderRadius:10,padding:16}}>
              <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Order Info</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:C.muted,fontSize:12}}>Status</span><Badge status={selected.status}/></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:C.muted,fontSize:12}}>Total</span><span style={{color:C.gold,fontWeight:700}}>{fmt(selected.total_amount)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted,fontSize:12}}>Placed</span><span style={{color:C.cream,fontSize:12}}>{selected.created_at ? new Date(selected.created_at).toLocaleString() : "—"}</span></div>
            </div>
            <div style={{background:C.bg,borderRadius:10,padding:16}}>
              <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Payment Method</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:C.muted,fontSize:12}}>Method</span><span style={{color:C.cream,fontSize:12,fontWeight:600}}>{selected.payment_method_label || selected.payment_method || "—"}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{color:C.muted,fontSize:12}}>Payment Status</span><Badge status={selected.payment_status || "pending"}/></div>
              <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:C.muted,fontSize:12}}>Channel</span><span style={{color:C.cream,fontSize:12,textTransform:"capitalize"}}>{selected.channel || "web"}</span></div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
            <div style={{background:C.bg,borderRadius:10,padding:16}}>
              <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Contact Details</div>
              <div style={{marginBottom:8}}><div style={{color:C.muted,fontSize:11,marginBottom:3}}>Customer</div><div style={{color:C.cream,fontSize:13,fontWeight:600}}>{getCustomerName(selected)}</div></div>
              <div style={{marginBottom:8}}><div style={{color:C.muted,fontSize:11,marginBottom:3}}>Phone</div><div style={{color:C.cream,fontSize:13}}>{selected.contact_details?.phone || selected.customer_phone || "—"}</div></div>
              <div><div style={{color:C.muted,fontSize:11,marginBottom:3}}>Email</div><div style={{color:C.cream,fontSize:13,wordBreak:"break-word"}}>{selected.contact_details?.email || selected.customer_email || "—"}</div></div>
            </div>
            <div style={{background:C.bg,borderRadius:10,padding:16}}>
              <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Shipping Address</div>
              {(() => {
                const shipping = getShippingDetails(selected);
                return (
                  <div style={{display:"flex",flexDirection:"column",gap:6,fontSize:13,color:C.cream}}>
                    <div>{shipping.line1 || "—"}</div>
                    {shipping.line2 && <div>{shipping.line2}</div>}
                    {(shipping.city || shipping.state || shipping.pin) && (
                      <div>{[shipping.city, shipping.state, shipping.pin].filter(Boolean).join(", ")}</div>
                    )}
                    {shipping.country && <div>{shipping.country}</div>}
                    {!shipping.line1 && shipping.formatted && <div>{shipping.formatted}</div>}
                  </div>
                );
              })()}
            </div>
          </div>

          <div style={{background:C.bg,borderRadius:10,padding:16,marginBottom:20}}>
            <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Order Items</div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {(selected.order_items || []).length === 0 ? (
                <div style={{color:C.muted,fontSize:12}}>No order items available.</div>
              ) : (
                (selected.order_items || []).map((item, idx) => (
                  <div key={`${item.id || item.product_id || item.product_name}-${idx}`} style={{display:"grid",gridTemplateColumns:"1fr auto auto",gap:12,alignItems:"center",padding:"10px 12px",border:`1px solid ${C.border}`,borderRadius:8}}>
                    <div>
                      <div style={{color:C.cream,fontWeight:600,fontSize:13}}>{item.product_name}</div>
                      <div style={{color:C.muted,fontSize:11}}>{item.variant || "Standard"}</div>
                    </div>
                    <div style={{color:C.cream,fontSize:12}}>Qty: {item.quantity}</div>
                    <div style={{color:C.gold,fontWeight:700,fontSize:13}}>{fmt(item.total_price || ((item.unit_price || 0) * (item.quantity || 1)))}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div style={{marginBottom:20}}>
            <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Update Status</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["pending","confirmed","processing","shipped","delivered","cancelled"].map(s=>(
                <Btn key={s} size="sm" variant={selected.status===s?"primary":"secondary"} onClick={()=>updateStatus(selected.id,s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</Btn>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: Dashboard ──────────────────────────────────────────────────────────
function DashboardPage() {
  const [stats, setStats] = useState({ totalRevenue: 5280, orders: 6, activeCustomers: 2, activeProducts: 3 });

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Load products and orders in parallel
      const [productsData, ordersData] = await Promise.all([
        adminAPI.products.getAll(1, 100).catch(err => {
          console.error('Failed to load products:', err);
          return { products: [] };
        }),
        adminAPI.orders.getAll(1, 100, {}).catch(err => {
          console.error('Failed to load orders:', err);
          return { orders: [] };
        })
      ]);

      setStats({
        totalRevenue: ordersData.orders?.reduce((a, o) => a + (o.total_amount || 0), 0) || 0,
        orders: ordersData.orders?.length || 0,
        activeCustomers: new Set(ordersData.orders?.map(o => o.customer_id).filter(Boolean)).size || 0,
        activeProducts: productsData.products?.filter(p => p.status === "active").length || 0,
      });
    } catch (err) {
      console.error("🔴 Failed to load dashboard stats:", err);
      // Keep default values and show warning
      console.warn('Dashboard loaded with default values - backend may not be responding');
    }
  };

  return (
    <div>
      <SectionHeader title="Dashboard" sub="Welcome back! Here's what's happening with BARAK Tea today." />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:28 }}>
        <StatCard icon={IndianRupee} label="Monthly Revenue" value={fmt(stats.totalRevenue)} sub="April 2026" trend={12.4} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={stats.orders} sub="This month" trend={8.2} color="#2563EB" />
        <StatCard icon={Users} label="Active Customers" value={stats.activeCustomers} sub="Registered users" trend={18.5} color="#9333EA" />
        <StatCard icon={Package} label="Products Active" value={stats.activeProducts} sub="Available for sale" color={stats.activeProducts>0?C.gold:C.warning} />
      </div>
    </div>
  );
}

// ─── PAGE: Customers ──────────────────────────────────────────────────────────
function CustomersPage() {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState("");
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SectionHeader title="Customers" sub={`${customers.length} registered customers`} />
      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        <div style={{ position:"relative", marginBottom:18 }}>
          <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.muted }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or phone..."
            style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.cream, padding:"9px 12px 9px 34px", fontSize:13, outline:"none", boxSizing:"border-box" }}/>
        </div>
        <Table headers={["Name","Phone","City","Orders","Total Spent","Tier"]}
          rows={filtered.map(c=>[
            <div><div style={{fontWeight:600}}>{c.name}</div><div style={{fontSize:11,color:C.muted}}>{c.email}</div></div>,
            c.phone,
            c.city,
            <span style={{fontWeight:600}}>{c.orders}</span>,
            <span style={{color:C.gold,fontWeight:700}}>{fmt(c.spent)}</span>,
            <Badge status={c.tier.toLowerCase()}/>,
          ])}
        />
      </div>
    </div>
  );
}

// ─── PAGE: Shipments ──────────────────────────────────────────────────────────
function ShipmentsPage() {
  const [shipments, setShipments] = useState(MOCK_SHIPMENTS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ orderId:"", customer:"", city:"", partner:"India Post", tracking:"" });

  const save = () => {
    setShipments(ss=>[...ss,{ id:`SHP-${Math.floor(Math.random()*900)+100}`, ...form, status:"in_transit", dispatched:new Date().toISOString().slice(0,10), eta:"" }]);
    setShowModal(false);
    setForm({ orderId:"", customer:"", city:"", partner:"India Post", tracking:"" });
  };

  const updateStatus = (id,status) => setShipments(ss=>ss.map(s=>s.id===id?{...s,status}:s));

  return (
    <div>
      <SectionHeader title="Shipments" sub={`${shipments.length} shipments tracked`}
        action={<Btn icon={Plus} onClick={()=>setShowModal(true)}>Create Shipment</Btn>} />

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        <Table headers={["Ship ID","Order","Customer","City","Partner","Tracking","Status","Actions"]}
          rows={shipments.map(s=>[
            <span style={{color:C.gold,fontWeight:700}}>{s.id}</span>,
            <span style={{color:C.muted}}>{s.orderId}</span>,
            s.customer,
            s.city,
            s.partner,
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:11,fontFamily:"monospace",color:C.cream}}>{s.tracking}</span>
            </div>,
            <Badge status={s.status}/>,
            <div style={{display:"flex",gap:6}}>
              {s.status!=="delivered" && <Btn size="sm" variant="success" onClick={()=>updateStatus(s.id,"delivered")}>✓ Delivered</Btn>}
            </div>
          ])}
        />
      </div>

      {showModal && (
        <Modal title="Create Shipment" onClose={()=>setShowModal(false)}>
          <Input label="Order ID" value={form.orderId} onChange={e=>setForm({...form,orderId:e.target.value})} placeholder="ORD-XXXX"/>
          <Input label="Customer Name" value={form.customer} onChange={e=>setForm({...form,customer:e.target.value})}/>
          <Input label="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/>
          <Select label="Shipping Partner" value={form.partner} onChange={e=>setForm({...form,partner:e.target.value})}
            options={["India Post","DTDC","BlueDart","Delhivery","Own Delivery"].map(v=>({value:v,label:v}))}/>
          <Input label="Tracking Number" value={form.tracking} onChange={e=>setForm({...form,tracking:e.target.value})} placeholder="AWB / Tracking ID"/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
            <Btn variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Btn>
            <Btn icon={Truck} onClick={save}>Create Shipment</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: Coupons ────────────────────────────────────────────────────────────
function CouponsPage() {
  const [coupons, setCoupons] = useState(MOCK_COUPONS);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code:"", type:"percent", value:"", minOrder:"", usageLimit:"", validUntil:"" });

  const save = () => {
    setCoupons(cs=>[...cs,{ id:`CP${Math.floor(Math.random()*900)+100}`, ...form, value:+form.value, minOrder:+form.minOrder, usageLimit:+form.usageLimit, used:0, status:"active" }]);
    setShowModal(false);
  };

  const del = (id) => setCoupons(cs=>cs.filter(c=>c.id!==id));

  return (
    <div>
      <SectionHeader title="Coupons & Promotions" sub={`${coupons.filter(c=>c.status==="active").length} active coupons`}
        action={<Btn icon={Plus} onClick={()=>setShowModal(true)}>Create Coupon</Btn>} />

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        <Table headers={["Code","Type","Value","Min Order","Usage","Status","Actions"]}
          rows={coupons.map(c=>[
            <span style={{fontFamily:"monospace",fontWeight:700,color:C.goldLight,fontSize:13}}>{c.code}</span>,
            <Badge status={c.type}/>,
            <span style={{fontWeight:600,color:C.cream}}>{c.type==="percent"?`${c.value}%`:`₹${c.value}`}</span>,
            `≥ ${fmt(c.minOrder)}`,
            `${c.used}/${c.usageLimit}`,
            <Badge status={c.status}/>,
            <Btn size="sm" variant="danger" icon={Trash2} onClick={()=>del(c.id)}/>
          ])}
        />
      </div>

      {showModal && (
        <Modal title="Create Coupon" onClose={()=>setShowModal(false)}>
          <Input label="Coupon Code" value={form.code} onChange={e=>setForm({...form,code:e.target.value.toUpperCase()})} placeholder="e.g. BIHU30"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <Select label="Discount Type" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
              options={[{value:"percent",label:"Percentage Off"},{value:"fixed",label:"Fixed Amount Off"}]}/>
            <Input label="Amount" type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/>
            <Input label="Min Order (₹)" type="number" value={form.minOrder} onChange={e=>setForm({...form,minOrder:e.target.value})}/>
            <Input label="Usage Limit" type="number" value={form.usageLimit} onChange={e=>setForm({...form,usageLimit:e.target.value})}/>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:20}}>
            <Btn variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Btn>
            <Btn icon={Tag} onClick={save}>Create Coupon</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: Reviews ────────────────────────────────────────────────────────────
function ReviewsPage() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [filter, setFilter] = useState("all");
  const filtered = reviews.filter(r=>filter==="all"||r.status===filter);
  const approve = (id) => setReviews(rs=>rs.map(r=>r.id===id?{...r,status:"approved"}:r));
  const reject = (id) => setReviews(rs=>rs.map(r=>r.id===id?{...r,status:"rejected"}:r));

  return (
    <div>
      <SectionHeader title="Reviews & Ratings" sub={`${reviews.filter(r=>r.status==="pending").length} pending approval`} />
      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["all","pending","approved","rejected"].map(s=>(
          <button key={s} onClick={()=>setFilter(s)}
            style={{background:filter===s?C.gold:"transparent",color:filter===s?"#0D0905":C.muted,border:`1px solid ${filter===s?C.gold:C.border}`,borderRadius:20,padding:"5px 14px",fontSize:12,fontWeight:600,cursor:"pointer",textTransform:"capitalize"}}>
            {s}
          </button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {filtered.map(r=>(
          <div key={r.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <span style={{color:C.cream,fontWeight:700,fontSize:14}}>{r.headline}</span>
                  <Badge status={r.status}/>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:C.muted,fontSize:11}}>{r.customer}</div>
              </div>
            </div>
            <p style={{color:C.muted,fontSize:13,margin:"0 0 14px"}}>{r.body}</p>
            {r.status==="pending" && (
              <div style={{display:"flex",gap:10}}>
                <Btn size="sm" variant="success" icon={Check} onClick={()=>approve(r.id)}>Approve</Btn>
                <Btn size="sm" variant="danger" icon={X} onClick={()=>reject(r.id)}>Reject</Btn>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: Wholesale ──────────────────────────────────────────────────────────
function WholesalePage() {
  const [enquiries, setEnquiries] = useState(MOCK_ENQUIRIES);
  const updateStatus = (id,status) => setEnquiries(es=>es.map(e=>e.id===id?{...e,status}:e));
  return (
    <div>
      <SectionHeader title="Wholesale Enquiries" sub={`${enquiries.filter(e=>e.status==="new").length} new enquiries`} />
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        {enquiries.map(e=>(
          <div key={e.id} style={{background:C.card,border:`1px solid ${e.status==="new"?C.gold:C.border}`,borderRadius:12,padding:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
                  <span style={{color:C.cream,fontWeight:700,fontSize:15}}>{e.business}</span>
                  <Badge status={e.status}/>
                </div>
                <div style={{color:C.muted,fontSize:12}}>{e.contact} · {e.phone} · {e.city}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:C.gold,fontWeight:700,fontSize:18}}>{e.monthlyKg} kg/mo</div>
              </div>
            </div>
            <p style={{color:C.muted,fontSize:13,margin:"0 0 14px",background:C.bg,borderRadius:8,padding:"10px 14px"}}>{e.message}</p>
            <div style={{display:"flex",gap:10}}>
              {e.status==="new" && <Btn size="sm" variant="secondary" onClick={()=>updateStatus(e.id,"contacted")}>Mark Contacted</Btn>}
              {e.status==="contacted" && <Btn size="sm" variant="success" onClick={()=>updateStatus(e.id,"converted")}>Mark Converted</Btn>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PAGE: Inventory ──────────────────────────────────────────────────────────
function InventoryPage() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [editId, setEditId] = useState(null);
  const [newStock, setNewStock] = useState("");

  const updateStock = (id) => {
    setProducts(ps=>ps.map(p=>p.id===id?{...p,stock:p.stock+parseInt(newStock||0)}:p));
    setEditId(null); 
    setNewStock("");
  };

  return (
    <div>
      <SectionHeader title="Inventory Management" sub="Track and update product stock levels" />
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
        <Table headers={["Product","Category","Current Stock","Status","Action"]}
          rows={products.map(p=>[
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:32, height:32, borderRadius:4, overflow:"hidden", background:C.bg, border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0}}>
                {p.image_url ? <img src={p.image_url} style={{width:"100%", height:"100%", objectFit:"cover"}}/> : <span style={{fontSize:14}}>🍵</span>}
              </div>
              <div><div style={{fontWeight:600,color:C.cream}}>{p.name}</div></div>
            </div>,
            p.category,
            <div style={{color:p.stock===0?C.error:p.stock<15?C.warning:C.success,fontWeight:700,fontSize:18}}>{p.stock}</div>,
            <Badge status={p.stock===0?"inactive":p.stock<15?"processing":"active"}/>,
            editId===p.id ? (
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <input value={newStock} onChange={e=>setNewStock(e.target.value)} placeholder="Add qty"
                  style={{width:70,background:C.bg,border:`1px solid ${C.gold}`,borderRadius:6,color:C.cream,padding:"6px 8px",fontSize:12,outline:"none"}}/>
              </div>
            ) : <span style={{color:C.muted,fontSize:12}}>—</span>,
            editId===p.id ? (
              <div style={{display:"flex",gap:6}}>
                <Btn size="sm" onClick={()=>updateStock(p.id)}>Add Stock</Btn>
              </div>
            ) : (
              <Btn size="sm" variant="secondary" icon={RefreshCw} onClick={()=>{setEditId(p.id);setNewStock("");}}>Restock</Btn>
            )
          ])}
        />
      </div>
    </div>
  );
}

// ─── PAGE: Settings ───────────────────────────────────────────────────────────
function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    storeName:"BARAK Tea", tagline:"Pure CTC Tea from Barak Valley", whatsapp:"+91 98765 43210",
    email:"hello@baraktea.in", minOrder:"200"
  });
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };

  return (
    <div>
      <SectionHeader title="Store Settings" sub="Configure your BARAK Tea store"
        action={<Btn icon={saved?CheckCircle:ShieldCheck} onClick={save}>{saved?"Saved!":"Save Changes"}</Btn>} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <div style={{color:C.gold,fontSize:12,fontWeight:700,textTransform:"uppercase",marginBottom:18}}>Store Identity</div>
          <Input label="Store Name" value={form.storeName} onChange={e=>setForm({...form,storeName:e.target.value})}/>
          <Input label="Tagline" value={form.tagline} onChange={e=>setForm({...form,tagline:e.target.value})}/>
          <Input label="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email"/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <div style={{color:C.gold,fontSize:12,fontWeight:700,textTransform:"uppercase",marginBottom:18}}>Contact & Order</div>
          <Input label="WhatsApp Number" value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})}/>
          <Input label="Minimum Order (₹)" value={form.minOrder} onChange={e=>setForm({...form,minOrder:e.target.value})} type="number"/>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const NAV = [
  { id:"dashboard", label:"Dashboard", icon:LayoutDashboard },
  { id:"products", label:"Products", icon:Package },
  { id:"orders", label:"Orders", icon:ShoppingCart },
  { id:"customers", label:"Customers", icon:Users },
  { id:"inventory", label:"Inventory", icon:Layers },
  { id:"shipments", label:"Shipments", icon:Truck },
  { id:"coupons", label:"Coupons", icon:Tag },
  { id:"reviews", label:"Reviews", icon:Star },
  { id:"wholesale", label:"Wholesale", icon:Inbox },
  { id:"settings", label:"Settings", icon:Settings },
];

export default function AdminPanel() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  const pages = {
    dashboard:<DashboardPage/>, products:<ProductsPage/>, orders:<OrdersPage/>,
    customers:<CustomersPage/>, inventory:<InventoryPage/>, shipments:<ShipmentsPage/>,
    coupons:<CouponsPage/>, reviews:<ReviewsPage/>, wholesale:<WholesalePage/>,
    settings:<SettingsPage/>,
  };

  const SIDEBAR_W = collapsed ? 64 : 220;

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, fontFamily:"'DM Sans', system-ui, sans-serif", color:C.cream, overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:SIDEBAR_W, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", transition:"width 0.25s ease", overflow:"hidden", flexShrink:0, position:"sticky", top:0, height:"100vh", overflowY:"auto" }}>
        {/* Logo */}
        <div style={{ padding:`20px ${collapsed?16:20}px`, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:collapsed?"center":"space-between" }}>
          {!collapsed && (
            <div>
              <div style={{ color:C.gold, fontWeight:800, fontSize:16, letterSpacing:"0.05em" }}>BARAK TEA</div>
              <div style={{ color:C.muted, fontSize:10, marginTop:1 }}>Admin Console</div>
            </div>
          )}
          {collapsed && <span style={{ fontSize:22 }}>☕</span>}
          {!collapsed && (
            <button onClick={()=>setCollapsed(true)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer" }}>
              <ChevronLeft size={16}/>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:"12px 0", overflowY:"auto", minHeight:0 }}>
          {NAV.map(n => {
            const active = page === n.id;
            return (
              <button key={n.id} onClick={()=>setPage(n.id)}
                style={{ width:"100%", background:active?`${C.gold}18`:"transparent", border:"none", borderLeft:active?`3px solid ${C.gold}`:"3px solid transparent", color:active?C.gold:C.muted, cursor:"pointer", display:"flex", alignItems:"center", gap:12, padding:`10px ${collapsed?20:16}px`, fontSize:13, fontWeight:active?700:500, textAlign:"left", transition:"all 0.15s", position:"relative" }}>
                <n.icon size={16} style={{ flexShrink:0 }}/>
                {!collapsed && <span>{n.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse/Expand button */}
        {collapsed && (
          <div style={{ padding:"16px", borderTop:`1px solid ${C.border}` }}>
            <button onClick={()=>setCollapsed(false)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", width:"100%" }}>
              <ChevronRight size={16}/>
            </button>
          </div>
        )}

        {/* User section */}
        {!collapsed && (
          <div style={{ padding:"16px 20px", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:C.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#0D0905", flexShrink:0 }}>B</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:C.cream, fontSize:12, fontWeight:600 }}>Admin</div>
              <div style={{ color:C.muted, fontSize:10 }}>BARAK Tea</div>
            </div>
            <LogOut size={14} color={C.muted} style={{ cursor:"pointer", flexShrink:0 }}/>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex:1,display:"flex", flexDirection:"column", overflow:"hidden", minWidth:0, minHeight:0 }}>
        {/* Top bar */}
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"14px 28px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ color:C.muted, fontSize:12 }}>BARAK Tea</span>
            <ChevronRight size={12} color={C.muted}/>
            <span style={{ color:C.gold, fontSize:12, fontWeight:600, textTransform:"capitalize" }}>{page}</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ position:"relative" }}>
              <Bell size={18} color={C.muted} style={{ cursor:"pointer" }}/>
              <span style={{ position:"absolute", top:-4, right:-4, background:C.error, color:"#fff", borderRadius:"50%", width:14, height:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700 }}>3</span>
            </div>
            <div style={{ color:C.muted, fontSize:11 }}>{new Date().toLocaleDateString()}</div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex:1, padding:28, overflowY:"auto", minHeight:0 }}>
          {pages[page]}
        </div>
      </div>
    </div>
  );
}
