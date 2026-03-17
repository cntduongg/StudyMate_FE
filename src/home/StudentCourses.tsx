import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MainHeader from '../components/MainHeader'

interface Course {
  id: number
  title: string
  description: string
  level: string
  thumbnailUrl?: string
  totalEnrollments?: number
  lecturerName?: string
  // Coursera-specific mock fields
  providerName?: string
  providerLogo?: string
  skills?: string[]
  duration?: string
  courseType?: 'Course' | 'Specialization' | 'Professional Certificate'
}

const mapCourseLevel = (totalSections: number): string => {
  if (totalSections <= 3) return 'Beginner'
  if (totalSections <= 6) return 'Intermediate'
  return 'Advanced'
}

const normalizeCourse = (raw: any): Course => {
  const totalSections = Number(raw.totalSections || 0)
  const totalMaterials = Number(raw.totalMaterials || 0)

  return {
    id: raw.id,
    title: raw.title || 'Untitled Course',
    description: raw.description || 'No description available.',
    level: mapCourseLevel(totalSections),
    thumbnailUrl: undefined,
    totalEnrollments: Number(raw.totalEnrollments || 0),
    lecturerName: raw.teacherName || 'Unknown teacher',
    providerName: raw.teacherName || 'StudyMate',
    providerLogo: raw.teacherAvatar || undefined,
    skills: raw.categoryName ? [raw.categoryName] : ['General'],
    duration: `${totalSections} section(s) • ${totalMaterials} material(s)`,
    courseType: 'Course'
  }
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <Link to={`/courses/${course.id}`} className="flex flex-col h-full bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <i className="fa-solid fa-image text-3xl"></i>
          </div>
        )}
        
        {/* Provider Logo Overlay */}
        {course.providerLogo && (
          <div className="absolute bottom-3 left-3 h-10 w-10 bg-white p-1.5 rounded shadow-sm">
            <img src={course.providerLogo} alt={course.providerName} className="h-full w-full object-contain" />
          </div>
        )}
        
        {/* Course Type Tag */}
        {course.courseType && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-slate-700 uppercase tracking-wide border border-slate-100 shadow-sm">
            {course.courseType}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{course.providerName}</span>
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-[#1976d2] transition-colors line-clamp-2 min-h-[3.5rem]">
          {course.title}
        </h3>

        <div className="mt-2 mb-4">
          <p className="text-xs text-slate-500 font-medium mb-1">Skills you'll gain:</p>
          <div className="flex flex-wrap gap-1">
            {course.skills?.slice(0, 3).map((skill, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded">
                {skill}
              </span>
            ))}
            {course.skills && course.skills.length > 3 && (
              <span className="text-[10px] text-slate-400 self-center">+{course.skills.length - 3}</span>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <i className="fa-regular fa-clock"></i>
                {course.duration?.split(' at ')[0]}
              </span>
              <span className="flex items-center gap-1">
                <i className="fa-solid fa-signal"></i>
                {course.level}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-1">
              <i className="fa-solid fa-user-group"></i>
              <span>{course.totalEnrollments || 0} enrolled</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const StudentCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('All')

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('https://localhost:7259/api/Course/all')
        if (response.ok) {
          const result = await response.json()
          const apiData = Array.isArray(result?.data) ? result.data : []
          setCourses(apiData.map(normalizeCourse))
        } else {
          setCourses([])
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.skills?.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesLevel = selectedLevel === 'All' || course.level.toLowerCase() === selectedLevel.toLowerCase()
    
    return matchesSearch && matchesLevel
  })

  return (
    <div className="min-h-screen bg-white">
      <MainHeader />

      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-sliders text-sm text-[#1976d2]"></i> Filter By
              </h3>
              
              <div className="space-y-6">
                {/* Level Filter */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Level</h4>
                  <div className="space-y-2">
                    {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
                      <label key={level} className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="radio" 
                          name="level"
                          className="w-4 h-4 text-[#1976d2] border-slate-300 focus:ring-[#1976d2]"
                          checked={selectedLevel === level}
                          onChange={() => setSelectedLevel(level)}
                        />
                        <span className={`text-sm ${selectedLevel === level ? 'text-[#1976d2] font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Duration Filter Mock */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Duration</h4>
                  <div className="space-y-2">
                    {['Less than 2 hours', '1-4 weeks', '1-3 months', '3+ months'].map(dur => (
                      <label key={dur} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#1976d2] focus:ring-[#1976d2]" />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900">{dur}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Topic Filter Mock */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Subject</h4>
                  <div className="space-y-2">
                    {['Computer Science', 'Data Science', 'Business', 'Personal Development'].map(sub => (
                      <label key={sub} className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#1976d2] focus:ring-[#1976d2]" />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900">{sub}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-[#1976d2] to-[#145ca5] rounded-xl text-white">
              <h4 className="font-bold mb-2">Learn without limits</h4>
              <p className="text-xs text-white/80 mb-4 leading-relaxed">Get unlimited access to 7,000+ courses with StudyMate Plus.</p>
              <Link to="/membership" className="block text-center bg-white text-[#1976d2] py-2 rounded-md text-xs font-bold hover:bg-slate-50 transition-colors">
                Try Plus for Free
              </Link>
            </div>
          </aside>

          {/* Course Grid Area */}
          <div className="flex-1">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {selectedLevel === 'All' ? 'All Courses' : `${selectedLevel} Courses`}
                </h2>
                <p className="text-sm text-slate-500 font-medium">Showing {filteredCourses.length} results</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500 font-medium">Sort by:</span>
                <select className="bg-white border border-slate-200 rounded-md px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#1976d2]/20">
                  <option>Most Relevant</option>
                  <option>Newest</option>
                  <option>Top Rated</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-lg border border-slate-200 h-[400px] animate-pulse">
                    <div className="aspect-[16/9] bg-slate-100"></div>
                    <div className="p-5 space-y-4">
                      <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                      <div className="h-6 bg-slate-100 rounded w-3/4"></div>
                      <div className="space-y-2 pt-2">
                        <div className="h-3 bg-slate-100 rounded w-full"></div>
                        <div className="h-3 bg-slate-100 rounded w-5/6"></div>
                      </div>
                      <div className="flex justify-between pt-6">
                        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <i className="fa-solid fa-magnifying-glass text-3xl text-slate-300"></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900">We couldn't find any matches</h3>
                <p className="text-slate-500 mt-2 max-w-xs mx-auto">Try searching for something else or clearing your filters.</p>
                <button 
                  onClick={() => {setSearchTerm(''); setSelectedLevel('All');}}
                  className="mt-6 bg-[#1976d2] text-white px-6 py-2.5 rounded-md font-bold hover:bg-[#145ca5] transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer Area - Minimal Coursera style */}
      <footer className="bg-[#f5f5f5] border-t border-slate-200 mt-20">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div>
              <h5 className="font-bold text-slate-900 mb-5">StudyMate</h5>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#1976d2]">About</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">What we offer</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Leadership</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Careers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-5">Community</h5>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#1976d2]">Learners</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Partners</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Developers</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Beta Testers</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 mb-5">More</h5>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#" className="hover:text-[#1976d2]">Press</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Investors</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Terms</a></li>
                <li><a href="#" className="hover:text-[#1976d2]">Privacy</a></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h5 className="font-bold text-slate-900 mb-5">Mobile App</h5>
              <div className="flex flex-col gap-3">
                <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 cursor-pointer">
                  <i className="fa-brands fa-apple text-2xl"></i>
                  <div className="leading-tight">
                    <p className="text-[10px] uppercase">Download on the</p>
                    <p className="text-sm font-bold">App Store</p>
                  </div>
                </div>
                <div className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-3 cursor-pointer">
                  <i className="fa-brands fa-google-play text-xl"></i>
                  <div className="leading-tight">
                    <p className="text-[10px] uppercase">Get it on</p>
                    <p className="text-sm font-bold">Google Play</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-slate-500">© 2025 StudyMate Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <i className="fa-brands fa-facebook text-slate-400 hover:text-[#1976d2] cursor-pointer"></i>
              <i className="fa-brands fa-linkedin text-slate-400 hover:text-[#1976d2] cursor-pointer"></i>
              <i className="fa-brands fa-twitter text-slate-400 hover:text-[#1976d2] cursor-pointer"></i>
              <i className="fa-brands fa-youtube text-slate-400 hover:text-[#1976d2] cursor-pointer"></i>
              <i className="fa-brands fa-instagram text-slate-400 hover:text-[#1976d2] cursor-pointer"></i>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default StudentCourses
