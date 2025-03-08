import { useState } from 'react'
import { Keyboard as KeyboardIcon, MouseIcon, Info as InfoIcon, Clock as ClockIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs'
import { Button } from './ui/button'

export default function Guide({ onClose }) {
  const [activeTab, setActiveTab] = useState('controls')
  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Guide</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="controls" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="w-full">
            <TabsTrigger value="controls" className="flex-1">Controls</TabsTrigger>
            <TabsTrigger value="tutorial" className="flex-1">Tutorial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="controls" className="space-y-4 mt-4">
            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="font-medium">Movement</span>
              <div className="flex gap-1">
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">W</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">A</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">S</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">D</kbd>
              </div>
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="font-medium">Look around</span>
              <MouseIcon className="w-6 h-6" />
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="font-medium">Interact</span>
              <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">E</kbd>
            </div>

            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="font-medium">Exit interaction</span>
              <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">ESC</kbd>
            </div>
            
            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="font-medium">Open Menu</span>
              <div className="flex gap-1">
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">⌘</kbd>
                <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">K</kbd>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 border-b border-white/10">
              <span className="font-medium">Toggle Menu</span>
              <kbd className="bg-[#1A1A1A] px-3 py-1.5 rounded text-white">M</kbd>
            </div>
          </TabsContent>
          
          <TabsContent value="tutorial" className="space-y-6 mt-4">
            <div>
              <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
                <ClockIcon className="w-5 h-5 text-yellow-400" />
                Time Limit
              </h4>
              <p className="text-white/80 leading-relaxed">
                You have 10 minutes to complete this scenario. The timer will start when you begin the simulation and will be displayed at the top of the screen.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2 flex items-center gap-2">
                <InfoIcon className="w-5 h-5 text-blue-400" />
                Navigation
              </h4>
              <p className="text-white/80 leading-relaxed">
                You'll start in the corridor. Use WASD to move and your mouse to look around. Press E to interact with objects and transition between areas.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Interaction Zones</h4>
              <p className="text-white/80 leading-relaxed">
                When you approach an interactive element, a prompt will appear at the bottom of the screen. Press E to interact with it.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Medical Information</h4>
              <p className="text-white/80 leading-relaxed">
                You'll need to review patient information through the EHR system. Pay attention to lab results, vital signs, and medication lists to make informed decisions.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-medium mb-2">Decision Making</h4>
              <p className="text-white/80 leading-relaxed">
                After gathering all necessary information, you'll need to make a clinical recommendation. Your decision will be evaluated based on the information available.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 