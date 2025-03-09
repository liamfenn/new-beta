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