-- Migration: Create Workout Tracking Schema
-- Description: Sets up tables for workouts, exercises, sessions, and logs.
-- Enable UUID generation if not already enabled
-- create extension if not exists "uuid-ossp" with schema extensions;
-- Note: Supabase projects usually have pgcrypto enabled, which provides gen_random_uuid()
-- 1. Create ENUM Types (Weight Unit & Session Status Only)
create type public.weight_unit_enum as enum ('kg', 'lbs');
create type public.session_status as enum ('started', 'completed', 'abandoned');
-- 0.1 Create or replace trigger function for updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- 1.5 Create Workout Types Table (Lookup Table)
create table public.workout_types (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    -- Optional description for the type
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);
-- Add trigger for updated_at
do $$ begin if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_updated_at_workout_types'
) then execute 'CREATE TRIGGER set_updated_at_workout_types BEFORE UPDATE ON public.workout_types FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();';
end if;
end $$;
comment on table public.workout_types is 'Lookup table for different types of workouts (e.g., Strength, HIIT, Yoga).';
-- 2. Create Workouts Table
-- Stores workout templates
create table public.workouts (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    type_id uuid not null references public.workout_types(id) on delete restrict,
    -- Link to a type, restrict delete to prevent orphan workouts
    created_by uuid references auth.users(id) on delete
    set null,
        -- Link to creator (optional)
        created_at timestamp with time zone not null default now(),
        updated_at timestamp with time zone not null default now()
);
-- Add trigger for updated_at
do $$ begin if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_updated_at_workouts'
) then execute 'CREATE TRIGGER set_updated_at_workouts BEFORE UPDATE ON public.workouts FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();';
end if;
end $$;
-- Add indexes for common query patterns
create index idx_workouts_created_by on public.workouts(created_by);
create index idx_workouts_type_id on public.workouts(type_id);
-- Add comments on table and columns
comment on table public.workouts is 'Stores workout templates.';
comment on column public.workouts.type_id is 'References the type of the workout.';
comment on column public.workouts.created_by is 'Optional: Track who created the workout template.';
-- 3. Create Exercise Definitions Table (Master List)
-- Stores the master list of reusable exercise types
create table public.exercise_definitions (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    description text,
    video_url text,
    primary_muscle_group text,
    -- Optional: Useful for filtering/info
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);
-- Add trigger for updated_at
do $$ begin if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_updated_at_exercise_definitions'
) then execute 'CREATE TRIGGER set_updated_at_exercise_definitions BEFORE UPDATE ON public.exercise_definitions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();';
end if;
end $$;
-- Add comments
comment on table public.exercise_definitions is 'Master list of reusable exercise definitions (e.g., Bench Press).';
comment on column public.exercise_definitions.name is 'Unique name of the exercise.';
comment on column public.exercise_definitions.primary_muscle_group is 'Optional: Useful for filtering/info.';
-- 4. Create Workout Exercises Table (Junction Table)
-- Defines how a specific exercise definition is used within a specific workout template
create table public.workout_exercises (
    id uuid primary key default gen_random_uuid(),
    workout_id uuid not null references public.workouts(id) on delete cascade,
    -- Link to the workout template
    exercise_definition_id uuid not null references public.exercise_definitions(id) on delete restrict,
    -- Link to the master exercise definition
    sets integer,
    reps text,
    -- Flexible: e.g., '8-12', 'AMRAP', '10'
    weight real,
    -- Suggested target weight for template
    weight_unit public.weight_unit_enum,
    duration interval,
    -- Suggested target duration (e.g., '30 seconds')
    rest_period interval,
    -- Time between sets/exercises (e.g., '60 seconds')
    "order" integer not null default 0,
    -- Order within the workout
    notes text,
    -- Specific notes for this exercise in this workout
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    -- Add constraint for uniqueness of order within a workout
    constraint workout_exercises_workout_order_unique unique (workout_id, "order")
);
-- Add trigger for updated_at
do $$ begin if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_updated_at_workout_exercises'
) then execute 'CREATE TRIGGER set_updated_at_workout_exercises BEFORE UPDATE ON public.workout_exercises FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();';
end if;
end $$;
-- Add indexes
create index idx_workout_exercises_workout_id on public.workout_exercises(workout_id);
create index idx_workout_exercises_exercise_definition_id on public.workout_exercises(exercise_definition_id);
-- Add comments
comment on table public.workout_exercises is 'Defines how an exercise is used within a specific workout template (sets, reps, order, etc.).';
comment on column public.workout_exercises.workout_id is 'References the specific workout template.';
comment on column public.workout_exercises.exercise_definition_id is 'References the master exercise definition.';
comment on column public.workout_exercises.reps is 'Target reps for the template (can be text like 8-12).';
comment on column public.workout_exercises.weight is 'Suggested target weight for the template.';
comment on column public.workout_exercises.duration is 'Suggested target duration for time-based exercises.';
comment on column public.workout_exercises.rest_period is 'Suggested rest time after this exercise or set.';
comment on column public.workout_exercises."order" is 'Sequence order of the exercise within the workout.';
-- 5. Create Favorites Table
-- Tracks user-favorited workouts
create table public.favorites (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    workout_id uuid not null references public.workouts(id) on delete cascade,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    -- Ensure a user can only favorite a workout once
    constraint unique_user_favorite unique (user_id, workout_id)
);
-- Add indexes
create index idx_favorites_user_id on public.favorites(user_id);
create index idx_favorites_workout_id on public.favorites(workout_id);
-- Add comments
comment on table public.favorites is 'Tracks user-favorited workout templates.';
-- 6. Create Workout Sessions Table
-- Tracks workout instances started by a user
create table public.workout_sessions (
    id uuid primary key default gen_random_uuid(),
    workout_id uuid not null references public.workouts(id) on delete cascade,
    user_id uuid references auth.users(id) on delete
    set null,
        started_at timestamp with time zone,
        ended_at timestamp with time zone,
        status public.session_status not null default 'started',
        notes text,
        created_at timestamp with time zone not null default now(),
        updated_at timestamp with time zone not null default now()
);
-- Add trigger for updated_at
do $$ begin if not exists (
    select 1
    from pg_trigger
    where tgname = 'set_updated_at_workout_sessions'
) then execute 'CREATE TRIGGER set_updated_at_workout_sessions BEFORE UPDATE ON public.workout_sessions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();';
end if;
end $$;
-- Add indexes
create index idx_workout_sessions_workout_id on public.workout_sessions(workout_id);
create index idx_workout_sessions_user_id on public.workout_sessions(user_id);
create index idx_workout_sessions_status on public.workout_sessions(status);
-- Add comments
comment on table public.workout_sessions is 'Tracks instances of workouts started by users.';
comment on column public.workout_sessions.workout_id is 'References the workout template being performed.';
-- 7. Create Exercise Logs Table
-- Stores user performance data for a specific exercise during a specific session
create table public.exercise_logs (
    id uuid primary key default gen_random_uuid(),
    session_id uuid not null references public.workout_sessions(id) on delete cascade,
    -- Link to the specific session
    workout_exercise_id uuid not null references public.workout_exercises(id) on delete cascade,
    -- Link to the specific exercise within the workout template
    set_number integer,
    -- Optional: Track per-set performance if needed
    reps_completed text,
    -- Actual reps performed (can be text)
    weight_used real,
    -- Actual weight used
    weight_unit public.weight_unit_enum,
    duration_completed interval,
    -- Actual duration performed
    logged_at timestamp with time zone not null default now()
);
-- Add indexes
create index idx_exercise_logs_session_id on public.exercise_logs(session_id);
create index idx_exercise_logs_workout_exercise_id on public.exercise_logs(workout_exercise_id);
-- Add comments
comment on table public.exercise_logs is 'Stores user performance data for specific exercises during a workout session.';
comment on column public.exercise_logs.session_id is 'References the specific workout session instance.';
comment on column public.exercise_logs.workout_exercise_id is 'References the specific exercise instance within the workout template being logged.';
comment on column public.exercise_logs.set_number is 'Optional: Track performance per set if applicable.';
comment on column public.exercise_logs.reps_completed is 'Actual reps completed by the user.';
comment on column public.exercise_logs.weight_used is 'Actual weight used by the user.';
comment on column public.exercise_logs.duration_completed is 'Actual duration completed for time-based exercises.';
-- 8. Row Level Security (RLS)
-- IMPORTANT: Enable RLS for each table and define policies
-- Example (you MUST adapt and add policies for all tables):
--
-- alter table public.workouts enable row level security;
-- create policy "Users can view all workouts" on public.workouts for select using (true); -- Or restrict based on created_by etc.
-- create policy "Users can insert their own workouts" on public.workouts for insert with check (auth.uid() = created_by);
-- create policy "Users can update their own workouts" on public.workouts for update using (auth.uid() = created_by);
--
-- alter table public.favorites enable row level security;
-- create policy "Users can manage their own favorites" on public.favorites using (auth.uid() = user_id);
--
-- ... and so on for workout_sessions, exercise_logs, workout_exercises, exercise_definitions ...
-- Define SELECT, INSERT, UPDATE, DELETE policies based on your application's logic.
-- Usually, users should only be able to SELECT/INSERT/UPDATE/DELETE their *own* sessions, logs, and favorites.
-- Policies for workouts and exercise definitions might be more public for SELECT, but restricted for modifications.
-- End of Migration