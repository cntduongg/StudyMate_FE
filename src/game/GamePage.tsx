import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { gameQuestions } from './data'
import MainHeader from '../components/MainHeader'

const GamePage: React.FC = () => {
  const navigate = useNavigate()

  // Game States
  const [gameState, setGameState] = useState<'start' | 'playing' | 'result'>('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [, setIsCorrect] = useState<boolean | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const currentQuestion = gameQuestions[currentQuestionIndex]
  const totalQuestions = gameQuestions.length
  const correctRate = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

  // Start the game
  const startGame = () => {
    setGameState('playing')
    setCurrentQuestionIndex(0)
    setScore(0)
    setCorrectAnswers(0)
    setStreak(0)
    setTimeLeft(gameQuestions[0].timeLimit)
    setIsAnswered(false)
    setSelectedOption(null)
  }

  // Handle Answer Submission
  const handleAnswer = useCallback((optionIndex: number) => {
    if (isAnswered) return
    
    setIsAnswered(true)
    setSelectedOption(optionIndex)
    
    const correct = optionIndex === currentQuestion.correctAnswer
    setIsCorrect(correct)
    
    if (correct) {
      const bonus = Math.floor(timeLeft * 10) // Speed bonus
      const pointsGained = currentQuestion.points + bonus
      setScore(prev => prev + pointsGained)
      setCorrectAnswers(prev => prev + 1)
      setStreak(prev => prev + 1)
    } else {
      setStreak(0)
    }

    // Wait 1.5s before moving to next question
    setTimeout(() => {
      const nextIndex = currentQuestionIndex + 1
      if (nextIndex < totalQuestions) {
        setCurrentQuestionIndex(nextIndex)
        setTimeLeft(gameQuestions[nextIndex].timeLimit)
        setIsAnswered(false)
        setSelectedOption(null)
        setIsCorrect(null)
      } else {
        setGameState('result')
      }
    }, 1500)
  }, [currentQuestionIndex, isAnswered, timeLeft, currentQuestion, totalQuestions])

  // Timer logic
  useEffect(() => {
    let timer: any
    if (gameState === 'playing' && timeLeft > 0 && !isAnswered) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState === 'playing' && !isAnswered) {
      // Time's up! Treat as wrong answer
      handleAnswer(-1)
    }
    return () => clearInterval(timer)
  }, [gameState, timeLeft, isAnswered, handleAnswer])

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 flex flex-col">
      <MainHeader />

      {/* Game Content */}
      <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 md:py-10">
        <div className="mb-6 rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-500">Game Mode</p>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-900">Quiz Sprint</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs uppercase tracking-widest font-semibold text-slate-500">Score</p>
              <p className="text-2xl font-black text-[#1976d2]">{score.toLocaleString()}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="h-10 w-10 rounded-full border border-slate-300 text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-colors"
              aria-label="Close game"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {gameState === 'start' && (
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-sm p-8 text-center space-y-8">
            <div className="space-y-4">
              <div className="h-20 w-20 bg-[#1976d2] rounded-2xl mx-auto flex items-center justify-center shadow-sm">
                <i className="fa-solid fa-bolt text-5xl text-white"></i>
              </div>
              <h2 className="text-4xl font-black tracking-tight text-slate-900">QUIZ SPRINT</h2>
              <p className="text-slate-600 max-w-sm mx-auto">
                Trả lời nhanh để ghi điểm cao nhất. Bạn đã sẵn sàng để thử thách trí tuệ?
              </p>
            </div>
            
            <div className="space-y-4 pt-8">
              <button 
                onClick={startGame}
                className="w-full sm:w-64 bg-[#1976d2] hover:bg-[#1565c0] text-white py-4 rounded-xl font-black text-xl transition-colors"
              >
                PLAY NOW
              </button>
              <div className="flex justify-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-widest flex-wrap">
                <span>{totalQuestions} Questions</span>
                <span>•</span>
                <span>Time Bonus</span>
                <span>•</span>
                <span>Streak x2</span>
              </div>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full space-y-6">
            {/* Stats Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-[#e3f2fd] text-[#1976d2] flex items-center justify-center text-lg font-bold border border-[#bbdefb]">
                  {currentQuestionIndex + 1}/{gameQuestions.length}
                </div>
                {streak > 1 && (
                  <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-black">
                    🔥 STREAK {streak}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <i className="fa-solid fa-clock text-[#1976d2]"></i>
                <div className="w-48 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div 
                    className={`h-full transition-all duration-1000 ${timeLeft < 5 ? 'bg-red-500' : 'bg-[#1976d2]'}`}
                    style={{ width: `${(timeLeft / currentQuestion.timeLimit) * 100}%` }}
                  ></div>
                </div>
                <span className={`text-xl font-bold w-8 ${timeLeft < 5 ? 'text-red-600' : 'text-[#1976d2]'}`}>
                  {timeLeft}s
                </span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#1976d2] opacity-70"></div>
              <h2 className="text-3xl md:text-4xl font-bold text-center leading-tight py-6 text-slate-900">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => {
                let statusClass = "bg-white border-slate-200 hover:border-[#1976d2] hover:bg-[#f7fbff]"
                if (isAnswered) {
                  if (idx === currentQuestion.correctAnswer) statusClass = "bg-green-50 border-green-400"
                  else if (idx === selectedOption) statusClass = "bg-red-50 border-red-400"
                  else statusClass = "bg-slate-50 border-slate-200 opacity-70"
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleAnswer(idx)}
                    className={`p-6 rounded-xl border-2 text-left text-lg font-semibold text-slate-800 transition-all flex items-center gap-4 ${statusClass} group`}
                  >
                    <span className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-[#1976d2]">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                    {isAnswered && idx === currentQuestion.correctAnswer && (
                      <i className="fa-solid fa-check-circle ml-auto text-2xl text-green-600"></i>
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswer && (
                      <i className="fa-solid fa-xmark-circle ml-auto text-2xl text-red-600"></i>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {gameState === 'result' && (
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-sm p-8 text-center space-y-8">
            <div className="space-y-4">
              <div className="h-24 w-24 bg-amber-100 rounded-full mx-auto flex items-center justify-center border border-amber-200">
                <i className="fa-solid fa-trophy text-5xl text-amber-500"></i>
              </div>
              <h2 className="text-4xl font-black text-slate-900">GAME OVER!</h2>
              <p className="text-slate-600">Bạn đã hoàn thành thử thách xuất sắc.</p>
            </div>

            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Final Score</span>
                <p className="text-4xl font-black text-[#1976d2] mt-2">{score.toLocaleString()}</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correct Rate</span>
                <p className="text-4xl font-black text-slate-800 mt-2">{correctRate}%</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <button 
                onClick={startGame}
                className="bg-[#1976d2] hover:bg-[#1565c0] text-white px-10 py-4 rounded-xl font-black text-xl transition-colors"
              >
                REPLAY
              </button>
              <button 
                onClick={() => navigate('/')}
                className="bg-white hover:bg-slate-50 text-slate-800 px-10 py-4 rounded-xl font-black text-xl border border-slate-300 transition-colors"
              >
                HOME
              </button>
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Footer hint */}
      {gameState === 'playing' && (
        <div className="py-6 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
          Trình độ: Trung cấp • Thể loại: Lập trình Web
        </div>
      )}
    </div>
  )
}

export default GamePage
