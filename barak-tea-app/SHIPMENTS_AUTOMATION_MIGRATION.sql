-- Apply this on an existing Supabase project to enable the automated shipment system.

alter table public.shipments
  add column if not exists tracking_id text,
  add column if not exists last_checked_at timestamp,
  add column if not exists last_raw_status text,
  add column if not exists status_message text,
  add column if not exists tracking_events jsonb default '[]'::jsonb,
  add column if not exists tracking_meta jsonb default '{}'::jsonb,
  add column if not exists notification_state jsonb default '{}'::jsonb,
  add column if not exists order_snapshot jsonb default '{}'::jsonb,
  add column if not exists failure_count integer default 0;

update public.shipments
set tracking_id = coalesce(tracking_id, tracking_number)
where tracking_id is null and tracking_number is not null;

alter table public.shipments
  drop constraint if exists shipments_status_check;

alter table public.shipments
  add constraint shipments_status_check
  check (status in ('pending', 'shipped', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned'));

create unique index if not exists idx_shipments_tracking_id on public.shipments(tracking_id) where tracking_id is not null;
create index if not exists idx_shipments_status on public.shipments(status);
create index if not exists idx_shipments_last_checked_at on public.shipments(last_checked_at);

alter publication supabase_realtime add table public.shipments;
