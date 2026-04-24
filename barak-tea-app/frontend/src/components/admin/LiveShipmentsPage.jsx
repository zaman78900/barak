import { useEffect, useMemo, useRef, useState } from "react";
import { Plus, RefreshCw, Truck, X } from "lucide-react";
import adminAPI from "../../utils/adminApi";
import { getBrowserSupabase } from "../../utils/supabaseBrowser";

const C = {
  bg: "#0D0905",
  surface: "#1A110A",
  card: "#221508",
  border: "#3A2415",
  gold: "#C8922A",
  cream: "#FAF3E0",
  muted: "#9E8C78",
  success: "#34D399",
  error: "#F87171",
  warning: "#FBBF24",
  info: "#60A5FA",
};

const STATUS_MAP = {
  shipped: { bg: "#0D1F3C", text: "#60A5FA", label: "Shipped" },
  in_transit: { bg: "#0D1F3C", text: "#60A5FA", label: "In Transit" },
  out_for_delivery: { bg: "#1A2B00", text: "#84CC16", label: "Out for Delivery" },
  delivered: { bg: "#0D2B1A", text: "#34D399", label: "Delivered" },
  cancelled: { bg: "#2D0D0D", text: "#F87171", label: "Cancelled" },
  returned: { bg: "#2D0D0D", text: "#F87171", label: "Returned" },
  pending: { bg: "#2D1B00", text: "#FBBF24", label: "Pending" },
};

function StatusBadge({ status }) {
  const chip = STATUS_MAP[status] || { bg: C.border, text: C.muted, label: status || "Unknown" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        background: chip.bg,
        color: chip.text,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.04em",
      }}
    >
      {chip.label}
    </span>
  );
}

function ActionButton({ children, onClick, icon: Icon, variant = "primary", disabled = false }) {
  const styles = {
    primary: { background: C.gold, color: "#0D0905", border: "none" },
    secondary: { background: "transparent", color: C.cream, border: `1px solid ${C.border}` },
    success: { background: "#0D2B1A", color: C.success, border: "1px solid #1A5A35" },
    danger: { background: "#2D0D0D", color: C.error, border: "1px solid #5A1A1A" },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles[variant],
        borderRadius: 8,
        padding: "9px 14px",
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
      }}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}

function SummaryCard({ label, value, color }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, textTransform: "uppercase", marginBottom: 8 }}>{label}</div>
      <div style={{ color, fontSize: 28, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

function ShipmentModal({ form, setForm, orders, couriers, onClose, onSave, saving }) {
  const selectedOrder = orders.find(order => order.id === form.order_id);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        onClick={event => event.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 580,
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 22px", borderBottom: `1px solid ${C.border}` }}>
          <div style={{ color: C.cream, fontSize: 16, fontWeight: 700 }}>Create Shipment</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 22 }}>
          <label style={{ display: "block", color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Order</label>
          <select
            value={form.order_id}
            onChange={event => setForm(current => ({ ...current, order_id: event.target.value }))}
            style={{ width: "100%", marginBottom: 14, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.cream, padding: "11px 12px" }}
          >
            <option value="">Select an order</option>
            {orders.map(order => (
              <option key={order.id} value={order.id}>
                {`${order.order_number} • ${order.customer_name || "Customer"} • ${order.city || "No city"}`}
              </option>
            ))}
          </select>

          {selectedOrder && (
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ color: C.gold, fontWeight: 700 }}>{selectedOrder.order_number}</div>
              <div style={{ color: C.cream, fontSize: 13, marginTop: 4 }}>{selectedOrder.customer_name || "Customer"}</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{selectedOrder.city || "City unavailable"}</div>
            </div>
          )}

          <label style={{ display: "block", color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Courier</label>
          <select
            value={form.courier}
            onChange={event => setForm(current => ({ ...current, courier: event.target.value }))}
            style={{ width: "100%", marginBottom: 14, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.cream, padding: "11px 12px" }}
          >
            {couriers.map(courier => (
              <option key={courier.code} value={courier.code}>
                {courier.label}
              </option>
            ))}
          </select>

          <label style={{ display: "block", color: C.muted, fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: "uppercase" }}>Tracking ID</label>
          <input
            value={form.tracking_id}
            onChange={event => setForm(current => ({ ...current, tracking_id: event.target.value }))}
            placeholder="Paste AWB / tracking ID"
            style={{ width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.cream, padding: "11px 12px", boxSizing: "border-box" }}
          />

          <div style={{ color: C.muted, fontSize: 12, marginTop: 10 }}>
            Admin only enters the tracking ID. Shipment data is created from the order automatically.
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
            <ActionButton variant="secondary" onClick={onClose}>Cancel</ActionButton>
            <ActionButton icon={Truck} onClick={onSave} disabled={saving}>{saving ? "Creating..." : "Create Shipment"}</ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveShipmentsPage() {
  const [shipments, setShipments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([
    { code: "india_post", label: "India Post" },
    { code: "dtdc", label: "DTDC" },
    { code: "delhivery", label: "Delhivery" },
    { code: "blue_dart", label: "Blue Dart" },
    { code: "own_delivery", label: "Own Delivery" },
  ]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [realtimeMode, setRealtimeMode] = useState("Connecting...");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [form, setForm] = useState({ order_id: "", courier: "india_post", tracking_id: "" });
  const pollerRef = useRef(null);

  const loadShipments = async (silent = false) => {
    try {
      if (silent) setRefreshing(true);
      else setLoading(true);

      const data = await adminAPI.shipments.getAll(1, 100);
      setShipments(data.shipments || []);
      setLastUpdated(new Date());
      setMessage(current => (current.type === "error" ? current : { type: "", text: "" }));
    } catch (error) {
      setMessage({ type: "error", text: error?.error || "Failed to load shipments" });
    } finally {
      if (silent) setRefreshing(false);
      else setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await adminAPI.shipments.getAvailableOrders(100);
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to load shipment-ready orders:", error);
    }
  };

  const loadCouriers = async () => {
    try {
      const data = await adminAPI.shipments.getCouriers();
      if (data?.couriers?.length) {
        setCouriers(data.couriers);
      }
    } catch (error) {
      console.error("Failed to load couriers:", error);
    }
  };

  useEffect(() => {
    loadShipments();
    loadOrders();
    loadCouriers();
  }, []);

  useEffect(() => {
    const supabase = getBrowserSupabase();

    const startPolling = (reason) => {
      setRealtimeMode(reason);
      if (pollerRef.current) return;

      pollerRef.current = setInterval(() => {
        loadShipments(true);
      }, 45000);
    };

    if (!supabase) {
      startPolling("Polling fallback (Supabase env missing)");
      return () => {
        if (pollerRef.current) {
          clearInterval(pollerRef.current);
          pollerRef.current = null;
        }
      };
    }

    const channel = supabase
      .channel("admin-shipments-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "shipments" }, () => {
        setRealtimeMode("Live via Supabase Realtime");
        loadShipments(true);
        loadOrders();
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setRealtimeMode("Live via Supabase Realtime");
        }

        if (status === "TIMED_OUT" || status === "CHANNEL_ERROR" || status === "CLOSED") {
          startPolling("Polling fallback (Realtime unavailable)");
        }
      });

    const warmupFallback = setTimeout(() => {
      if (!pollerRef.current) {
        startPolling("Polling fallback (subscription warm-up)");
      }
    }, 8000);

    return () => {
      clearTimeout(warmupFallback);
      supabase.removeChannel(channel);
      if (pollerRef.current) {
        clearInterval(pollerRef.current);
        pollerRef.current = null;
      }
    };
  }, []);

  const summary = useMemo(() => ({
    shipped: shipments.filter(item => item.status === "shipped").length,
    inTransit: shipments.filter(item => item.status === "in_transit").length,
    outForDelivery: shipments.filter(item => item.status === "out_for_delivery").length,
    delivered: shipments.filter(item => item.status === "delivered").length,
  }), [shipments]);

  const createShipment = async () => {
    if (!form.order_id || !form.tracking_id) {
      setMessage({ type: "error", text: "Order and tracking ID are required" });
      return;
    }

    try {
      setSaving(true);
      const response = await adminAPI.shipments.create(form);
      setMessage({ type: "success", text: `Shipment ${response?.shipment?.tracking_id || form.tracking_id} created` });
      setShowModal(false);
      setForm({ order_id: "", courier: "india_post", tracking_id: "" });
      await loadShipments(true);
      await loadOrders();
    } catch (error) {
      setMessage({ type: "error", text: error?.error || "Failed to create shipment" });
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (shipmentId, status) => {
    try {
      setRefreshing(true);
      await adminAPI.shipments.updateStatus(shipmentId, status);
      setMessage({ type: "success", text: `Shipment marked as ${status.replaceAll("_", " ")}` });
      await loadShipments(true);
    } catch (error) {
      setMessage({ type: "error", text: error?.error || "Failed to update shipment" });
    } finally {
      setRefreshing(false);
    }
  };

  const runSyncNow = async () => {
    try {
      setRefreshing(true);
      await adminAPI.shipments.checkNow();
      await loadShipments(true);
      setMessage({ type: "success", text: "Shipment sync triggered" });
    } catch (error) {
      setMessage({ type: "error", text: error?.error || "Failed to trigger shipment sync" });
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return <div style={{ color: C.muted, textAlign: "center", padding: 40 }}>Loading shipments...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ color: C.cream, fontSize: 20, fontWeight: 700, margin: 0 }}>Shipments</h2>
          <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>
            {`${shipments.length} shipments tracked • ${realtimeMode}${lastUpdated ? ` • Last sync ${lastUpdated.toLocaleTimeString()}` : ""}`}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <ActionButton variant="secondary" icon={RefreshCw} onClick={runSyncNow} disabled={refreshing}>
            {refreshing ? "Syncing..." : "Run Sync"}
          </ActionButton>
          <ActionButton icon={Plus} onClick={() => setShowModal(true)}>Create Shipment</ActionButton>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 22 }}>
        <SummaryCard label="Shipped" value={summary.shipped} color={C.info} />
        <SummaryCard label="In Transit" value={summary.inTransit} color={C.info} />
        <SummaryCard label="Out for Delivery" value={summary.outForDelivery} color="#84CC16" />
        <SummaryCard label="Delivered" value={summary.delivered} color={C.success} />
      </div>

      {message.text && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 8,
            border: message.type === "error" ? "1px solid #5A1A1A" : "1px solid #1A5A35",
            background: message.type === "error" ? "#2D0D0D" : "#0D2B1A",
            color: message.type === "error" ? C.error : C.success,
          }}
        >
          {message.text}
        </div>
      )}

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 22, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `2px solid ${C.border}` }}>
              {["Order", "Customer", "City", "Courier", "Tracking", "Status", "Last Checked", "Actions"].map(label => (
                <th key={label} style={{ color: C.muted, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", padding: "10px 14px" }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shipments.length === 0 && (
              <tr>
                <td colSpan={8} style={{ color: C.muted, textAlign: "center", padding: 36 }}>
                  No shipments yet. Create one by entering a tracking ID.
                </td>
              </tr>
            )}

            {shipments.map(shipment => (
              <tr key={shipment.id} style={{ borderBottom: `1px solid ${C.border}` }}>
                <td style={{ color: C.cream, padding: "12px 14px" }}>
                  <div style={{ color: C.gold, fontWeight: 700 }}>{shipment.order_number || shipment.order_id}</div>
                  <div style={{ color: C.muted, fontSize: 11, marginTop: 4 }}>{shipment.id.slice(0, 8)}</div>
                </td>
                <td style={{ color: C.cream, padding: "12px 14px" }}>{shipment.customer_name || "—"}</td>
                <td style={{ color: C.cream, padding: "12px 14px" }}>{shipment.city || "—"}</td>
                <td style={{ color: C.cream, padding: "12px 14px" }}>{shipment.courier || shipment.courier_partner || "—"}</td>
                <td style={{ color: C.cream, padding: "12px 14px", fontFamily: "monospace", fontSize: 12 }}>
                  {shipment.tracking_id || shipment.tracking_number || "—"}
                </td>
                <td style={{ color: C.cream, padding: "12px 14px" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <StatusBadge status={shipment.status} />
                    <span style={{ color: C.muted, fontSize: 11, lineHeight: 1.4 }}>{shipment.last_raw_status || "Waiting for first sync"}</span>
                  </div>
                </td>
                <td style={{ color: C.muted, padding: "12px 14px", fontSize: 12 }}>
                  {shipment.last_checked_at ? new Date(shipment.last_checked_at).toLocaleString() : "Not checked yet"}
                </td>
                <td style={{ color: C.cream, padding: "12px 14px" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {shipment.status !== "delivered" && (
                      <ActionButton variant="success" onClick={() => updateStatus(shipment.id, "delivered")}>Delivered</ActionButton>
                    )}
                    {!["cancelled", "delivered"].includes(shipment.status) && (
                      <ActionButton variant="danger" onClick={() => updateStatus(shipment.id, "cancelled")}>Cancel</ActionButton>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ShipmentModal
          form={form}
          setForm={setForm}
          orders={orders}
          couriers={couriers}
          onClose={() => setShowModal(false)}
          onSave={createShipment}
          saving={saving}
        />
      )}
    </div>
  );
}
