import { X as CloseIcon } from 'lucide-react'

export default function TaskList({ onClose, taskList, completedTasks }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-20 p-4">
      <div className="bg-[#121212] rounded-lg max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col text-white">
        <div className="p-4 flex justify-between items-center border-b border-white/10">
          <h2 className="text-xl font-medium">Tasks</h2>
          <button 
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <ul className="space-y-3">
            {taskList.map((task, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className={`w-5 h-5 inline-block border ${completedTasks.includes(index) ? 'bg-white/20 border-white/40' : 'border-white/20'} rounded-sm flex-shrink-0 flex items-center justify-center`}>
                  {completedTasks.includes(index) && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </span>
                <span className={`${completedTasks.includes(index) ? 'line-through opacity-50' : 'opacity-90'}`}>
                  {task}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="p-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
} 