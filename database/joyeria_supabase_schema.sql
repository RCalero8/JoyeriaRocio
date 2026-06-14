-- =====================================================================
-- ESQUEMA DE BASE DE DATOS — JOYERIA (Supabase / PostgreSQL)
-- =====================================================================
-- Estructura:
--   - categorias          -> tipos de joyas (anillos, collares, etc.)
--   - productos           -> datos COMPLETOS del producto (solo admin)
--   - imagenes_productos  -> fotos de cada producto
--   - catalogo_publico    -> VISTA con lo unico que ve el invitado:
--                            nombre, foto y categoria (nada de precio,
--                            costo, stock, proveedor, etc.)
--   - mensajes_contacto   -> formulario de contacto
--   - perfiles            -> usuarios administradores
--
-- Como usarlo:
-- 1. Ve a tu proyecto en https://supabase.com
-- 2. Abre "SQL Editor" -> "New query"
-- 3. Pega todo este archivo y pulsa "Run"
-- =====================================================================

create extension if not exists "pgcrypto";


-- =====================================================================
-- 1. TABLA: categorias
-- =====================================================================
create table public.categorias (
  id          uuid primary key default gen_random_uuid(),
  nombre      text not null,
  slug        text not null unique,
  descripcion text,
  creado_en   timestamptz not null default now()
);


-- =====================================================================
-- 2. TABLA: productos
-- ---------------------------------------------------------------------
-- Contiene TODOS los datos del producto. Solo el administrador puede
-- leer esta tabla directamente. Los invitados solo veran "nombre" y
-- "foto" a traves de la vista "catalogo_publico" (mas abajo).
-- =====================================================================
create table public.productos (
  id              uuid primary key default gen_random_uuid(),
  nombre          text not null,
  slug            text not null unique,
  descripcion     text,
  precio          numeric(10,2),
  costo           numeric(10,2),         -- dato interno (solo admin)
  material        text,                  -- ej: "Oro 18k", "Plata 925"
  peso_gramos     numeric(10,2),
  sku             text,
  stock           int not null default 0,
  proveedor       text,
  notas_internas  text,
  categoria_id    uuid references public.categorias(id) on delete set null,
  activo          boolean not null default true,
  creado_en       timestamptz not null default now(),
  actualizado_en  timestamptz not null default now()
);

-- Actualiza automaticamente "actualizado_en" al editar un producto
create or replace function public.actualizar_fecha_modificacion()
returns trigger as $$
begin
  new.actualizado_en = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_productos_actualizado_en
before update on public.productos
for each row execute function public.actualizar_fecha_modificacion();


-- =====================================================================
-- 3. TABLA: imagenes_productos  (varias fotos por producto)
-- =====================================================================
create table public.imagenes_productos (
  id          uuid primary key default gen_random_uuid(),
  producto_id uuid not null references public.productos(id) on delete cascade,
  url_imagen  text not null,
  posicion    int not null default 0,   -- orden en que se muestran
  creado_en   timestamptz not null default now()
);


-- =====================================================================
-- 4. TABLA: mensajes_contacto
-- =====================================================================
create table public.mensajes_contacto (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  email      text not null,
  telefono   text,
  mensaje    text not null,
  leido      boolean not null default false,
  creado_en  timestamptz not null default now()
);


-- =====================================================================
-- 5. TABLA: perfiles  (identifica quien es administrador)
-- =====================================================================
create table public.perfiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  nombre_completo  text,
  rol              text not null default 'admin' check (rol in ('admin')),
  creado_en        timestamptz not null default now()
);


-- =====================================================================
-- 6. INDICES
-- =====================================================================
create index idx_productos_categoria_id     on public.productos(categoria_id);
create index idx_productos_activo           on public.productos(activo);
create index idx_imagenes_producto_id       on public.imagenes_productos(producto_id);
create index idx_mensajes_contacto_no_leido on public.mensajes_contacto(leido);


-- =====================================================================
-- 7. FUNCION AUXILIAR: ¿el usuario actual es administrador?
-- =====================================================================
create or replace function public.es_admin()
returns boolean as $$
  select exists (
    select 1 from public.perfiles where id = auth.uid()
  );
$$ language sql security definer stable;


-- =====================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- =====================================================================
alter table public.categorias         enable row level security;
alter table public.productos          enable row level security;
alter table public.imagenes_productos enable row level security;
alter table public.mensajes_contacto  enable row level security;
alter table public.perfiles           enable row level security;


-- ---------------------------------------------------------------------
-- categorias: cualquiera puede verlas, solo admin las gestiona
-- ---------------------------------------------------------------------
create policy "Cualquiera puede ver categorias"
  on public.categorias for select
  using (true);

create policy "Admin puede crear categorias"
  on public.categorias for insert
  with check (public.es_admin());

create policy "Admin puede editar categorias"
  on public.categorias for update
  using (public.es_admin());

create policy "Admin puede borrar categorias"
  on public.categorias for delete
  using (public.es_admin());


-- ---------------------------------------------------------------------
-- productos: SOLO el admin puede leer esta tabla directamente.
-- Los invitados acceden a traves de la vista "catalogo_publico".
-- ---------------------------------------------------------------------
create policy "Solo admin puede ver todos los datos de productos"
  on public.productos for select
  using (public.es_admin());

create policy "Admin puede crear productos"
  on public.productos for insert
  with check (public.es_admin());

create policy "Admin puede editar productos"
  on public.productos for update
  using (public.es_admin());

create policy "Admin puede borrar productos"
  on public.productos for delete
  using (public.es_admin());


-- ---------------------------------------------------------------------
-- imagenes_productos: cualquiera puede verlas (solo son fotos),
-- solo admin las gestiona
-- ---------------------------------------------------------------------
create policy "Cualquiera puede ver imagenes de productos"
  on public.imagenes_productos for select
  using (true);

create policy "Admin puede agregar imagenes"
  on public.imagenes_productos for insert
  with check (public.es_admin());

create policy "Admin puede editar imagenes"
  on public.imagenes_productos for update
  using (public.es_admin());

create policy "Admin puede borrar imagenes"
  on public.imagenes_productos for delete
  using (public.es_admin());


-- ---------------------------------------------------------------------
-- mensajes_contacto: cualquiera puede ENVIAR (insert), solo admin lee
-- ---------------------------------------------------------------------
create policy "Cualquiera puede enviar un mensaje de contacto"
  on public.mensajes_contacto for insert
  with check (true);

create policy "Admin puede ver mensajes de contacto"
  on public.mensajes_contacto for select
  using (public.es_admin());

create policy "Admin puede actualizar mensajes de contacto"
  on public.mensajes_contacto for update
  using (public.es_admin());

create policy "Admin puede borrar mensajes de contacto"
  on public.mensajes_contacto for delete
  using (public.es_admin());


-- ---------------------------------------------------------------------
-- perfiles: cada usuario solo ve su propio perfil
-- ---------------------------------------------------------------------
create policy "El usuario puede ver su propio perfil"
  on public.perfiles for select
  using (auth.uid() = id);


-- =====================================================================
-- 9. VISTA PUBLICA: catalogo_publico
-- ---------------------------------------------------------------------
-- Esto es lo UNICO que ven los invitados: nombre del producto, su(s)
-- foto(s) y la categoria a la que pertenece. NO incluye precio, costo,
-- stock, proveedor, sku ni notas internas.
--
-- Funciona aunque la tabla "productos" tenga RLS solo-admin, porque
-- las vistas en Postgres se ejecutan con los permisos de quien las
-- creo (el propietario, normalmente "postgres"), que no esta sujeto
-- a esas politicas.
-- =====================================================================
create view public.catalogo_publico as
select
  p.id,
  p.nombre,
  c.nombre as categoria,
  i.url_imagen,
  i.posicion
from public.productos p
left join public.categorias c on c.id = p.categoria_id
left join public.imagenes_productos i on i.producto_id = p.id
where p.activo = true
order by p.nombre, i.posicion;

grant select on public.catalogo_publico to anon, authenticated;


-- =====================================================================
-- 10. STORAGE — bucket para las fotos de los productos
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('imagenes-productos', 'imagenes-productos', true)
on conflict (id) do nothing;

create policy "Cualquiera puede ver las imagenes del bucket"
  on storage.objects for select
  using (bucket_id = 'imagenes-productos');

create policy "Admin puede subir imagenes al bucket"
  on storage.objects for insert
  with check (bucket_id = 'imagenes-productos' and public.es_admin());

create policy "Admin puede actualizar imagenes del bucket"
  on storage.objects for update
  using (bucket_id = 'imagenes-productos' and public.es_admin());

create policy "Admin puede borrar imagenes del bucket"
  on storage.objects for delete
  using (bucket_id = 'imagenes-productos' and public.es_admin());


-- =====================================================================
-- 11. DATOS DE EJEMPLO (opcional, puedes borrar este bloque)
-- =====================================================================
insert into public.categorias (nombre, slug, descripcion) values
  ('Anillos',  'anillos',  'Anillos de compromiso, oro y plata'),
  ('Collares', 'collares', 'Collares y gargantillas'),
  ('Pulseras', 'pulseras', 'Pulseras y brazaletes'),
  ('Aretes',   'aretes',   'Aretes y pendientes');


-- =====================================================================
-- COMO CONVERTIR UN USUARIO EN ADMINISTRADOR
-- =====================================================================
-- 1. Crea el usuario desde Authentication -> Users (o registralo desde
--    la app).
-- 2. Copia su "User UID".
-- 3. Ejecuta (sustituyendo el UID y el nombre):
--
-- insert into public.perfiles (id, nombre_completo)
-- values ('PEGA-AQUI-EL-UID-DEL-USUARIO', 'Nombre del Admin');
--
-- A partir de ese momento, ese usuario tendra permisos de administrador.
-- =====================================================================


-- =====================================================================
-- CONSULTAS DE EJEMPLO DESDE EL FRONTEND
-- =====================================================================
-- INVITADO (catalogo publico, solo nombre + foto + categoria):
--   select * from catalogo_publico;
--
-- ADMIN (todos los datos del producto):
--   select * from productos;
-- =====================================================================
