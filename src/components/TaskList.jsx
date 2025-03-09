import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from './ui/sheet'

export default function TaskList({ onClose, taskList, completedTasks, currentActiveTask }) {
  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent side="right" className="p-0 overflow-hidden sm:max-w-sm">
        <div className="flex flex-col h-full">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="text-left text-md font-semibold">Tasks</SheetTitle>
          </SheetHeader>
          
          <ul className="space-y-1 p-4 overflow-y-auto">
            {taskList.map((task, index) => (
              <li 
                key={index} 
                className={`flex items-center gap-2 p-2 rounded ${index === currentActiveTask ? 'bg-muted' : ''}`}
              >
                <span className={`w-4 h-4 inline-block border ${completedTasks.includes(index) ? 'bg-primary/20 border-primary/40' : index === currentActiveTask ? 'border-primary' : 'border-muted-foreground/20'} rounded-sm flex-shrink-0 flex items-center justify-center`}>
                  {completedTasks.includes(index) && (
                    <span className="text-primary text-[10px]">✓</span>
                  )}
                </span>
                <span className={`text-sm ${completedTasks.includes(index) ? 'line-through text-muted-foreground' : index === currentActiveTask ? 'text-foreground font-medium' : 'text-foreground'}`}>
                  {task}
                </span>
                {index === currentActiveTask && !completedTasks.includes(index) && (
                  <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">Current</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
} 