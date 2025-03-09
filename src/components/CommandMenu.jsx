import { useEffect, useState } from 'react'
import { 
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator
} from './ui/command'
import { 
  ClipboardList, 
  FileText, 
  Info, 
  BookOpen
} from 'lucide-react'

export default function CommandMenu({ 
  onToggleTaskList, 
  onOpenNotepad, 
  onOpenScenario, 
  onOpenGuide 
}) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (document.pointerLockElement) {
          document.exitPointerLock()
        }
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command) => {
    setOpen(false)
    command()
  }

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen)
    if (!newOpen && !document.pointerLockElement) {
      try {
        document.body.requestPointerLock()
      } catch (error) {
        console.error("Could not re-lock pointer:", error)
      }
    }
  }

  return (
    <>
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() => runCommand(onToggleTaskList)}
              className="text-foreground"
            >
              <ClipboardList className="mr-2 h-4 w-4 text-foreground" />
              <span>Task List</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(onOpenNotepad)}
              className="text-foreground"
            >
              <FileText className="mr-2 h-4 w-4 text-foreground" />
              <span>Notepad</span>
            </CommandItem>
            <CommandSeparator />
            <CommandItem
              onSelect={() => runCommand(onOpenScenario)}
              className="text-foreground"
            >
              <Info className="mr-2 h-4 w-4 text-foreground" />
              <span>Scenario Info</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(onOpenGuide)}
              className="text-foreground"
            >
              <BookOpen className="mr-2 h-4 w-4 text-foreground" />
              <span>Guide</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
} 