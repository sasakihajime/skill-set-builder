import { useState, useEffect, useRef } from 'react'
import { Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import './App.css'
import { PROGRAMMING_LANGUAGES } from './programmingLanguages'

interface Skill {
  id: string
  name: string
  level: number
}

const SKILL_LEVELS = [
  '知っているレベル',
  '触ったことはある', 
  '調べながら使える',
  '複数案件こなしたことがある',
  '人に教育できる'
]

function App() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [filteredLanguages, setFilteredLanguages] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showDropdown, setShowDropdown] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const savedSkills = localStorage.getItem('skills')
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills))
  }, [skills])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filterLanguages = (input: string) => {
    if (!input.trim()) {
      setFilteredLanguages([])
      setShowDropdown(false)
      return
    }
    
    const filtered = PROGRAMMING_LANGUAGES.filter(lang =>
      lang.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 10)
    
    setFilteredLanguages(filtered)
    setShowDropdown(filtered.length > 0)
    setSelectedIndex(-1)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setNewSkillName(value)
    filterLanguages(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) {
      if (e.key === 'Enter') {
        addSkill()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < filteredLanguages.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          selectLanguage(filteredLanguages[selectedIndex])
        } else {
          addSkill()
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setSelectedIndex(-1)
        break
    }
  }

  const selectLanguage = (language: string) => {
    setNewSkillName(language)
    setShowDropdown(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const addSkill = () => {
    const trimmedName = newSkillName.trim()
    if (!trimmedName) return
    
    const isValidLanguage = PROGRAMMING_LANGUAGES.some(lang => 
      lang.toLowerCase() === trimmedName.toLowerCase()
    )
    
    if (!isValidLanguage) {
      alert('有効なプログラミング言語を入力してください')
      return
    }
    
    const isDuplicate = skills.some(skill => 
      skill.name.toLowerCase() === trimmedName.toLowerCase()
    )
    
    if (isDuplicate) {
      alert('このスキルは既に追加されています')
      return
    }

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: trimmedName,
      level: 3
    }
    setSkills([...skills, newSkill])
    setNewSkillName('')
    setShowAddForm(false)
    setShowDropdown(false)
  }

  const removeSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id))
  }

  const updateSkillLevel = (id: string, newLevel: number) => {
    if (newLevel >= 1 && newLevel <= 5) {
      setSkills(skills.map(skill => 
        skill.id === id ? { ...skill, level: newLevel } : skill
      ))
    }
  }

  const sortSkills = (type: 'level-asc' | 'level-desc' | 'name-asc' | 'name-desc') => {
    const sorted = [...skills].sort((a, b) => {
      switch (type) {
        case 'level-asc':
          return a.level - b.level
        case 'level-desc':
          return b.level - a.level
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        default:
          return 0
      }
    })
    setSkills(sorted)
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">ITエンジニア スキル管理</h1>
        
        <div className="mb-6 flex flex-wrap gap-4">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            スキルを追加
          </button>
          
          <div className="flex gap-2">
            <button
              onClick={() => sortSkills('level-desc')}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm transition-colors"
            >
              レベル降順
            </button>
            <button
              onClick={() => sortSkills('level-asc')}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm transition-colors"
            >
              レベル昇順
            </button>
            <button
              onClick={() => sortSkills('name-asc')}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm transition-colors"
            >
              名前昇順
            </button>
            <button
              onClick={() => sortSkills('name-desc')}
              className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded text-sm transition-colors"
            >
              名前降順
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md relative">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={newSkillName}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="プログラミング言語名を入力してください"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                autoComplete="off"
              />
              
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredLanguages.map((language, index) => (
                    <div
                      key={language}
                      className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                        index === selectedIndex ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => selectLanguage(language)}
                    >
                      {language}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="mt-2 flex gap-2">
              <button
                onClick={addSkill}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
              >
                追加
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setNewSkillName('')
                  setShowDropdown(false)
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
              >
                キャンセル
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((skill) => (
            <div key={skill.id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{skill.name}</h3>
                <button
                  onClick={() => removeSkill(skill.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Minus size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateSkillLevel(skill.id, skill.level - 1)}
                  disabled={skill.level <= 1}
                  className="text-gray-600 hover:text-gray-800 disabled:text-gray-300 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`w-6 h-4 border border-gray-300 ${
                        level <= skill.level ? 'bg-blue-500' : 'bg-gray-100'
                      }`}
                      title={SKILL_LEVELS[level - 1]}
                    />
                  ))}
                </div>
                
                <button
                  onClick={() => updateSkillLevel(skill.id, skill.level + 1)}
                  disabled={skill.level >= 5}
                  className="text-gray-600 hover:text-gray-800 disabled:text-gray-300 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                レベル {skill.level}: {SKILL_LEVELS[skill.level - 1]}
              </div>
            </div>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">まだスキルが登録されていません</p>
            <p className="text-sm">「+」ボタンをクリックしてスキルを追加してください</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
