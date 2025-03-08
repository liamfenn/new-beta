import { useEffect, useState } from 'react'
import { 
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './ui/command'
import { 
  ClipboardList, 
  FileText, 
  Info, 
  BookOpen,
  Keyboard
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
            >
              <ClipboardList className="mr-2 h-4 w-4" />
              <span>Task List</span>
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(onOpenNotepad)}
            >
              <FileText className="mr-2 h-4 w-4" />
              <span>Notepad</span>
              <CommandShortcut>⌘N</CommandShortcut>
            </CommandItem>
            <CommandSeparator />
            <CommandItem
              onSelect={() => runCommand(onOpenScenario)}
            >
              <Info className="mr-2 h-4 w-4" />
              <span>Scenario Info</span>
              <CommandShortcut>⌘I</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(onOpenGuide)}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              <span>Guide</span>
              <CommandShortcut>⌘G</CommandShortcut>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Help">
            <CommandItem>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>View Controls</span>
              <CommandShortcut>⌘/</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
} 