class Tutor {
  id: string = '';
  bio: string = '';
  name: string = '';
  avatar_url: string = '';
  description: string = '';
}

class Category {
  id: string = '';
  name: string = '';
}

export class Lesson {
  id: string = '';
  title: string = '';
  position: number = 0;
  duration?: number = 0;
  open_access: boolean = false;
  type: 'video' | 'article' | 'lab' = 'video';
}

export class Module {
  id: string = '';
  title: string = '';
  position: number = 0;
  lessons: Lesson[] = [];
  lessons_count: number = 0;
}

class IncludesSection {
  modules_count: number = 0;
  lessons_count: number = 0;
  hours_of_video: number = 0;
  course_duration: number = 0;
  mock_exams: boolean = false;
  lab_lessons: boolean = false;
  lab_lesson_count: number = 0;
  quiz_lessons: boolean = false;
  quiz_lesson_count: number = 0;
}

export class CourseDetails {
  id: string = '';
  slug: string = '';
  title: string = '';
  excerpt: string = '';
  tutors: Tutor[] = [];
  popularity: number = 0;
  modules: Module[] = [];
  hidden: boolean = false;
  description: string = '';
  userback_id: string = '';
  lessons_count: number = 0;
  thumbnail_url: string = '';
  categories: Category[] = [];
  thumbnail_video_url: string = '';
  plan: 'Free' | 'Paid' | 'Standard' = 'Free';
  includes_section: IncludesSection = new IncludesSection();
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
}

export class PagninationSchema {
  page: number = 1;
  limit: number = 10;
  next_page: number = 1;
  total_count: number = 0;
}



class CourseData {
  isLoading: boolean = false;
  isLoadingDetails:boolean = false
  courses: Array<CourseDetails> = [];
  metadata: PagninationSchema = new PagninationSchema();
  courseDetails: Record<string, CourseDetails> = {}
}

export class HomeModel {
  courseData: CourseData = new CourseData();
}
