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
          <h3 className="font-medium text-base">Movement & Interaction</h3>
          <p className="text-foreground text-sm leading-relaxed">
            Use <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">W</kbd>, <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">A</kbd>, <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">S</kbd>, <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">D</kbd> keys to move around the environment. <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">W</kbd> moves forward, <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">S</kbd> moves backward, while <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">A</kbd> and <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">D</kbd> strafe left and right.
          </p>
          <p className="text-foreground text-sm leading-relaxed">
            When you approach an interactive element, a prompt will appear at the bottom of the screen. Press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">E</kbd> to interact with it. Interactive elements include the patient room door, EHR terminal, patient bed, and nurse station.
          </p>
        </div>
      )
    },
    {
      video: "/assets/videos/3.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Command Menu</h3>
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
      video: "/assets/videos/4.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">EHR System</h3>
          <p className="text-foreground text-sm leading-relaxed">
            The Electronic Health Record (EHR) system contains vital patient information. Review:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Patient demographics and history</li>
            <li>Vital signs and lab results</li>
            <li>Medication list</li>
            <li>Imaging reports</li>
          </ul>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            Take notes on important findings using the Notepad (accessible via the command menu).
          </p>
        </div>
      )
    },
    {
      video: "/assets/videos/5.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Patient Examination</h3>
          <p className="text-foreground text-sm leading-relaxed">
            Approach the patient's bed and press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">E</kbd> to examine the patient. You'll receive information about:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Current vital signs</li>
            <li>Physical examination findings</li>
            <li>Patient's reported symptoms</li>
          </ul>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            This information is crucial for your clinical assessment.
          </p>
        </div>
      )
    },
    {
      video: "/assets/videos/6.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Nurse Consultation</h3>
          <p className="text-foreground text-sm leading-relaxed">
            Approach the nurse station and press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">E</kbd> to consult with the nurse. You can:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Ask questions about the patient's condition</li>
            <li>Get updates on recent changes</li>
            <li>Inquire about nursing observations</li>
          </ul>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            The nurse provides valuable insights not found in the EHR.
          </p>
        </div>
      )
    },
    {
      video: "/assets/videos/7.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Guided Workflow</h3>
          <p className="text-foreground text-sm leading-relaxed">
            The simulation follows a guided workflow with specific tasks to complete:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Enter the patient's room</li>
            <li>Review the patient's EHR</li>
            <li>Examine the patient</li>
            <li>Consult with the nurse</li>
            <li>Make a clinical recommendation</li>
          </ol>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            Follow the guidance prompts at the bottom of the screen to progress through the simulation.
          </p>
        </div>
      )
    },
    {
      video: "/assets/videos/8.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Clinical Decision Making</h3>
          <p className="text-foreground text-sm leading-relaxed">
            After gathering all necessary information, you'll need to make a clinical recommendation. Your decision will be evaluated based on:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Accuracy of diagnosis</li>
            <li>Appropriateness of treatment</li>
            <li>Consideration of patient factors</li>
            <li>Evidence-based practice</li>
          </ul>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            You'll receive feedback on your recommendation to help improve your clinical reasoning.
          </p>
        </div>
      )
    },
    {
      video: "/assets/videos/9.mp4",
      content: (
        <div className="space-y-4">
          <h3 className="font-medium text-base">Making Your Recommendation</h3>
          <p className="text-foreground text-sm leading-relaxed">
            After completing all tasks, press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">R</kbd> to make your clinical recommendation. When the recommendation form appears:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>Enter your detailed clinical recommendation and justification</li>
            <li>Click "Submit Recommendation" and review AI-generated feedback</li>
          </ol>
          <p className="text-foreground text-sm leading-relaxed mt-2">
            Your recommendation should be thorough and based on all the information you've gathered during the simulation.
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
      <div className="bg-background shadow-md rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex flex-col">
          <div className="overflow-auto flex-1">
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
                        
                        <div className="mt-2 px-6">
                          {slide.content}
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
          
          <div className="h-px w-full bg-border mt-4"></div>
          
          <div className="flex justify-between px-6 py-4">
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