import { useState, useEffect } from 'react'
import { Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'
import './App.css'

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

  useEffect(() => {
    const savedSkills = localStorage.getItem('skills')
    if (savedSkills) {
      setSkills(JSON.parse(savedSkills))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills))
  }, [skills])

  const addSkill = () => {
    if (newSkillName.trim()) {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: newSkillName.trim(),
        level: 3
      }
      setSkills([...skills, newSkill])
      setNewSkillName('')
      setShowAddForm(false)
    }
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSkill()
    }
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
          <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="スキル名を入力してEnterキーを押してください"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
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
