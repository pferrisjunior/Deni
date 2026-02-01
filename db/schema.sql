-- Deni schema

/* optional dev reset for repeated testing
DROP TABLE IF EXISTS public.verification_submissions CASCADE;
DROP TABLE IF EXISTS public.event_media CASCADE;
DROP TABLE IF EXISTS public.truck_media CASCADE;
DROP TABLE IF EXISTS public.truck_stops CASCADE;
DROP TABLE IF EXISTS public.food_trucks CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
*/

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA IF NOT EXISTS public;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET search_path = public, pg_catalog;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;


/* users */

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    display_name text NOT NULL,
    role text DEFAULT 'user'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT users_role_check CHECK ((role = ANY (ARRAY['user'::text, 'host'::text, 'admin'::text])))
);


/* events */

CREATE TABLE public.events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_by_user_id uuid NOT NULL,
    title text NOT NULL,
    description text,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    location_name text NOT NULL,
    address_text text,
    lat numeric(9,6) NOT NULL,
    lng numeric(9,6) NOT NULL,
    category text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    trust_score integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT events_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);

/* Food Trucks */

CREATE TABLE public.food_trucks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_user_id uuid NOT NULL,
    name text NOT NULL,
    description text,
    phone text,
    email text,
    website_url text,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT food_trucks_status_check CHECK ((status = ANY (ARRAY['active'::text, 'inactive'::text])))
);

/* Truck Stops */

CREATE TABLE public.truck_stops (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    food_truck_id uuid NOT NULL,
    created_by_user_id uuid NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    location_name text NOT NULL,
    address_text text,
    lat numeric(9,6) NOT NULL,
    lng numeric(9,6) NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    trust_score integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT truck_stops_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text, 'archived'::text])))
);

/* Event Media */

CREATE TABLE public.event_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    url text NOT NULL,
    media_type text DEFAULT 'image'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT event_media_media_type_check CHECK ((media_type = 'image'::text))
);

/* Truck Media */

CREATE TABLE public.truck_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    food_truck_id uuid NOT NULL,
    url text NOT NULL,
    media_type text DEFAULT 'image'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT truck_media_media_type_check CHECK ((media_type = 'image'::text))
);


