import { useState, useEffect } from 'react'
import { Info, ChevronRight, ChevronLeft } from 'lucide-react'
import { Button } from './ui/button'
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem
} from './ui/carousel'
import { cn } from '../lib/utils'

export default function Guide({ onClose }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [api, setApi] = useState(null)

  // Handle slide change
  const handleSlideChange = () => {
    if (!api) return
    setCurrentSlide(api.selectedScrollSnap())
  }

  useEffect(() => {
    if (!api) return
    api.on('select', handleSlideChange)
    return () => {
      api.off('select', handleSlideChange)
    }
  }, [api])

  // Tutorial slides content
  const tutorialSlides = [
    {
      video: "/assets/videos/1.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Welcome & Basic Controls</h3>
          <p className="text-foreground text-sm leading-relaxed">
            This simulation will test your clinical decision-making skills as an ICU pharmacist. You'll navigate a 3D environment, review patient data, consult with staff, and make a recommendation.
          </p>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            Use <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">W</kbd>, <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">A</kbd>, <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">S</kbd>, <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">D</kbd> keys to move and your mouse to look around. Press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">E</kbd> to engage with objects and people when prompted.
          </p>
        </div>
      )
    },
    {
      video: "/assets/videos/2.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Command Menu & Navigation</h3>
          <p className="text-foreground text-sm leading-relaxed">
            Press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">⌘</kbd>+<kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">K</kbd> (Mac) or <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">Ctrl</kbd>+<kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">K</kbd> (Windows) to open the command menu. You can:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Type to search for commands</li>
            <li>Use <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">↑</kbd>/<kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">↓</kbd> arrow keys to navigate</li>
            <li>Press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">Enter</kbd> to select a command</li>
            <li>Press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">Esc</kbd> to close the menu</li>
          </ul>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            The command menu gives you access to the Task List, Notepad, Scenario Info, and this Guide.
          </p>
        </div>
      )
    },
    {
      video: "/assets/videos/3.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Guided Workflow</h3>
          <p className="text-foreground text-sm leading-relaxed">
            The simulation follows a guided workflow with specific tasks to complete:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Access patient chart</li>
            <li>review and collect relevant info</li>
            <li>Engage with others on the healthcare team as needed</li>
            <li>Make a clinical recommendation</li>
          </ol>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            Follow the guidance prompts at the bottom of the screen to progress through the simulation.
          </p>
        </div>
      )
    },
    {
      video: "/assets/videos/4.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Time Management</h3>
          <p className="text-foreground text-sm leading-relaxed">
            You have 10 minutes to complete all tasks. The timer at the top of the screen shows your remaining time:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Timer turns <span className="text-yellow-500 font-medium">yellow</span> when 5 minutes remain</li>
            <li>Timer turns <span className="text-red-500 font-medium">red</span> when 2 minutes remain</li>
            <li>When time expires, you'll be prompted to make your recommendation</li>
          </ul>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            Manage your time efficiently to gather all necessary information.
          </p>
        </div>
      )
    },
    {
      video: "/assets/videos/5.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Making Your Recommendation</h3>
          <p className="text-foreground text-sm leading-relaxed">
            After completing all tasks, press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">R</kbd> to make your recommendation. When the recommendation form appears:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Provide your response with detailed information that may or may not include drug therapy. Be sure to provide a rationale for your recommendation.</li>
            <li>Click "Submit Recommendation" and review AI-generated feedback</li>
          </ol>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            Your recommendation should be thorough and based on the microbiology results, patient allergies, current medications, and clinical status.
          </p>
        </div>
      )
    }
  ]
  
  const handleContinue = () => {
    if (currentSlide < tutorialSlides.length - 1) {
      api?.scrollNext()
    } else {
      onClose()
    }
  }
  
  const handlePrevious = () => {
    api?.scrollPrev()
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-background shadow-md rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="overflow-y-auto flex-1">
            <div>
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {tutorialSlides.map((slide, index) => (
                    <CarouselItem key={index}>
                      <div className="flex flex-col space-y-4">
                        {slide.video && (
                          <div className="aspect-video bg-muted flex items-center justify-center w-full rounded-t-lg rounded-b-none">
                            <video
                              src={slide.video}
                              autoPlay
                              loop
                              muted
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="mt-2 px-6 pb-4">
                          {slide.content}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          
          <div className="h-px w-full bg-border"></div>
          
          <div className="flex justify-between px-6 py-4 bg-background sticky bottom-0">
            {currentSlide > 0 ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="w-3 h-3 mr-1" />
                <span>Previous</span>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex items-center gap-1"
              >
                Close
              </Button>
            )}
            
            <Button
              variant="default"
              size="sm"
              onClick={handleContinue}
              className="flex items-center gap-1"
            >
              <span>{currentSlide < tutorialSlides.length - 1 ? 'Next' : 'Done'}</span>
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 