CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE SCHEMA IF NOT EXISTS public;

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

--
-- Table: verification_submissions
-- Purpose:
--   Stores community and system verification evidence for events and truck stops.
--   Verifications contribute to trust scoring and moderation decisions.
--
-- Design Notes:
--   - Polymorphic target model using (target_type, target_id)
--     * target_type = 'event' or 'truck_stop'
--     * target_id references the corresponding record
--   - A verification may be submitted by any authenticated user
--   - Reviews are performed by admins or authorized moderators
--
-- Workflow:
--   1. User submits verification evidence (photo, link, check-in, or host claim)
--   2. Record is created with verdict = 'pending'
--   3. Admin reviews submission and sets verdict to 'accepted' or 'rejected'
--   4. Accepted verifications may increase trust_score on the target entity
--
-- Constraints:
--   - reviewed_by_user_id and reviewed_at must be NULL while verdict = 'pending'
--   - reviewed_by_user_id and reviewed_at must be NOT NULL once reviewed
--   - target integrity must be enforced via application logic or triggers
--
-- Future Extensions:
--   - Weighting by verification method
--   - Multiple verifications contributing cumulatively to trust_score
--   - Automated verification signals (GPS, time correlation, reputation)
--

CREATE TABLE public.verification_submissions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    submitted_by_user_id uuid NOT NULL,
    target_type text NOT NULL,
    target_id uuid NOT NULL,
    method text NOT NULL,
    evidence_url text,
    note text,
    verdict text DEFAULT 'pending'::text NOT NULL,
    reviewed_by_user_id uuid,
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT verification_submissions_method_check CHECK ((method = ANY (ARRAY['photo'::text, 'link'::text, 'check_in'::text, 'host_claim'::text]))),
    CONSTRAINT verification_submissions_target_type_check CHECK ((target_type = ANY (ARRAY['event'::text, 'truck_stop'::text]))),
    CONSTRAINT verification_submissions_verdict_check CHECK ((verdict = ANY (ARRAY['pending'::text, 'accepted'::text, 'rejected'::text])))
);

ALTER TABLE ONLY public.event_media
    ADD CONSTRAINT event_media_pkey PRIMARY KEY (id);

DROP INDEX IF EXISTS users_email_key;
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_email_key;

CREATE UNIQUE INDEX users_email_unique_ci
ON public.users (lower(email));

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.food_trucks
    ADD CONSTRAINT food_trucks_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.truck_media
    ADD CONSTRAINT truck_media_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.truck_stops
    ADD CONSTRAINT truck_stops_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.verification_submissions
    ADD CONSTRAINT verification_submissions_pkey PRIMARY KEY (id);



-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_lat_lng ON public.events (lat, lng);
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.events USING btree (start_time);
CREATE INDEX IF NOT EXISTS idx_food_trucks_owner ON public.food_trucks USING btree (owner_user_id);
CREATE INDEX IF NOT EXISTS idx_truck_media_truck ON public.truck_media USING btree (food_truck_id);
CREATE INDEX IF NOT EXISTS idx_truck_stops_lat_lng ON public.truck_stops USING btree (lat, lng);
CREATE INDEX IF NOT EXISTS idx_truck_stops_start_time ON public.truck_stops USING btree (start_time);
CREATE INDEX IF NOT EXISTS idx_truck_stops_truck ON public.truck_stops USING btree (food_truck_id);
CREATE INDEX IF NOT EXISTS idx_verification_submitter ON public.verification_submissions USING btree (submitted_by_user_id);
CREATE INDEX IF NOT EXISTS idx_verification_target ON public.verification_submissions USING btree (target_type, target_id);

-- Constraints
ALTER TABLE ONLY public.event_media
    ADD CONSTRAINT event_media_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.food_trucks
    ADD CONSTRAINT food_trucks_owner_user_id_fkey FOREIGN KEY (owner_user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.truck_media
    ADD CONSTRAINT truck_media_food_truck_id_fkey FOREIGN KEY (food_truck_id) REFERENCES public.food_trucks(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.truck_stops
    ADD CONSTRAINT truck_stops_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.truck_stops
    ADD CONSTRAINT truck_stops_food_truck_id_fkey FOREIGN KEY (food_truck_id) REFERENCES public.food_trucks(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.verification_submissions
    ADD CONSTRAINT verification_submissions_reviewed_by_user_id_fkey FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id);

ALTER TABLE ONLY public.verification_submissions
    ADD CONSTRAINT verification_submissions_submitted_by_user_id_fkey FOREIGN KEY (submitted_by_user_id) REFERENCES public.users(id) ON DELETE CASCADE;



