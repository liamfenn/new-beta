import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'

export default function TaskList({ onClose, taskList, completedTasks, currentActiveTask }) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tasks</DialogTitle>
        </DialogHeader>
        
        <ul className="space-y-3">
          {taskList.map((task, index) => (
            <li 
              key={index} 
              className={`flex items-center gap-3 p-2 rounded ${index === currentActiveTask ? 'bg-white/10' : ''}`}
            >
              <span className={`w-5 h-5 inline-block border ${completedTasks.includes(index) ? 'bg-white/20 border-white/40' : index === currentActiveTask ? 'border-white' : 'border-white/20'} rounded-sm flex-shrink-0 flex items-center justify-center`}>
                {completedTasks.includes(index) && (
                  <span className="text-white text-xs">✓</span>
                )}
              </span>
              <span className={`${completedTasks.includes(index) ? 'line-through opacity-50' : index === currentActiveTask ? 'opacity-100 font-medium' : 'opacity-90'}`}>
                {task}
              </span>
              {index === currentActiveTask && !completedTasks.includes(index) && (
                <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded">Current</span>
              )}
            </li>
          ))}
        </ul>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 