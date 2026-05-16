import { useRef, useEffect, useCallback, useState } from 'react'
import { Planet } from './Planet'
import type { PlanetConfig } from './types'

const ZOOM_FACTOR = 1.1
const MIN_SCALE = 0.05
const MAX_SCALE = 50

export default function App() {
  // Refs for state
  const viewportRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const scaleRef = useRef(1)
  const panOffsetRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const isDragging = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Callback to update the transform when properties are changed
  const applyTransform = useCallback(() => {
    const world = worldRef.current
    if (!world) return
    const { x, y } = panOffsetRef.current
    const s = scaleRef.current
    world.style.transform = `translate(${x}px, ${y}px) scale(${s})`
    world.style.setProperty('--inv-scale', String(1 / s))
  }, [])

  // Setup the transform change callback
  useEffect(() => { applyTransform() }, [applyTransform])

  // Initialize state
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) {
      return
    }

    // Set up scroll wheel handler for zoom
    const onWheel = (e: WheelEvent) => {
      // Prevent scrolling in the page
      e.preventDefault()

      // Get the mouse position in space to zoom based on
      const viewportRect = viewport.getBoundingClientRect()
      const mouseX = e.clientX - viewportRect.left
      const mouseY = e.clientY - viewportRect.top

      // Determine the new scale to use
      const newZoomFactor = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR
      const currentScale = scaleRef.current
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, currentScale * newZoomFactor))
      scaleRef.current = newScale

      // Update the pan offset so that the zoom moved towards the mouse
      const panOffset = panOffsetRef.current
      panOffsetRef.current = {
        x: mouseX - (mouseX - panOffset.x) * (newScale / currentScale),
        y: mouseY - (mouseY - panOffset.y) * (newScale / currentScale),
      }
      applyTransform()
    }
    viewport.addEventListener('wheel', onWheel, { passive: false })

    // Clean up listener on exit
    return () => viewport.removeEventListener('wheel', onWheel)
  }, [applyTransform])

  // Handle mouse click start
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }, [])

  // Handle mouse click end
  const onMouseUp = useCallback(() => { isDragging.current = false }, [])

  // Handle mouse movement
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    // Nothing to do if not currently dragging
    if (!isDragging.current) {
      return
    }

    // Get the mouse movement delta
    const mouseDx = e.clientX - lastMousePos.current.x
    const mouseDy = e.clientY - lastMousePos.current.y
    // Determine the new pan offset and update it
    const newPanOffset = panOffsetRef.current
    panOffsetRef.current = { x: newPanOffset.x + mouseDx, y: newPanOffset.y + mouseDy }

    // Update our tracking of the last mouse position
    lastMousePos.current = { x: e.clientX, y: e.clientY }

    // Apply the change to the transform
    applyTransform()

  }, [applyTransform])

  // Load planets from JSON
  const [planets, setPlanets] = useState<PlanetConfig[]>([])
  useEffect(() => {
    fetch('/planets.json')
      .then(r => r.json())
      .then(data => setPlanets(data.Planets))
  }, [])

  return (
    <div
      ref={viewportRef}
      style={{ width: '100vw', height: '100vh', overflow: 'hidden',
               background: '#0a0a14', cursor: 'grab' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div ref={worldRef} style={{ position: 'absolute', transformOrigin: '0 0' }}>
        {planets.map((p, i) => (
          <Planet
            key={p.name}
            {...p}
            color={`hsl(${(i * 137) % 360}, 60%, 55%)`}
          />
        ))}
      </div>
    </div>
  )
}
