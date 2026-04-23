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

// ─── Mock Data ────────────────────────────────────────────────────────────────
const PRODUCTS_INIT = [
  { id:"BRK-001", name:"Classic CTC Dust", category:"Everyday", price:180, mrp:220, stock:142, sold:340, status:"active", packs:["250g","500g","1kg"], img:"🍵" },
  { id:"BRK-002", name:"Premium Leaf Grade CTC", category:"Premium", price:280, mrp:340, stock:68, sold:188, status:"active", packs:["250g","500g"], img:"🌿" },
  { id:"BRK-003", name:"Morning Masala Blend", category:"Blends", price:220, mrp:260, stock:12, sold:220, status:"active", packs:["200g","500g"], img:"✨" },
  { id:"BRK-004", name:"Gift Box Collection", category:"Gifts", price:480, mrp:580, stock:34, sold:95, status:"active", packs:["Assorted 3-pack"], img:"🎁" },
  { id:"BRK-005", name:"Festival Special Box", category:"Gifts", price:650, mrp:799, stock:0, sold:48, status:"inactive", packs:["Limited Edition"], img:"🎊" },
  { id:"BRK-006", name:"Morning Ritual Bundle", category:"Blends", price:399, mrp:499, stock:25, sold:62, status:"active", packs:["Combo Pack"], img:"☕" },
];

const ORDERS_INIT = [
  { id:"ORD-1082", customer:"Priya Sharma", phone:"+91 9876543210", city:"Silchar", items:[{name:"Classic CTC Dust",qty:2,variant:"500g",price:180}], total:410, status:"delivered", channel:"whatsapp", date:"2026-04-20", address:"12 Civil Lines, Silchar", notes:"Leave at gate" },
  { id:"ORD-1081", customer:"Rashed Ahmed", phone:"+91 9123456789", city:"Guwahati", items:[{name:"Premium Leaf Grade CTC",qty:1,variant:"250g",price:280},{name:"Morning Masala Blend",qty:1,variant:"200g",price:220}], total:540, status:"shipped", channel:"whatsapp", date:"2026-04-19", address:"45 GS Road, Guwahati", notes:"" },
  { id:"ORD-1080", customer:"Anjali Das", phone:"+91 9988776655", city:"Kolkata", items:[{name:"Gift Box Collection",qty:1,variant:"Assorted 3-pack",price:480}], total:530, status:"processing", channel:"web", date:"2026-04-19", address:"77 Park Street, Kolkata", notes:"Gift wrap please" },
  { id:"ORD-1079", customer:"Karim Uddin", phone:"+91 9456123789", city:"Silchar", items:[{name:"Classic CTC Dust",qty:4,variant:"1kg",price:180}], total:760, status:"confirmed", channel:"whatsapp", date:"2026-04-18", address:"Station Road, Silchar", notes:"Bulk order" },
  { id:"ORD-1078", customer:"Sujata Roy", phone:"+91 9654321098", city:"Hailakandi", items:[{name:"Morning Masala Blend",qty:2,variant:"500g",price:220}], total:490, status:"cancelled", channel:"whatsapp", date:"2026-04-17", address:"Hailakandi Town", notes:"" },
  { id:"ORD-1077", customer:"Farhan Khan", phone:"+91 9011223344", city:"Karimganj", items:[{name:"Morning Ritual Bundle",qty:1,variant:"Combo Pack",price:399}], total:449, status:"delivered", channel:"web", date:"2026-04-16", address:"Karimganj Market", notes:"" },
];

const CUSTOMERS_INIT = [
  { id:"C001", name:"Priya Sharma", phone:"+91 9876543210", email:"priya@email.com", city:"Silchar", orders:12, spent:4820, points:482, tier:"Gold", joined:"2025-08-15" },
  { id:"C002", name:"Rashed Ahmed", phone:"+91 9123456789", email:"rashed@email.com", city:"Guwahati", orders:5, spent:2100, points:210, tier:"Silver", joined:"2025-10-20" },
  { id:"C003", name:"Anjali Das", phone:"+91 9988776655", email:"anjali@email.com", city:"Kolkata", orders:8, spent:3840, points:384, tier:"Silver", joined:"2025-09-01" },
  { id:"C004", name:"Karim Uddin", phone:"+91 9456123789", email:"", city:"Silchar", orders:3, spent:1480, points:148, tier:"Bronze", joined:"2026-01-10" },
  { id:"C005", name:"Sujata Roy", phone:"+91 9654321098", email:"sujata@email.com", city:"Hailakandi", orders:2, spent:980, points:98, tier:"Bronze", joined:"2026-02-20" },
  { id:"C006", name:"Farhan Khan", phone:"+91 9011223344", email:"farhan@email.com", city:"Karimganj", orders:6, spent:2590, points:259, tier:"Silver", joined:"2025-11-05" },
];

const SHIPMENTS_INIT = [
  { id:"SHP-441", orderId:"ORD-1082", customer:"Priya Sharma", city:"Silchar", partner:"India Post", tracking:"IP9876543IN", status:"delivered", dispatched:"2026-04-21", eta:"2026-04-23" },
  { id:"SHP-440", orderId:"ORD-1081", customer:"Rashed Ahmed", city:"Guwahati", partner:"DTDC", tracking:"DTDC789012", status:"in_transit", dispatched:"2026-04-20", eta:"2026-04-24" },
  { id:"SHP-439", orderId:"ORD-1080", customer:"Anjali Das", city:"Kolkata", partner:"India Post", tracking:"IP8765432IN", status:"out_for_delivery", dispatched:"2026-04-20", eta:"2026-04-22" },
  { id:"SHP-438", orderId:"ORD-1077", customer:"Farhan Khan", city:"Karimganj", partner:"Own Delivery", tracking:"OWN-2026-004", status:"delivered", dispatched:"2026-04-17", eta:"2026-04-18" },
];

const COUPONS_INIT = [
  { id:"CP001", code:"EID2026", type:"percent", value:15, minOrder:299, usageLimit:200, used:87, validFrom:"2026-03-28", validUntil:"2026-04-10", status:"expired" },
  { id:"CP002", code:"FIRST10", type:"percent", value:10, minOrder:200, usageLimit:500, used:143, validFrom:"2026-01-01", validUntil:"2026-12-31", status:"active" },
  { id:"CP003", code:"BIHU50", type:"fixed", value:50, minOrder:399, usageLimit:100, used:32, validFrom:"2026-04-14", validUntil:"2026-04-21", status:"active" },
  { id:"CP004", code:"FREESHIP", type:"shipping", value:0, minOrder:499, usageLimit:1000, used:256, validFrom:"2026-01-01", validUntil:"2026-12-31", status:"active" },
];

const REVIEWS_INIT = [
  { id:"RV001", product:"Classic CTC Dust", customer:"Priya S.", rating:5, headline:"Best chai ever!", body:"The aroma is incredible. Perfect for morning chai. Very fresh.", status:"pending", date:"2026-04-21" },
  { id:"RV002", product:"Morning Masala Blend", customer:"Rashed A.", rating:4, headline:"Great masala blend", body:"Nice spice balance. Could be a bit stronger but very satisfying.", status:"pending", date:"2026-04-20" },
  { id:"RV003", product:"Gift Box Collection", customer:"Anjali D.", rating:5, headline:"Perfect gift!", body:"Gorgeous packaging. Sent to my parents in Silchar and they loved it.", status:"approved", date:"2026-04-19" },
  { id:"RV004", product:"Classic CTC Dust", customer:"Farhan K.", rating:3, headline:"Good but pricey", body:"Quality is good but wish delivery was faster to Karimganj.", status:"rejected", date:"2026-04-18" },
];

const ENQUIRIES_INIT = [
  { id:"WS001", business:"Noor Traders", contact:"Mr. Noor", phone:"+91 9876001122", city:"Silchar", monthlyKg:50, message:"Interested in bulk CTC. Please send pricing.", status:"new", date:"2026-04-21" },
  { id:"WS002", business:"Ahmed Kirana Store", contact:"Ahmed Ali", phone:"+91 9876003344", city:"Karimganj", monthlyKg:20, message:"Want monthly supply for our store.", status:"contacted", date:"2026-04-18" },
  { id:"WS003", business:"Valley Mart", contact:"Sanjay B.", phone:"+91 9876005566", city:"Hailakandi", monthlyKg:100, message:"Large quantity requirement. Can we meet?", status:"converted", date:"2026-04-10" },
];

// ─── Utility Functions ────────────────────────────────────────────────────────
const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;
const pct = (a, b) => b ? ((a-b)/b*100).toFixed(1) : 0;

// ─── Sub-Components ───────────────────────────────────────────────────────────

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

function Modal({ title, onClose, children, width=600 }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }} onClick={onClose}>
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:16, width:"100%", maxWidth:width, maxHeight:"90vh", overflowY:"auto" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", borderBottom:`1px solid ${C.border}` }}>
          <span style={{ color:C.cream, fontWeight:700, fontSize:16 }}>{title}</span>
          <button onClick={onClose} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer" }}><X size={18}/></button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", color:C.muted, fontSize:11, fontWeight:600, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.cream, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box" }} />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom:14 }}>
      {label && <label style={{ display:"block", color:C.muted, fontSize:11, fontWeight:600, marginBottom:5, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <select value={value} onChange={onChange}
        style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.cream, padding:"10px 12px", fontSize:14, outline:"none", boxSizing:"border-box" }}>
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

// ─── PAGE: Dashboard ──────────────────────────────────────────────────────────
function DashboardPage() {
  const totalRevenue = ORDERS_INIT.filter(o=>o.status!=="cancelled").reduce((a,o)=>a+o.total,0);
  const monthOrders = ORDERS_INIT.length;
  const activeProducts = PRODUCTS_INIT.filter(p=>p.status==="active").length;
  const lowStock = PRODUCTS_INIT.filter(p=>p.stock<15).length;

  const recentOrders = ORDERS_INIT.slice(0,5);

  return (
    <div>
      <SectionHeader title="Dashboard" sub="Welcome back! Here's what's happening with BARAK Tea today." />

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:28 }}>
        <StatCard icon={IndianRupee} label="Monthly Revenue" value={fmt(totalRevenue)} sub="April 2026" trend={12.4} />
        <StatCard icon={ShoppingCart} label="Total Orders" value={monthOrders} sub="This month" trend={8.2} color="#2563EB" />
        <StatCard icon={Users} label="Active Customers" value={CUSTOMERS_INIT.length} sub="Registered users" trend={18.5} color="#9333EA" />
        <StatCard icon={Package} label="Products Active" value={activeProducts} sub={`${lowStock} low stock`} color={lowStock>0?C.warning:C.success} />
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20, marginBottom:28 }}>
        {/* Revenue chart (visual) */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <div style={{ color:C.cream, fontWeight:700, fontSize:15 }}>Revenue — Last 7 Days</div>
            <Badge status="active" />
          </div>
          <WeeklyChart />
        </div>
        {/* Order status donut */}
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ color:C.cream, fontWeight:700, fontSize:15, marginBottom:20 }}>Order Status</div>
          <StatusDonut />
        </div>
      </div>

      {/* Recent orders + quick actions */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:20 }}>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
          <div style={{ color:C.cream, fontWeight:700, fontSize:15, marginBottom:16 }}>Recent Orders</div>
          <Table
            headers={["Order","Customer","Amount","Status","Channel"]}
            rows={recentOrders.map(o=>[
              <span style={{color:C.gold,fontWeight:600}}>{o.id}</span>,
              o.customer,
              <span style={{fontWeight:600}}>{fmt(o.total)}</span>,
              <Badge status={o.status}/>,
              <Badge status={o.channel}/>,
            ])}
          />
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Low stock alerts */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
            <div style={{ color:C.cream, fontWeight:700, fontSize:15, marginBottom:14 }}>⚠️ Low Stock Alerts</div>
            {PRODUCTS_INIT.filter(p=>p.stock<20).map(p=>(
              <div key={p.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ color:C.cream, fontSize:12, fontWeight:600 }}>{p.name}</div>
                  <div style={{ color:p.stock===0?C.error:C.warning, fontSize:11 }}>{p.stock===0?"OUT OF STOCK":`${p.stock} units left`}</div>
                </div>
                <Btn size="sm" variant="secondary">Restock</Btn>
              </div>
            ))}
          </div>
          {/* Quick actions */}
          <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
            <div style={{ color:C.cream, fontWeight:700, fontSize:15, marginBottom:14 }}>Quick Actions</div>
            {[
              { icon:Plus, label:"Add New Product", color:C.gold },
              { icon:MessageCircle, label:"Broadcast WhatsApp", color:"#25D366" },
              { icon:Tag, label:"Create Coupon", color:"#8B5CF6" },
              { icon:Download, label:"Export Orders CSV", color:C.info },
            ].map((a,i)=>(
              <button key={i} style={{ width:"100%", background:"transparent", border:"none", textAlign:"left", color:C.cream, cursor:"pointer", display:"flex", alignItems:"center", gap:10, padding:"9px 0", borderBottom:i<3?`1px solid ${C.border}`:"none" }}>
                <a.icon size={15} color={a.color}/><span style={{fontSize:13}}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeeklyChart() {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const vals = [1200,980,1450,800,1680,2100,1560];
  const max = Math.max(...vals);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:120 }}>
      {days.map((d,i)=>(
        <div key={d} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
          <div style={{ width:"100%", background:`linear-gradient(to top, ${C.gold}, ${C.goldLight})`, borderRadius:"4px 4px 0 0", height:`${(vals[i]/max)*100}%`, minHeight:4, opacity:i===5?1:0.6 }}/>
          <div style={{ color:C.muted, fontSize:10 }}>{d}</div>
        </div>
      ))}
    </div>
  );
}

function StatusDonut() {
  const data = [
    { label:"Delivered", count:2, color:"#34D399" },
    { label:"Shipped", count:1, color:"#60A5FA" },
    { label:"Processing", count:1, color:"#FBBF24" },
    { label:"Confirmed", count:1, color:"#D4D400" },
    { label:"Cancelled", count:1, color:"#F87171" },
  ];
  const total = data.reduce((a,d)=>a+d.count,0);
  return (
    <div>
      {data.map((d,i)=>(
        <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
          <div style={{ width:10, height:10, borderRadius:"50%", background:d.color, flexShrink:0 }}/>
          <div style={{ flex:1, color:C.muted, fontSize:12 }}>{d.label}</div>
          <div style={{ color:C.cream, fontSize:12, fontWeight:600 }}>{d.count}</div>
          <div style={{ width:60, background:C.border, borderRadius:4, height:5 }}>
            <div style={{ width:`${(d.count/total)*100}%`, background:d.color, height:"100%", borderRadius:4 }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PAGE: Products ───────────────────────────────────────────────────────────
function ProductsPage() {
  const [products, setProducts] = useState(PRODUCTS_INIT);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name:"", category:"Everyday", price:"", mrp:"", stock:"", packs:"", status:"active" });

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const openAdd = () => { setForm({ name:"", category:"Everyday", price:"", mrp:"", stock:"", packs:"", status:"active" }); setEditing(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ name:p.name, category:p.category, price:p.price, mrp:p.mrp, stock:p.stock, packs:p.packs.join(", "), status:p.status }); setEditing(p.id); setShowModal(true); };
  const save = () => {
    if(editing) {
      setProducts(ps=>ps.map(p=>p.id===editing?{...p,...form,price:+form.price,mrp:+form.mrp,stock:+form.stock,packs:form.packs.split(",").map(s=>s.trim())}:p));
    } else {
      const newP = { id:`BRK-${Math.floor(Math.random()*900)+100}`, ...form, price:+form.price, mrp:+form.mrp, stock:+form.stock, sold:0, packs:form.packs.split(",").map(s=>s.trim()), img:"🍵" };
      setProducts(ps=>[...ps, newP]);
    }
    setShowModal(false);
  };
  const del = (id) => setProducts(ps=>ps.filter(p=>p.id!==id));
  const toggleStatus = (id) => setProducts(ps=>ps.map(p=>p.id===id?{...p,status:p.status==="active"?"inactive":"active"}:p));

  return (
    <div>
      <SectionHeader title="Products" sub={`${products.length} total products · ${products.filter(p=>p.status==="active").length} active`}
        action={<Btn icon={Plus} onClick={openAdd}>Add Product</Btn>} />

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        <div style={{ display:"flex", gap:12, marginBottom:18 }}>
          <div style={{ flex:1, position:"relative" }}>
            <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.muted }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products..."
              style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.cream, padding:"9px 12px 9px 34px", fontSize:13, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <Btn variant="secondary" icon={Filter} size="md">Filter</Btn>
          <Btn variant="secondary" icon={Download} size="md">Export</Btn>
        </div>

        <Table headers={["ID","Product","Category","Price","MRP","Stock","Sold","Status","Actions"]}
          rows={filtered.map(p=>[
            <span style={{color:C.muted,fontSize:11}}>{p.id}</span>,
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>{p.img}</span>
              <div>
                <div style={{fontWeight:600,color:C.cream}}>{p.name}</div>
                <div style={{fontSize:11,color:C.muted}}>{p.packs.join(" · ")}</div>
              </div>
            </div>,
            <Badge status={p.category.toLowerCase()==="everyday"?"active":p.category.toLowerCase()==="premium"?"new":p.category.toLowerCase()==="gifts"?"whatsapp":"confirmed"} />,
            <span style={{fontWeight:600,color:C.gold}}>{fmt(p.price)}</span>,
            <span style={{color:C.muted,textDecoration:"line-through"}}>{fmt(p.mrp)}</span>,
            <span style={{color:p.stock===0?C.error:p.stock<15?C.warning:C.success,fontWeight:600}}>{p.stock===0?"OUT":p.stock}</span>,
            p.sold,
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
        <Modal title={editing?"Edit Product":"Add New Product"} onClose={()=>setShowModal(false)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0 16px"}}>
            <div style={{gridColumn:"1/-1"}}><Input label="Product Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
            <Select label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} options={["Everyday","Premium","Blends","Gifts"].map(v=>({value:v,label:v}))}/>
            <Select label="Status" value={form.status} onChange={e=>setForm({...form,status:e.target.value})} options={[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"}]}/>
            <Input label="Selling Price (₹)" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
            <Input label="MRP (₹)" type="number" value={form.mrp} onChange={e=>setForm({...form,mrp:e.target.value})}/>
            <Input label="Stock Quantity" type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}/>
            <div style={{gridColumn:"1/-1"}}><Input label="Pack Sizes (comma separated)" value={form.packs} onChange={e=>setForm({...form,packs:e.target.value})} placeholder="250g, 500g, 1kg"/></div>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Btn>
            <Btn onClick={save}>{editing?"Save Changes":"Add Product"}</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: Orders ─────────────────────────────────────────────────────────────
function OrdersPage() {
  const [orders, setOrders] = useState(ORDERS_INIT);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  const statuses = ["all","confirmed","processing","shipped","delivered","cancelled"];
  const filtered = orders.filter(o=>(filter==="all"||o.status===filter)&&(o.customer.toLowerCase().includes(search.toLowerCase())||o.id.toLowerCase().includes(search.toLowerCase())));

  const updateStatus = (id, status) => {
    setOrders(os=>os.map(o=>o.id===id?{...o,status}:o));
    if(selected?.id===id) setSelected(s=>({...s,status}));
  };

  const waMessage = (o) => {
    const items = o.items.map(i=>`  • ${i.name} (${i.variant}) x${i.qty}`).join("\n");
    return `Hello ${o.customer}! 🍵\n\nYour BARAK Tea order *${o.id}* has been ${o.status}.\n\n${items}\n\nTotal: ₹${o.total}\n\nThank you for choosing BARAK Tea! ☕`;
  };

  return (
    <div>
      <SectionHeader title="Orders" sub={`${orders.length} total orders · ${orders.filter(o=>o.status==="processing"||o.status==="confirmed").length} pending action`}
        action={<Btn icon={Download} variant="secondary">Export CSV</Btn>} />

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        {/* Filter tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
          {statuses.map(s=>(
            <button key={s} onClick={()=>setFilter(s)}
              style={{ background:filter===s?C.gold:"transparent", color:filter===s?"#0D0905":C.muted, border:`1px solid ${filter===s?C.gold:C.border}`, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:600, cursor:"pointer", textTransform:"capitalize" }}>
              {s==="all"?"All Orders":s}
            </button>
          ))}
        </div>
        <div style={{ position:"relative", marginBottom:18 }}>
          <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.muted }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by order ID or customer..."
            style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.cream, padding:"9px 12px 9px 34px", fontSize:13, outline:"none", boxSizing:"border-box" }}/>
        </div>

        <Table headers={["Order ID","Customer","City","Items","Total","Status","Channel","Date","Actions"]}
          rows={filtered.map(o=>[
            <span style={{color:C.gold,fontWeight:700}}>{o.id}</span>,
            <div>
              <div style={{fontWeight:600}}>{o.customer}</div>
              <div style={{fontSize:11,color:C.muted}}>{o.phone}</div>
            </div>,
            <div style={{display:"flex",alignItems:"center",gap:5}}><MapPin size={11} color={C.muted}/>{o.city}</div>,
            <span style={{color:C.muted}}>{o.items.length} item(s)</span>,
            <span style={{fontWeight:700,color:C.gold}}>{fmt(o.total)}</span>,
            <Badge status={o.status}/>,
            <Badge status={o.channel}/>,
            <span style={{color:C.muted,fontSize:11}}>{o.date}</span>,
            <div style={{display:"flex",gap:6}}>
              <Btn size="sm" variant="secondary" icon={Eye} onClick={()=>setSelected(o)}>View</Btn>
              <Btn size="sm" variant="success" icon={MessageCircle} onClick={()=>window.open(`https://wa.me/${o.phone.replace(/\D/g,"")}?text=${encodeURIComponent(waMessage(o))}`)}>WA</Btn>
            </div>
          ])}
        />
      </div>

      {selected && (
        <Modal title={`Order ${selected.id}`} onClose={()=>setSelected(null)} width={680}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
            <div style={{background:C.bg,borderRadius:10,padding:16}}>
              <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Customer</div>
              <div style={{color:C.cream,fontWeight:600,fontSize:15,marginBottom:4}}>{selected.customer}</div>
              <div style={{color:C.muted,fontSize:12,display:"flex",alignItems:"center",gap:5}}><Phone size={11}/>{selected.phone}</div>
              <div style={{color:C.muted,fontSize:12,marginTop:4,display:"flex",alignItems:"center",gap:5}}><MapPin size={11}/>{selected.address}</div>
              {selected.notes && <div style={{color:C.warning,fontSize:12,marginTop:8}}>📝 {selected.notes}</div>}
            </div>
            <div style={{background:C.bg,borderRadius:10,padding:16}}>
              <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Order Info</div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:C.muted,fontSize:12}}>Date</span><span style={{color:C.cream,fontSize:12}}>{selected.date}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><span style={{color:C.muted,fontSize:12}}>Channel</span><Badge status={selected.channel}/></div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{color:C.muted,fontSize:12}}>Status</span><Badge status={selected.status}/></div>
            </div>
          </div>
          <div style={{background:C.bg,borderRadius:10,padding:16,marginBottom:20}}>
            <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:12,textTransform:"uppercase"}}>Items Ordered</div>
            {selected.items.map((item,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<selected.items.length-1?`1px solid ${C.border}`:"none"}}>
                <div>
                  <div style={{color:C.cream,fontWeight:600,fontSize:13}}>{item.name}</div>
                  <div style={{color:C.muted,fontSize:11}}>{item.variant} × {item.qty}</div>
                </div>
                <div style={{color:C.gold,fontWeight:700}}>{fmt(item.price * item.qty)}</div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:12,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
              <span style={{color:C.cream,fontWeight:700}}>Total</span>
              <span style={{color:C.gold,fontWeight:700,fontSize:18}}>{fmt(selected.total)}</span>
            </div>
          </div>
          <div style={{marginBottom:20}}>
            <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:10,textTransform:"uppercase"}}>Update Status</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {["confirmed","processing","shipped","delivered","cancelled"].map(s=>(
                <Btn key={s} size="sm" variant={selected.status===s?"primary":"secondary"} onClick={()=>updateStatus(selected.id,s)}>{s.charAt(0).toUpperCase()+s.slice(1)}</Btn>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn icon={MessageCircle} onClick={()=>window.open(`https://wa.me/${selected.phone.replace(/\D/g,"")}?text=${encodeURIComponent(waMessage(selected))}`)}>Send WhatsApp Update</Btn>
            <Btn variant="secondary" icon={Truck}>Create Shipment</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: Customers ──────────────────────────────────────────────────────────
function CustomersPage() {
  const [customers] = useState(CUSTOMERS_INIT);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const filtered = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || c.city.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <SectionHeader title="Customers" sub={`${customers.length} registered customers`}
        action={<Btn icon={Download} variant="secondary">Export</Btn>} />

      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
        <StatCard icon={Users} label="Total Customers" value={customers.length} color={C.gold}/>
        <StatCard icon={Star} label="Gold Members" value={customers.filter(c=>c.tier==="Gold").length} color="#F59E0B"/>
        <StatCard icon={IndianRupee} label="Avg Customer LTV" value={fmt(Math.round(customers.reduce((a,c)=>a+c.spent,0)/customers.length))} color="#8B5CF6"/>
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        <div style={{ position:"relative", marginBottom:18 }}>
          <Search size={14} style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.muted }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name, phone or city..."
            style={{ width:"100%", background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.cream, padding:"9px 12px 9px 34px", fontSize:13, outline:"none", boxSizing:"border-box" }}/>
        </div>
        <Table headers={["Customer","Phone","City","Orders","Total Spent","Points","Tier","Joined","Actions"]}
          rows={filtered.map(c=>[
            <div><div style={{fontWeight:600}}>{c.name}</div><div style={{fontSize:11,color:C.muted}}>{c.email||"—"}</div></div>,
            c.phone,
            c.city,
            <span style={{fontWeight:600}}>{c.orders}</span>,
            <span style={{color:C.gold,fontWeight:700}}>{fmt(c.spent)}</span>,
            <span style={{color:C.goldLight}}>{c.points} pts</span>,
            <Badge status={c.tier.toLowerCase()}/>,
            <span style={{color:C.muted,fontSize:11}}>{c.joined}</span>,
            <div style={{display:"flex",gap:6}}>
              <Btn size="sm" variant="secondary" icon={Eye} onClick={()=>setSelected(c)}>View</Btn>
              <Btn size="sm" variant="success" icon={MessageCircle} onClick={()=>window.open(`https://wa.me/${c.phone.replace(/\D/g,"")}`)} />
            </div>
          ])}
        />
      </div>

      {selected && (
        <Modal title={selected.name} onClose={()=>setSelected(null)}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            {[
              {label:"Phone",value:selected.phone},
              {label:"Email",value:selected.email||"Not provided"},
              {label:"City",value:selected.city},
              {label:"Member Since",value:selected.joined},
              {label:"Total Orders",value:selected.orders},
              {label:"Total Spent",value:fmt(selected.spent)},
              {label:"Loyalty Points",value:`${selected.points} pts`},
              {label:"Tier",value:selected.tier},
            ].map((f,i)=>(
              <div key={i} style={{background:C.bg,borderRadius:8,padding:12}}>
                <div style={{color:C.muted,fontSize:10,fontWeight:600,textTransform:"uppercase",marginBottom:3}}>{f.label}</div>
                <div style={{color:C.cream,fontWeight:600}}>{f.value}</div>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <Btn icon={MessageCircle} onClick={()=>window.open(`https://wa.me/${selected.phone.replace(/\D/g,"")}`)} >Message on WhatsApp</Btn>
            <Btn variant="secondary" icon={Star}>Adjust Points</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: Shipments ──────────────────────────────────────────────────────────
function ShipmentsPage() {
  const [shipments, setShipments] = useState(SHIPMENTS_INIT);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ orderId:"", customer:"", city:"", partner:"India Post", tracking:"" });

  const save = () => {
    setShipments(ss=>[...ss,{ id:`SHP-${Math.floor(Math.random()*900)+100}`, ...form, status:"in_transit", dispatched:new Date().toISOString().slice(0,10), eta:"" }]);
    setShowModal(false);
  };

  const updateStatus = (id,status) => setShipments(ss=>ss.map(s=>s.id===id?{...s,status}:s));

  return (
    <div>
      <SectionHeader title="Shipments" sub={`${shipments.length} shipments tracked`}
        action={<Btn icon={Plus} onClick={()=>setShowModal(true)}>Create Shipment</Btn>} />

      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        {[
          {label:"In Transit",count:shipments.filter(s=>s.status==="in_transit").length,color:"#60A5FA"},
          {label:"Out for Delivery",count:shipments.filter(s=>s.status==="out_for_delivery").length,color:"#84CC16"},
          {label:"Delivered",count:shipments.filter(s=>s.status==="delivered").length,color:"#34D399"},
          {label:"Total",count:shipments.length,color:C.gold},
        ].map((s,i)=>(
          <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
            <div style={{color:C.muted,fontSize:11,fontWeight:600,marginBottom:6,textTransform:"uppercase"}}>{s.label}</div>
            <div style={{color:s.color,fontSize:28,fontWeight:700}}>{s.count}</div>
          </div>
        ))}
      </div>

      <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:12, padding:22 }}>
        <Table headers={["Ship ID","Order","Customer","City","Partner","Tracking","Status","Dispatched","ETA","Actions"]}
          rows={shipments.map(s=>[
            <span style={{color:C.gold,fontWeight:700}}>{s.id}</span>,
            <span style={{color:C.muted}}>{s.orderId}</span>,
            s.customer,
            s.city,
            s.partner,
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{fontSize:11,fontFamily:"monospace",color:C.cream}}>{s.tracking}</span>
              <Copy size={11} style={{cursor:"pointer",color:C.muted}} onClick={()=>navigator.clipboard?.writeText(s.tracking)}/>
            </div>,
            <Badge status={s.status}/>,
            <span style={{color:C.muted,fontSize:11}}>{s.dispatched}</span>,
            <span style={{color:C.muted,fontSize:11}}>{s.eta||"—"}</span>,
            <div style={{display:"flex",gap:6}}>
              {s.status!=="delivered" && <Btn size="sm" variant="success" onClick={()=>updateStatus(s.id,"delivered")}>✓ Delivered</Btn>}
              {s.status==="in_transit" && <Btn size="sm" variant="secondary" onClick={()=>updateStatus(s.id,"out_for_delivery")}>Out for Del.</Btn>}
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
          <Input label="ETA" type="date" value={form.eta} onChange={e=>setForm({...form,eta:e.target.value})}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
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
  const [coupons, setCoupons] = useState(COUPONS_INIT);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code:"", type:"percent", value:"", minOrder:"", usageLimit:"", validFrom:"", validUntil:"" });

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
        <Table headers={["Code","Type","Value","Min Order","Usage","Valid Until","Status","Actions"]}
          rows={coupons.map(c=>[
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontFamily:"monospace",fontWeight:700,color:C.goldLight,fontSize:13}}>{c.code}</span>
              <Copy size={12} style={{cursor:"pointer",color:C.muted}} onClick={()=>navigator.clipboard?.writeText(c.code)}/>
            </div>,
            <Badge status={c.type}/>,
            <span style={{fontWeight:600,color:C.cream}}>{c.type==="percent"?`${c.value}%`:c.type==="shipping"?"Free Ship":`₹${c.value}`}</span>,
            `≥ ${fmt(c.minOrder)}`,
            <div>
              <div style={{fontWeight:600,color:C.cream}}>{c.used}/{c.usageLimit}</div>
              <div style={{width:60,height:4,background:C.border,borderRadius:4,marginTop:4}}>
                <div style={{width:`${(c.used/c.usageLimit)*100}%`,height:"100%",background:C.gold,borderRadius:4}}/>
              </div>
            </div>,
            <span style={{color:C.muted,fontSize:12}}>{c.validUntil}</span>,
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
              options={[{value:"percent",label:"Percentage Off"},{value:"fixed",label:"Fixed Amount Off"},{value:"shipping",label:"Free Shipping"}]}/>
            <Input label={form.type==="percent"?"Discount %":"Amount (₹)"} type="number" value={form.value} onChange={e=>setForm({...form,value:e.target.value})}/>
            <Input label="Min Order (₹)" type="number" value={form.minOrder} onChange={e=>setForm({...form,minOrder:e.target.value})}/>
            <Input label="Usage Limit" type="number" value={form.usageLimit} onChange={e=>setForm({...form,usageLimit:e.target.value})}/>
            <Input label="Valid From" type="date" value={form.validFrom} onChange={e=>setForm({...form,validFrom:e.target.value})}/>
            <Input label="Valid Until" type="date" value={form.validUntil} onChange={e=>setForm({...form,validUntil:e.target.value})}/>
          </div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
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
  const [reviews, setReviews] = useState(REVIEWS_INIT);
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
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {"★★★★★".slice(0,r.rating).split("").map((_,i)=><span key={i} style={{color:C.gold}}>★</span>)}
                  {"★★★★★".slice(r.rating).split("").map((_,i)=><span key={i} style={{color:C.border}}>★</span>)}
                  <span style={{color:C.muted,fontSize:11,marginLeft:4}}>{r.product}</span>
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:C.muted,fontSize:11}}>{r.customer}</div>
                <div style={{color:C.muted,fontSize:11}}>{r.date}</div>
              </div>
            </div>
            <p style={{color:C.muted,fontSize:13,margin:"0 0 14px",lineHeight:1.5}}>{r.body}</p>
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
  const [enquiries, setEnquiries] = useState(ENQUIRIES_INIT);
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
                  {e.status==="new" && <span style={{color:C.gold,fontSize:10,fontWeight:700}}>● NEW</span>}
                </div>
                <div style={{color:C.muted,fontSize:12}}>Contact: {e.contact} · {e.phone} · {e.city}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:C.gold,fontWeight:700,fontSize:18}}>{e.monthlyKg} kg/mo</div>
                <div style={{color:C.muted,fontSize:11}}>{e.date}</div>
              </div>
            </div>
            <p style={{color:C.muted,fontSize:13,margin:"0 0 14px",lineHeight:1.5,background:C.bg,borderRadius:8,padding:"10px 14px"}}>{e.message}</p>
            <div style={{display:"flex",gap:10}}>
              <Btn size="sm" icon={MessageCircle} onClick={()=>window.open(`https://wa.me/${e.phone.replace(/\D/g,"")}`)} >WhatsApp</Btn>
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
  const [products, setProducts] = useState(PRODUCTS_INIT);
  const [editId, setEditId] = useState(null);
  const [newStock, setNewStock] = useState("");

  const updateStock = (id) => {
    setProducts(ps=>ps.map(p=>p.id===id?{...p,stock:p.stock+parseInt(newStock||0)}:p));
    setEditId(null); setNewStock("");
  };

  return (
    <div>
      <SectionHeader title="Inventory Management" sub="Track and update product stock levels" />
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:24}}>
        <StatCard icon={Box} label="Total SKUs" value={products.length} color={C.gold}/>
        <StatCard icon={AlertTriangle} label="Low Stock (<15)" value={products.filter(p=>p.stock>0&&p.stock<15).length} color={C.warning}/>
        <StatCard icon={XCircle} label="Out of Stock" value={products.filter(p=>p.stock===0).length} color={C.error}/>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
        <Table headers={["Product","Category","Current Stock","Status","Restock","Action"]}
          rows={products.map(p=>[
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:18}}>{p.img}</span>
              <div><div style={{fontWeight:600,color:C.cream}}>{p.name}</div><div style={{fontSize:11,color:C.muted}}>{p.id}</div></div>
            </div>,
            p.category,
            <div>
              <div style={{color:p.stock===0?C.error:p.stock<15?C.warning:C.success,fontWeight:700,fontSize:18}}>{p.stock}</div>
              <div style={{width:80,height:5,background:C.border,borderRadius:4,marginTop:4}}>
                <div style={{width:`${Math.min((p.stock/200)*100,100)}%`,height:"100%",background:p.stock===0?C.error:p.stock<15?C.warning:C.success,borderRadius:4}}/>
              </div>
            </div>,
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
                <Btn size="sm" variant="secondary" onClick={()=>setEditId(null)}>Cancel</Btn>
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

// ─── PAGE: Analytics ──────────────────────────────────────────────────────────
function AnalyticsPage() {
  const months = ["Nov","Dec","Jan","Feb","Mar","Apr"];
  const revenue = [18400,22100,28600,19800,31200,38700];
  const ordersData = [42,58,71,49,84,96];
  const maxR = Math.max(...revenue);

  return (
    <div>
      <SectionHeader title="Analytics & Reports" sub="Performance overview for BARAK Tea" />
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,marginBottom:24}}>
        <StatCard icon={IndianRupee} label="6-Month Revenue" value="₹1,58,800" trend={24.3}/>
        <StatCard icon={ShoppingCart} label="Total Orders" value="400" trend={18.1} color="#2563EB"/>
        <StatCard icon={Users} label="New Customers" value="180" trend={32.4} color="#9333EA"/>
        <StatCard icon={TrendingUp} label="Avg Order Value" value="₹397" trend={5.2} color={C.success}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:20,marginBottom:20}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <div style={{color:C.cream,fontWeight:700,fontSize:15,marginBottom:20}}>Monthly Revenue Trend</div>
          <div style={{display:"flex",alignItems:"flex-end",gap:12,height:140,marginBottom:10}}>
            {months.map((m,i)=>(
              <div key={m} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <div style={{color:C.muted,fontSize:10,fontWeight:600}}>{fmt(revenue[i]).replace("₹","₹")}</div>
                <div style={{width:"100%",background:`linear-gradient(to top,${C.gold},${C.goldLight})`,borderRadius:"4px 4px 0 0",height:`${(revenue[i]/maxR)*100}%`,minHeight:4,opacity:i===5?1:0.55}}/>
                <div style={{color:C.muted,fontSize:11}}>{m}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <div style={{color:C.cream,fontWeight:700,fontSize:15,marginBottom:20}}>Top Products by Revenue</div>
          {PRODUCTS_INIT.slice(0,4).map((p,i)=>(
            <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{color:C.muted,fontSize:12,width:16}}>#{i+1}</span>
                <span style={{fontSize:16}}>{p.img}</span>
                <div style={{fontSize:12,color:C.cream,fontWeight:600,maxWidth:130}}>{p.name}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:C.gold,fontWeight:700,fontSize:13}}>{fmt(p.sold*p.price)}</div>
                <div style={{color:C.muted,fontSize:10}}>{p.sold} units</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}}>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <div style={{color:C.cream,fontWeight:700,fontSize:15,marginBottom:16}}>Sales by Channel</div>
          {[{label:"WhatsApp",val:68,color:"#25D366"},{label:"Web",val:32,color:"#60A5FA"}].map(s=>(
            <div key={s.label} style={{marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <span style={{color:C.muted,fontSize:12}}>{s.label}</span>
                <span style={{color:s.color,fontWeight:700,fontSize:12}}>{s.val}%</span>
              </div>
              <div style={{background:C.border,borderRadius:4,height:8}}>
                <div style={{width:`${s.val}%`,background:s.color,height:"100%",borderRadius:4}}/>
              </div>
            </div>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <div style={{color:C.cream,fontWeight:700,fontSize:15,marginBottom:16}}>Top Cities</div>
          {[{city:"Silchar",orders:48,pct:50},{city:"Guwahati",orders:22,pct:23},{city:"Kolkata",orders:14,pct:15},{city:"Karimganj",orders:12,pct:12}].map((c,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}><MapPin size={12} color={C.muted}/><span style={{color:C.cream,fontSize:12}}>{c.city}</span></div>
              <div style={{textAlign:"right"}}><div style={{color:C.gold,fontSize:12,fontWeight:700}}>{c.orders} orders</div><div style={{color:C.muted,fontSize:10}}>{c.pct}%</div></div>
            </div>
          ))}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <div style={{color:C.cream,fontWeight:700,fontSize:15,marginBottom:16}}>Conversion Funnel</div>
          {[{label:"Visitors",val:2400},{label:"Product Views",val:1200,pct:"50%"},{label:"Add to Cart",val:480,pct:"40%"},{label:"WA Checkout",val:168,pct:"35%"},{label:"Orders Placed",val:96,pct:"57%"}].map((f,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<4?`1px solid ${C.border}`:"none"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:3,height:20,background:C.gold,borderRadius:2,opacity:1-i*0.15}}/>
                <span style={{color:C.muted,fontSize:12}}>{f.label}</span>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{color:C.cream,fontSize:12,fontWeight:600}}>{f.val.toLocaleString()}</div>
                {f.pct && <div style={{color:C.success,fontSize:10}}>{f.pct} conv.</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: Blog ───────────────────────────────────────────────────────────────
function BlogPage() {
  const [posts, setPosts] = useState([
    { id:1, title:"5 Reasons Barak Valley Tea is India's Best Kept Secret", category:"Tea Knowledge", status:"published", views:342, date:"2026-04-15" },
    { id:2, title:"The Perfect Masala Chai Recipe Using BARAK Tea", category:"Recipes", status:"published", views:218, date:"2026-04-10" },
    { id:3, title:"Bihu Special: How We Celebrate with Tea in Barak Valley", category:"Festival Specials", status:"draft", views:0, date:"2026-04-18" },
    { id:4, title:"CTC vs Loose Leaf: Which Tea is Right for You?", category:"Tea Knowledge", status:"published", views:156, date:"2026-04-05" },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:"", category:"Tea Knowledge", status:"draft" });

  const save = () => {
    setPosts(ps=>[...ps,{ id:Math.random(), ...form, views:0, date:new Date().toISOString().slice(0,10) }]);
    setShowModal(false);
  };

  return (
    <div>
      <SectionHeader title="Blog & Tea Stories" sub={`${posts.filter(p=>p.status==="published").length} published · ${posts.filter(p=>p.status==="draft").length} drafts`}
        action={<Btn icon={Plus} onClick={()=>setShowModal(true)}>New Post</Btn>} />
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
        <Table headers={["Title","Category","Status","Views","Date","Actions"]}
          rows={posts.map(p=>[
            <span style={{fontWeight:600,color:C.cream}}>{p.title}</span>,
            <span style={{color:C.muted,fontSize:12}}>{p.category}</span>,
            <Badge status={p.status==="published"?"active":"processing"}/>,
            <span style={{color:C.cream}}>{p.views}</span>,
            <span style={{color:C.muted,fontSize:12}}>{p.date}</span>,
            <div style={{display:"flex",gap:6}}>
              <Btn size="sm" variant="secondary" icon={Edit2}>Edit</Btn>
              <Btn size="sm" variant="danger" icon={Trash2} onClick={()=>setPosts(ps=>ps.filter(pp=>pp.id!==p.id))}/>
            </div>
          ])}
        />
      </div>
      {showModal && (
        <Modal title="New Blog Post" onClose={()=>setShowModal(false)}>
          <Input label="Post Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Enter article title"/>
          <Select label="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}
            options={["Tea Knowledge","Recipes","Barak Valley Stories","Festival Specials","Health & Wellness"].map(v=>({value:v,label:v}))}/>
          <Select label="Status" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}
            options={[{value:"draft",label:"Draft"},{value:"published",label:"Published"}]}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn variant="secondary" onClick={()=>setShowModal(false)}>Cancel</Btn>
            <Btn icon={FileText} onClick={save}>Create Post</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── PAGE: Settings ───────────────────────────────────────────────────────────
function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    storeName:"BARAK Tea", tagline:"Pure CTC Tea from Barak Valley", whatsapp:"+91 98765 43210",
    email:"hello@baraktea.in", address:"Silchar, Assam, India", gst:"18XXXXX1234Z5",
    currency:"INR", freeShipMin:"499", codEnabled:true, minOrder:"200",
    fbPixel:"1234567890123", gaId:"G-XXXXXXXXXX"
  });
  const save = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };

  const Field = ({label,k,type="text",placeholder=""})=>(
    <div style={{marginBottom:16}}>
      <label style={{display:"block",color:C.muted,fontSize:11,fontWeight:600,marginBottom:5,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</label>
      {type==="checkbox"
        ? <input type="checkbox" checked={form[k]} onChange={e=>setForm({...form,[k]:e.target.checked})} style={{accentColor:C.gold,width:18,height:18}}/>
        : <input type={type} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} placeholder={placeholder}
            style={{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,color:C.cream,padding:"10px 12px",fontSize:14,outline:"none",boxSizing:"border-box"}}/>
      }
    </div>
  );

  const Section = ({title,children}) => (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22,marginBottom:20}}>
      <div style={{color:C.gold,fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:18,borderBottom:`1px solid ${C.border}`,paddingBottom:12}}>{title}</div>
      {children}
    </div>
  );

  return (
    <div>
      <SectionHeader title="Store Settings" sub="Configure your BARAK Tea store"
        action={<Btn icon={saved?CheckCircle:ShieldCheck} onClick={save}>{saved?"Saved!":"Save Changes"}</Btn>} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <Section title="Store Identity">
            <Field label="Store Name" k="storeName"/>
            <Field label="Tagline" k="tagline"/>
            <Field label="Email Address" k="email" type="email"/>
            <Field label="Business Address" k="address"/>
            <Field label="GST Number" k="gst" placeholder="18XXXXX1234Z5"/>
          </Section>
          <Section title="Order Settings">
            <Field label="Minimum Order (₹)" k="minOrder" type="number"/>
            <Field label="Free Shipping Threshold (₹)" k="freeShipMin" type="number"/>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
              <Field label="COD Enabled" k="codEnabled" type="checkbox"/>
              <span style={{color:C.muted,fontSize:13,marginTop:16}}>Cash on Delivery</span>
            </div>
          </Section>
        </div>
        <div>
          <Section title="WhatsApp & Contact">
            <Field label="WhatsApp Business Number" k="whatsapp" placeholder="+91 XXXXX XXXXX"/>
            <div style={{background:C.bg,borderRadius:8,padding:14,marginTop:8}}>
              <div style={{color:C.muted,fontSize:11,marginBottom:6}}>Preview Checkout Link</div>
              <div style={{fontFamily:"monospace",fontSize:11,color:C.goldLight,wordBreak:"break-all"}}>
                {`https://wa.me/${form.whatsapp.replace(/\D/g,"")}?text=Hello+BARAK+Tea...`}
              </div>
            </div>
          </Section>
          <Section title="Marketing & Analytics">
            <Field label="Facebook Pixel ID" k="fbPixel"/>
            <Field label="Google Analytics 4 ID" k="gaId" placeholder="G-XXXXXXXXXX"/>
            <div style={{background:`${C.warning}15`,border:`1px solid ${C.warning}40`,borderRadius:8,padding:12}}>
              <div style={{color:C.warning,fontSize:12,fontWeight:600,marginBottom:4}}>⚠️ Important</div>
              <div style={{color:C.muted,fontSize:11,lineHeight:1.6}}>Facebook Pixel and GA4 must match your website tracking configuration. Ensure your domain is verified in Meta Business Manager.</div>
            </div>
          </Section>
          <Section title="Currency">
            <Field label="Currency" k="currency"/>
            <div style={{color:C.muted,fontSize:12,marginTop:-8}}>All prices displayed in Indian Rupees (₹)</div>
          </Section>
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
  { id:"blog", label:"Blog", icon:FileText },
  { id:"analytics", label:"Analytics", icon:BarChart2 },
  { id:"settings", label:"Settings", icon:Settings },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [notifs] = useState(3);

  const pages = {
    dashboard:<DashboardPage/>, products:<ProductsPage/>, orders:<OrdersPage/>,
    customers:<CustomersPage/>, inventory:<InventoryPage/>, shipments:<ShipmentsPage/>,
    coupons:<CouponsPage/>, reviews:<ReviewsPage/>, wholesale:<WholesalePage/>,
    blog:<BlogPage/>, analytics:<AnalyticsPage/>, settings:<SettingsPage/>,
  };

  const SIDEBAR_W = collapsed ? 64 : 220;

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans', system-ui, sans-serif", color:C.cream }}>
      {/* Sidebar */}
      <div style={{ width:SIDEBAR_W, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", transition:"width 0.25s ease", overflow:"hidden", flexShrink:0, position:"sticky", top:0, height:"100vh" }}>
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
        <nav style={{ flex:1, padding:"12px 0", overflowY:"auto" }}>
          {NAV.map(n => {
            const active = page === n.id;
            const newBadge = (n.id==="reviews"&&2)||(n.id==="wholesale"&&1);
            return (
              <button key={n.id} onClick={()=>setPage(n.id)}
                style={{ width:"100%", background:active?`${C.gold}18`:"transparent", border:"none", borderLeft:active?`3px solid ${C.gold}`:"3px solid transparent", color:active?C.gold:C.muted, cursor:"pointer", display:"flex", alignItems:"center", gap:12, padding:`10px ${collapsed?20:16}px`, fontSize:13, fontWeight:active?700:500, textAlign:"left", transition:"all 0.15s", position:"relative" }}>
                <n.icon size={16} style={{ flexShrink:0 }}/>
                {!collapsed && <span>{n.label}</span>}
                {!collapsed && newBadge ? <span style={{ marginLeft:"auto", background:C.error, color:"#fff", borderRadius:10, padding:"1px 7px", fontSize:10, fontWeight:700 }}>{newBadge}</span> : null}
              </button>
            );
          })}
        </nav>

        {/* Collapse button (when expanded) / Expand (when collapsed) */}
        {collapsed && (
          <div style={{ padding:"16px", borderTop:`1px solid ${C.border}` }}>
            <button onClick={()=>setCollapsed(false)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", width:"100%", display:"flex", justifyContent:"center" }}>
              <ChevronRight size={16}/>
            </button>
          </div>
        )}

        {/* User */}
        {!collapsed && (
          <div style={{ padding:"16px 20px", borderTop:`1px solid ${C.border}`, display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:32, height:32, borderRadius:"50%", background:C.gold, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#0D0905", flexShrink:0 }}>B</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ color:C.cream, fontSize:12, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>Admin</div>
              <div style={{ color:C.muted, fontSize:10 }}>BARAK Tea Owner</div>
            </div>
            <LogOut size={14} color={C.muted} style={{ cursor:"pointer", flexShrink:0 }}/>
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
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
              {notifs > 0 && <span style={{ position:"absolute", top:-4, right:-4, background:C.error, color:"#fff", borderRadius:"50%", width:14, height:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700 }}>{notifs}</span>}
            </div>
            <a href={`https://wa.me/919876543210`} target="_blank" rel="noreferrer"
              style={{ display:"flex", alignItems:"center", gap:6, background:"#25D36620", border:"1px solid #25D36640", borderRadius:20, padding:"5px 14px", color:"#25D366", fontSize:12, fontWeight:600, textDecoration:"none" }}>
              <MessageCircle size={13}/> WhatsApp
            </a>
            <div style={{ width:1, height:20, background:C.border }}/>
            <div style={{ color:C.muted, fontSize:11 }}>April 22, 2026</div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex:1, padding:28, overflowY:"auto" }}>
          {pages[page]}
        </div>
      </div>
    </div>
  );
}
