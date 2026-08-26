import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function adminClient() {
  const supabase = createSupabaseAdminClient();
  if (!supabase) throw new Error("Supabase administrativo não está configurado.");
  return supabase;
}

export async function getAdminDashboardData() {
  const supabase = adminClient();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [productsResult, pendingResult, approvedResult, monthSalesResult, recentOrdersResult] = await Promise.all([
    supabase.from("products").select("active, archived_at, deleted_at, stock_quantity, track_stock"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "pending"),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "approved"),
    supabase.from("orders").select("total").eq("payment_status", "approved").gte("created_at", monthStart.toISOString()),
    supabase
      .from("orders")
      .select("id, order_number, customer_name, payment_status, fulfillment_status, total, created_at")
      .order("created_at", { ascending: false })
      .limit(5)
  ]);

  const products = productsResult.data || [];
  const monthSales = (monthSalesResult.data || []).reduce((sum, order) => sum + Number(order.total || 0), 0);

  return {
    activeProducts: products.filter((product) => product.active && !product.archived_at && !product.deleted_at).length,
    inactiveProducts: products.filter((product) => !product.active || product.archived_at || product.deleted_at).length,
    lowStock: products.filter((product) => product.track_stock && product.stock_quantity <= 2).length,
    pendingOrders: pendingResult.count || 0,
    approvedOrders: approvedResult.count || 0,
    monthSales,
    recentOrders: recentOrdersResult.data || []
  };
}

export async function getAdminProducts() {
  const { data, error } = await adminClient()
    .from("products")
    .select("id, name, slug, sku, short_description, unit_price, stock_quantity, active, archived_at, deleted_at, categories(name, slug)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAdminCategories() {
  const { data, error } = await adminClient()
    .from("categories")
    .select("id, name, slug, description, active, display_order")
    .order("display_order");
  if (error) throw error;
  return data || [];
}

export async function getAdminOrders() {
  const { data, error } = await adminClient()
    .from("orders")
    .select("id, order_number, customer_name, customer_email, payment_status, fulfillment_status, payment_method, total, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAdminOrder(id: string) {
  const supabase = adminClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return order;
}

export async function getAdminAuditLogs() {
  const { data, error } = await adminClient()
    .from("admin_audit_logs")
    .select("id, action, entity_type, entity_id, created_at, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}
