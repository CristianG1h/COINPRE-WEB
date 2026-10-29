-- Apply to the dedicated COINPRE project only. No visitor message or email is stored.
create table public.contact_requests (
 id uuid primary key,
 fingerprint text not null,
 ip_hash text not null,
 email_hash text not null,
 created_at timestamptz not null default now(),
 internal_status text not null default 'pending' check (internal_status in ('pending','sending','sent','failed')),
 customer_status text not null default 'pending' check (customer_status in ('pending','sending','sent','failed'))
);
create index contact_requests_created on public.contact_requests(created_at);
alter table public.contact_requests enable row level security;
revoke all on public.contact_requests from public, anon, authenticated;
grant select,insert,update,delete on public.contact_requests to service_role;

create function public.claim_contact(p_id uuid,p_fingerprint text,p_ip_hash text,p_email_hash text)
returns jsonb language plpgsql security invoker set search_path = '' as $$
declare item public.contact_requests;
begin
 perform pg_catalog.pg_advisory_xact_lock(80421927);
 delete from public.contact_requests where created_at < now()-interval '14 days';
 select * into item from public.contact_requests where id=p_id;
 if found then
  if item.fingerprint <> p_fingerprint then return jsonb_build_object('result','conflict'); end if;
  if item.internal_status='sent' then return jsonb_build_object('result','accepted','customer',item.customer_status); end if;
  -- An interrupted provider call may already have delivered a message. Never resend blindly.
  return jsonb_build_object('result','uncertain');
 end if;
 if (select count(*) from public.contact_requests where created_at > now()-interval '24 hours') >= 80
 or (select count(*) from public.contact_requests where email_hash=p_email_hash and created_at > now()-interval '24 hours') >= 2
 or (select count(*) from public.contact_requests where ip_hash=p_ip_hash and created_at > now()-interval '1 hour') >= 5 then
  return jsonb_build_object('result','limited');
 end if;
 insert into public.contact_requests(id,fingerprint,ip_hash,email_hash,internal_status)
 values(p_id,p_fingerprint,p_ip_hash,p_email_hash,'sending');
 return jsonb_build_object('result','new');
end $$;
revoke all on function public.claim_contact(uuid,text,text,text) from public,anon,authenticated;
grant execute on function public.claim_contact(uuid,text,text,text) to service_role;
