# 数据模型草案

## Student

- id
- name
- grade
- target_score
- school_type
- enrollment_status
- parent_name
- parent_contact
- created_at
- updated_at

## Assessment

- id
- student_id
- subject
- test_name
- score
- full_score
- taken_at

## Attendance

- id
- student_id
- class_date
- status
- note

## AbilityProfile

- id
- student_id
- calculation
- reading
- logic
- stability
- self_driven
- generated_at

## TeacherNote

- id
- student_id
- teacher_name
- lesson_summary
- concern
- action_plan
- created_at

## AIReport

- id
- student_id
- diagnosis_summary
- parent_message
- next_actions
- generated_at

## Agile 1 最少需要的数据

- Student
- Assessment
- Attendance
- AbilityProfile
- AIReport
