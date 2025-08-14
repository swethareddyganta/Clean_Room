export function ArrantHeader() {
  return (
    <div className="mb-8 text-center relative">
      {/* Arrant Dynamics Logo - Top Left */}
      <div className="absolute top-0 left-0">
        <img 
          src="/Arrant Logo -1.jpg" 
          alt="Arrant Dynamics Logo" 
          className="h-16 w-auto"
        />
      </div>
      
      <h1 className="text-lg font-semibold text-gray-800">STERI Clean Air - HVAC Matrix</h1>
      <p className="text-sm text-gray-500">
        By Arrant Dynamics, a division of Arrant Technologies India, Pvt Ltd
      </p>
    </div>
  )
}
