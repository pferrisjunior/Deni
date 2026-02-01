CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- CREATE SCHEMA IF NOT EXISTS public;

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET search_path = public, pg_catalog;
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


-- SET default_tablespace = '';
-- SET default_table_access_method = heap;

--
-- Table: users
-- Purpose: Stores all registered users for the platform including hosts, admins, and standard users
-- Notes:
--   - role controls authorization level
--   - email is globally unique
--

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

--
-- Table: events
-- Purpose: Stores community events created by users or hosts
-- Notes:
--   - created_by_user_id references users
--   - trust_score is computed via verification and reputation systems
--   - status controls visibility lifecycle
--

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

--
-- Table: food_trucks
-- Purpose: Stores food truck business profiles owned by host users
-- Notes:
--   - owner_user_id references users
--   - status allows soft enable or disable of a truck
--

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

--
-- Table: truck_stops
-- Purpose: Represents scheduled or active locations where food trucks operate
-- Notes:
--   - linked to food_trucks
--   - created_by_user_id tracks who submitted the stop
--   - trust_score mirrors events trust behavior
--

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

--
-- Table: event_media
-- Purpose: Stores media assets associated with events
-- Notes:
--   - supports images initially
--   - cascades on event deletion
--

CREATE TABLE public.event_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    event_id uuid NOT NULL,
    url text NOT NULL,
    media_type text DEFAULT 'image'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT event_media_media_type_check CHECK ((media_type = 'image'::text))
);

--
-- Table: truck_media
-- Purpose: Stores media assets associated with food trucks
-- Notes:
--   - supports images initially
--   - cascades on food truck deletion
--

CREATE TABLE public.truck_media (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    food_truck_id uuid NOT NULL,
    url text NOT NULL,
    media_type text DEFAULT 'image'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT truck_media_media_type_check CHECK ((media_type = 'image'::text))
);


