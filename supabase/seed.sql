-- supabase/seed.sql (Simplified Version)
-- Seed data based on data/workouts.ts
-- Define UUIDs for workouts (replace with actual generated UUIDs if preferred)
-- You can generate UUIDs online or use psql's gen_random_uuid() once if needed.
-- For simplicity, we'll use placeholder text UUIDs here conceptually, but replace them
-- with actual valid UUIDs in the script.
-- Example UUIDs:
-- workout_strength_id = '00000000-0000-0000-0000-000000000001'
-- workout_yoga_id     = '00000000-0000-0000-0000-000000000002'
-- etc.
-- exercise_squats_id  = '11111111-1111-1111-1111-111111111111'
-- etc.
-- Clear existing data (optional, use with caution)
-- delete from public.exercise_logs;
-- delete from public.workout_sessions;
-- delete from public.favorites;
-- delete from public.workout_exercises;
-- delete from public.workouts;
-- delete from public.exercise_definitions;
begin;
-- Wrap in transaction
-- Define UUIDs for exercises (replace if needed)
-- ... existing exercise UUID definitions ...

-- Define UUIDs for categories -- Removed define, using hardcoded UUIDs below
-- Category UUIDs (Example: starting with 222...)
-- Strength Training: 22222222-0000-0000-0000-000000000001
-- Functional Fitness / HIIT: 22222222-0000-0000-0000-000000000002
-- Yoga: 22222222-0000-0000-0000-000000000003
-- Breathwork: 22222222-0000-0000-0000-000000000004
-- Endurance / Race: 22222222-0000-0000-0000-000000000005
-- HYROX: 22222222-0000-0000-0000-000000000006 -- New

-- 1. Insert Exercise Definitions
insert into public.exercise_definitions (id, name, description)
values (
        '11111111-1111-1111-1111-111111111111',
        'Squats',
        'Compound leg exercise.'
    ),
    (
        '11111111-1111-1111-1111-111111111112',
        'Bench Press',
        'Compound chest exercise.'
    ),
    (
        '11111111-1111-1111-1111-111111111113',
        'Deadlift',
        'Compound full-body exercise.'
    ),
    (
        '11111111-1111-1111-1111-111111111114',
        'Overhead Press',
        'Compound shoulder exercise.'
    ),
    (
        '11111111-1111-1111-1111-111111111115',
        'Burpees',
        'Full-body calisthenics exercise.'
    ),
    (
        '11111111-1111-1111-1111-111111111116',
        'Mountain Climbers',
        'Cardio exercise engaging core.'
    ),
    (
        '11111111-1111-1111-1111-111111111117',
        'Jumping Jacks',
        'Classic cardio exercise.'
    ),
    (
        '11111111-1111-1111-1111-111111111118',
        'High Knees',
        'Running in place, bringing knees high.'
    ),
    (
        '11111111-1111-1111-1111-111111111119',
        'Downward-Facing Dog',
        'Inverted V-shape pose.'
    ),
    (
        '11111111-1111-1111-1111-11111111111a',
        'Warrior II',
        'Standing pose strengthening legs and opening hips.'
    ),
    (
        '11111111-1111-1111-1111-11111111111b',
        'Child''s Pose',
        'Resting pose.'
    ),
    (
        '11111111-1111-1111-1111-11111111111c',
        'Cobra Pose',
        'Backbend to strengthen spine.'
    ),
    (
        '11111111-1111-1111-1111-11111111111d',
        'Pull-Ups',
        'Bodyweight pull exercise.'
    ),
    (
        '11111111-1111-1111-1111-11111111111e',
        'Kettlebell Swings',
        'Explosive hip hinge movement.'
    ),
    (
        '11111111-1111-1111-1111-11111111111f',
        'Box Jumps',
        'Plyometric jump onto a box.'
    ),
    (
        '11111111-1111-1111-1111-111111111120',
        'Double Unders',
        'Jumping rope with two rotations per jump.'
    ),
    (
        '11111111-1111-1111-1111-111111111121',
        'Push-Ups',
        'Classic bodyweight chest exercise.'
    ),
    (
        '11111111-1111-1111-1111-111111111122',
        'Lunges',
        'Bodyweight leg exercise.'
    ),
    (
        '11111111-1111-1111-1111-111111111123',
        'Plank',
        'Core stability exercise.'
    ),
    (
        '11111111-1111-1111-1111-111111111124',
        'Air Squats',
        'Bodyweight squats.'
    ),
    (
        '11111111-1111-1111-1111-111111111125',
        'Run',
        'Running for distance.'
    ),
    (
        '11111111-1111-1111-1111-111111111126',
        '4-7-8 Breathing Technique',
        'Structured breathing pattern.'
    ),
    (
        '11111111-1111-1111-1111-111111111127',
        'SkiErg',
        'Simulates cross-country skiing.'
    ),
    (
        '11111111-1111-1111-1111-111111111128',
        'Sled Push',
        'Pushing a weighted sled.'
    ),
    (
        '11111111-1111-1111-1111-111111111129',
        'Sled Pull',
        'Pulling a weighted sled.'
    ),
    (
        '11111111-1111-1111-1111-11111111112a',
        'Burpee Broad Jump',
        'Burpee followed by a long jump.'
    ),
    (
        '11111111-1111-1111-1111-11111111112b',
        'Rowing',
        'Indoor rowing machine.'
    ),
    (
        '11111111-1111-1111-1111-11111111112c',
        'Kettlebell Farmer''s Carry',
        'Walking while holding heavy kettlebells.'
    ),
    (
        '11111111-1111-1111-1111-11111111112d',
        'Sandbag Lunges',
        'Lunges while holding a sandbag.'
    ),
    (
        '11111111-1111-1111-1111-11111111112e',
        'Wall Balls',
        'Throwing a medicine ball against a wall.'
    ),
    (
        '11111111-1111-1111-1111-111111111130',
        'Hand Release Push-Ups',
        'Push-ups where hands lift off ground at bottom.'
    ) on conflict (id) do nothing;
-- Avoid errors if run multiple times

-- 1.5 Insert Workout Types
insert into public.workout_types (id, name, description)
values
    ('22222222-0000-0000-0000-000000000001', 'Strength', 'Workouts focused on building muscular strength, often using weights.'),
    ('22222222-0000-0000-0000-000000000002', 'Functional', 'Workouts mimicking everyday movements, often combining strength, cardio, and flexibility (includes HIIT, CrossFit style).'),
    ('22222222-0000-0000-0000-000000000003', 'Yoga', 'Practices involving postures, breathing techniques, and meditation for flexibility and mindfulness.'),
    ('22222222-0000-0000-0000-000000000004', 'Breathwork', 'Focused techniques to control breathing for relaxation or performance.'),
    ('22222222-0000-0000-0000-000000000005', 'Endurance', 'Workouts designed to improve cardiovascular fitness or simulate race conditions (e.g., running).'),
    ('22222222-0000-0000-0000-000000000006', 'HYROX', 'Standardized fitness race combining running and functional exercises.');

-- 2. Insert Workouts (using type UUIDs)
-- Note: created_by is null for now
insert into public.workouts (
        id,
        name,
        description,
        type_id, -- Changed from category_id
        created_by
    )
values
    ('00000000-0000-0000-0000-000000000001', 'Strength Training', 'A 45-minute strength training routine.', '22222222-0000-0000-0000-000000000001', null), -- Strength
    ('00000000-0000-0000-0000-000000000002', 'HIIT Workout', 'High-Intensity Interval Training focusing on cardio and strength.', '22222222-0000-0000-0000-000000000002', null), -- Functional
    ('00000000-0000-0000-0000-000000000003', 'Yoga Flow', 'A relaxing yoga session to improve flexibility and mindfulness.', '22222222-0000-0000-0000-000000000003', null), -- Yoga
    ('00000000-0000-0000-0000-000000000004', 'CrossFit WOD', 'Workout of the Day combining various functional movements.', '22222222-0000-0000-0000-000000000002', null), -- Functional
    ('00000000-0000-0000-0000-000000000005', 'Beginner Bodyweight', 'Basic exercises using bodyweight for resistance.', '22222222-0000-0000-0000-000000000002', null), -- Functional
    ('00000000-0000-0000-0000-000000000006', 'Murph', 'Hero WOD combining running, pull-ups, push-ups, and squats.', '22222222-0000-0000-0000-000000000005', null), -- Endurance
    ('00000000-0000-0000-0000-000000000007', '4-7-8 Breathing', 'A simple technique for relaxation.', '22222222-0000-0000-0000-000000000004', null), -- Breathwork
    ('00000000-0000-0000-0000-000000000008', 'HYROX', 'Standardized fitness race simulation.', '22222222-0000-0000-0000-000000000006', null); -- HYROX

-- 3. Insert Workout Exercises (Linking workouts and exercises using simplified UUIDs)
-- We only fill sets/reps/duration where easily inferred from source data.
insert into public.workout_exercises (
        workout_id,
        exercise_definition_id,
        sets,
        reps,
        weight,
        duration,
        "order"
    )
values -- Strength Training
    (
        '00000000-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111111',
        5,
        '5',
        null,
        null,
        1
    ),
    -- Squats
    (
        '00000000-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111112',
        5,
        '5',
        null,
        null,
        2
    ),
    -- Bench Press
    (
        '00000000-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111113',
        5,
        '5',
        null,
        null,
        3
    ),
    -- Deadlift
    (
        '00000000-0000-0000-0000-000000000001',
        '11111111-1111-1111-1111-111111111114',
        5,
        '5',
        null,
        null,
        4
    ),
    -- Overhead Press
    -- HIIT Workout
    (
        '00000000-0000-0000-0000-000000000002',
        '11111111-1111-1111-1111-111111111115',
        3,
        '10',
        null,
        null,
        1
    ),
    -- Burpees
    (
        '00000000-0000-0000-0000-000000000002',
        '11111111-1111-1111-1111-111111111116',
        3,
        '30 sec',
        null,
        interval '30 second',
        2
    ),
    -- Mountain Climbers
    (
        '00000000-0000-0000-0000-000000000002',
        '11111111-1111-1111-1111-111111111117',
        3,
        '20',
        null,
        null,
        3
    ),
    -- Jumping Jacks
    (
        '00000000-0000-0000-0000-000000000002',
        '11111111-1111-1111-1111-111111111118',
        3,
        '30 sec',
        null,
        interval '30 second',
        4
    ),
    -- High Knees
    -- Yoga Flow
    (
        '00000000-0000-0000-0000-000000000003',
        '11111111-1111-1111-1111-111111111119',
        null,
        null,
        null,
        interval '20 second',
        1
    ),
    -- Downward-Facing Dog
    (
        '00000000-0000-0000-0000-000000000003',
        '11111111-1111-1111-1111-11111111111a',
        null,
        null,
        null,
        interval '20 second',
        2
    ),
    -- Warrior II
    (
        '00000000-0000-0000-0000-000000000003',
        '11111111-1111-1111-1111-11111111111c',
        null,
        null,
        null,
        interval '20 second',
        3
    ),
    -- Cobra Pose
    (
        '00000000-0000-0000-0000-000000000003',
        '11111111-1111-1111-1111-11111111111b',
        null,
        null,
        null,
        interval '20 second',
        4
    ),
    -- Child's Pose
    -- CrossFit WOD
    (
        '00000000-0000-0000-0000-000000000004',
        '11111111-1111-1111-1111-11111111111d',
        3,
        'AMRAP',
        null,
        null,
        1
    ),
    -- Pull-Ups
    (
        '00000000-0000-0000-0000-000000000004',
        '11111111-1111-1111-1111-11111111111e',
        3,
        '15',
        24,
        null,
        2
    ),
    -- Kettlebell Swings
    (
        '00000000-0000-0000-0000-000000000004',
        '11111111-1111-1111-1111-11111111111f',
        3,
        '10',
        null,
        null,
        3
    ),
    -- Box Jumps
    (
        '00000000-0000-0000-0000-000000000004',
        '11111111-1111-1111-1111-111111111120',
        3,
        '50',
        null,
        null,
        4
    ),
    -- Double Unders
    -- Beginner Bodyweight
    (
        '00000000-0000-0000-0000-000000000005',
        '11111111-1111-1111-1111-111111111121',
        3,
        '10',
        null,
        null,
        1
    ),
    -- Push-Ups
    (
        '00000000-0000-0000-0000-000000000005',
        '11111111-1111-1111-1111-111111111124',
        3,
        '15',
        null,
        null,
        2
    ),
    -- Air Squats
    (
        '00000000-0000-0000-0000-000000000005',
        '11111111-1111-1111-1111-111111111122',
        3,
        '10 each leg',
        null,
        null,
        3
    ),
    -- Lunges
    (
        '00000000-0000-0000-0000-000000000005',
        '11111111-1111-1111-1111-111111111123',
        3,
        '30 sec',
        null,
        interval '30 second',
        4
    ),
    -- Plank
    -- Murph
    (
        '00000000-0000-0000-0000-000000000006',
        '11111111-1111-1111-1111-111111111125',
        null,
        '1 mile',
        null,
        null,
        1
    ),
    -- Run
    (
        '00000000-0000-0000-0000-000000000006',
        '11111111-1111-1111-1111-11111111111d',
        null,
        '100',
        null,
        null,
        2
    ),
    -- Pull-Ups
    (
        '00000000-0000-0000-0000-000000000006',
        '11111111-1111-1111-1111-111111111121',
        null,
        '200',
        null,
        null,
        3
    ),
    -- Push-Ups
    (
        '00000000-0000-0000-0000-000000000006',
        '11111111-1111-1111-1111-111111111124',
        null,
        '300',
        null,
        null,
        4
    ),
    -- Air Squats
    (
        '00000000-0000-0000-0000-000000000006',
        '11111111-1111-1111-1111-111111111125',
        null,
        '1 mile',
        null,
        null,
        5
    ),
    -- Run
    -- 4-7-8 Breathing
    (
        '00000000-0000-0000-0000-000000000007',
        '11111111-1111-1111-1111-111111111126',
        null,
        '4 rounds',
        null,
        null,
        1
    ),
    -- 4-7-8 Breathing
    -- HYROX
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111125',
        null,
        '1 KM',
        null,
        null,
        1
    ),
    -- Run
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111127',
        null,
        '1000 m',
        null,
        null,
        2
    ),
    -- SkiErg
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111125',
        null,
        '1 KM',
        null,
        null,
        3
    ),
    -- Run
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111128',
        null,
        '2x25 m',
        null,
        null,
        4
    ),
    -- Sled Push
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111125',
        null,
        '1 KM',
        null,
        null,
        5
    ),
    -- Run
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111129',
        null,
        '2x25 m',
        null,
        null,
        6
    ),
    -- Sled Pull
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111125',
        null,
        '1 KM',
        null,
        null,
        7
    ),
    -- Run
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-11111111112a',
        null,
        '80 m',
        null,
        null,
        8
    ),
    -- Burpee Broad Jump
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111125',
        null,
        '1 KM',
        null,
        null,
        9
    ),
    -- Run
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-11111111112b',
        null,
        '1000 m',
        null,
        null,
        10
    ),
    -- Rowing
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111125',
        null,
        '1 KM',
        null,
        null,
        11
    ),
    -- Run
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-11111111112c',
        null,
        '200 m',
        null,
        null,
        12
    ),
    -- Kettlebell Farmer's Carry
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111125',
        null,
        '1 KM',
        null,
        null,
        13
    ),
    -- Run
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-11111111112d',
        null,
        '100 m',
        null,
        null,
        14
    ),
    -- Sandbag Lunges
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-111111111125',
        null,
        '1 KM',
        null,
        null,
        15
    ),
    -- Run
    (
        '00000000-0000-0000-0000-000000000008',
        '11111111-1111-1111-1111-11111111112e',
        null,
        '100',
        null,
        null,
        16
    ) -- Wall Balls
;
commit;
-- Commit transaction