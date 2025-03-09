import { useState, useEffect } from 'react'
import { Play, ChevronRight, ChevronLeft, Info } from 'lucide-react'
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem
} from './ui/carousel'
import { Button } from './ui/button'
import { cn } from '../lib/utils'

export default function Modal({ step, onContinue, onStart }) {
  const [open, setOpen] = useState(true)
  const [currentSection, setCurrentSection] = useState(step || 'welcome')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [api, setApi] = useState(null)

  // Update current section when step prop changes
  useEffect(() => {
    if (step) {
      setCurrentSection(step)
    }
  }, [step])

  // Reset slide position when section changes
  useEffect(() => {
    if (api) {
      api.scrollTo(0)
      setCurrentSlide(0)
    }
  }, [currentSection, api])

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

  // Handle continue button click
  const handleContinue = () => {
    if (currentSection === 'welcome') {
      setCurrentSection('tutorial')
      onContinue('tutorial')
    } else if (currentSection === 'tutorial') {
      if (currentSlide < tutorialSlides.length - 1) {
        api?.scrollNext()
      } else {
        setCurrentSection('scenario')
        onContinue('scenario')
      }
    } else if (currentSection === 'scenario') {
      setOpen(false)
      onStart()
    }
  }

  // Handle previous button click
  const handlePrevious = () => {
    api?.scrollPrev()
  }

  // Tutorial slides content
  const tutorialSlides = [
    {
      videoPlaceholder: "/assets/controls_placeholder.jpg",
      content: (
        <div className="space-y-4">
          <p className="text-foreground text-sm leading-relaxed">
            Use <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">W</kbd>, <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">A</kbd>, <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">S</kbd>, <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">D</kbd> keys to move around the environment. Move your mouse to look around. Press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">E</kbd> to interact with objects and people in the environment.
          </p>
        </div>
      )
    },
    {
      videoPlaceholder: "/assets/advanced_controls_placeholder.jpg",
      content: (
        <div className="space-y-4">
          <p className="text-foreground text-sm leading-relaxed">
            Press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">ESC</kbd> to exit any interaction. Use <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">⌘</kbd>+<kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">K</kbd> to open the command menu. Press <kbd className="px-1 py-0.5 bg-muted rounded-md text-xs">M</kbd> to toggle the menu visibility.
          </p>
        </div>
      )
    },
    {
      videoPlaceholder: "/assets/interaction_zones_placeholder.jpg",
      content: (
        <div className="space-y-4">
          <p className="text-foreground text-sm leading-relaxed">
            When you approach an interactive element, a prompt will appear at the bottom of the screen. Press E to interact with it. Interactive elements include the patient room door, EHR terminal, patient bed, and nurse station.
          </p>
        </div>
      )
    },
    {
      videoPlaceholder: "/assets/medical_info_placeholder.jpg",
      content: (
        <div className="space-y-4">
          <p className="text-foreground text-sm leading-relaxed">
            You'll need to review patient information through the EHR system. Pay attention to lab results, vital signs, and medication lists to make informed decisions. Take notes on important findings using the notepad (⌘+N).
          </p>
        </div>
      )
    },
    {
      videoPlaceholder: "/assets/decision_making_placeholder.jpg",
      content: (
        <div className="space-y-4">
          <p className="text-foreground text-sm leading-relaxed">
            After gathering all necessary information, you'll need to make a clinical recommendation. Your decision will be evaluated based on the information available. Follow the guidance prompts to complete each task in sequence.
          </p>
        </div>
      )
    }
  ]

  // Scenario content
  const scenarioContent = (
    <div className="space-y-6 px-6">
      <p className="text-foreground text-sm leading-relaxed">
        You are an attending physician in the ICU. You're starting your morning rounds with two medical students. Your first patient is a 68-year-old male who was admitted yesterday with respiratory distress. You need to assess his current condition and make a treatment recommendation.
      </p>
      
      <p className="text-foreground text-sm leading-relaxed">
        <strong>Patient:</strong> Robert Johnson, 68 years old<br />
        <strong>Chief Complaint:</strong> Shortness of breath, fever, and productive cough for 3 days<br />
        <strong>Past Medical History:</strong> Hypertension, Type 2 Diabetes, COPD
      </p>
      
      <p className="text-foreground text-sm leading-relaxed">
        You will need to:
      </p>
      <ol className="list-decimal pl-5 space-y-2 text-foreground text-sm">
        <li>Enter the patient's room</li>
        <li>Review the patient's EHR</li>
        <li>Examine the patient</li>
        <li>Consult with the nurse</li>
        <li>Make a clinical recommendation</li>
      </ol>
      <p className="text-foreground text-sm leading-relaxed mt-2">
        You have 10 minutes to complete all tasks.
      </p>
    </div>
  )

  if (!open) return null;

  // Render welcome screen
  if (currentSection === 'welcome') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="bg-background shadow-md rounded-lg w-full max-w-md flex flex-col overflow-hidden">
          <div className="px-6 pt-6 pb-4 flex flex-col items-center">
            <div className="flex flex-col items-center gap-2 mb-6">
              <img src="/assets/rxr_wordmark.svg" alt="RxReality" className="h-8" />
              <div className="text-foreground text-sm">Virtual ICU Simulation</div>
            </div>
            
            <img src="/assets/rxr_icon.svg" alt="RxReality Icon" className="w-36 mb-6" />
          </div>
          
          <div className="h-px w-full bg-border"></div>
          
          <div className="px-6 py-4">
            <Button 
              onClick={handleContinue}
              variant="default"
              className="w-full py-2 flex justify-center items-center gap-2"
            >
              <span>Get Started</span>
              <Play className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Render tutorial carousel or scenario content
  const buttonText = currentSection === 'scenario' ? 'Start Simulation' : 'Next'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-background shadow-md rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex flex-col">
          <div className="overflow-auto flex-1">
            {currentSection === 'tutorial' ? (
              <div>
                <Carousel setApi={setApi} className="w-full">
                  <CarouselContent>
                    {tutorialSlides.map((slide, index) => (
                      <CarouselItem key={index}>
                        <div className="flex flex-col space-y-4">
                          {slide.videoPlaceholder && (
                            <div className="aspect-video bg-muted flex items-center justify-center w-full rounded-t-lg rounded-b-none">
                              <Info className="h-10 w-10 text-muted-foreground opacity-50" />
                              <span className="sr-only">Video placeholder</span>
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
            ) : (
              <div className="max-h-[60vh] overflow-y-auto">
                {scenarioContent}
              </div>
            )}
          </div>
          
          <div className="h-px w-full bg-border mt-4"></div>
          
          <div className="flex justify-between px-6 py-4">
            {currentSection === 'tutorial' && currentSlide > 0 ? (
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
              <div></div> // Empty div to maintain layout with justify-between
            )}
            
            <Button
              variant="default"
              size="sm"
              onClick={handleContinue}
              className="flex items-center gap-1"
            >
              <span>{buttonText}</span>
              {buttonText === 'Start Simulation' ? (
                <Play className="w-3 h-3 ml-1" />
              ) : (
                <ChevronRight className="w-3 h-3 ml-1" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 