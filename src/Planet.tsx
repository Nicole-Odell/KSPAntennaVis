import type { PlanetConfig } from './types'

interface PlanetProps extends PlanetConfig {
  color: string
}

export function Planet({ name, planetRadius, orbitRadius, color }: PlanetProps) {
  return (
    // Root sits at the orbit center in world space (positioned by the parent).
    // All children are in coordinates relative to that center point.
    <div style={{ position: 'absolute', left: 0, top: 0 }}>

      {/* Orbit ring: a circle of radius=orbitRadius centered on (0,0).
          Offset by -orbitRadius so its center aligns with the component root. */}
      <div style={{
        position: 'absolute',
        left: -orbitRadius, top: -orbitRadius,
        width: orbitRadius * 2, height: orbitRadius * 2,
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        pointerEvents: 'none',
      }} />

      {/* Planet sphere: centered at (orbitRadius, 0) — directly right of the origin. */}
      <div style={{
        position: 'absolute',
        left: orbitRadius - planetRadius,
        top: -planetRadius,
        width: planetRadius * 2,
        height: planetRadius * 2,
        background: color,
        borderRadius: '50%',
      }} />

      {/* Label: world-space anchor is just right of the sphere edge.
          Counter-scaled so it stays the same pixel size regardless of zoom. */}
      <div style={{ position: 'absolute', left: orbitRadius + planetRadius + 8, top: 0 }}>
        <div style={{ transform: 'scale(var(--inv-scale))', transformOrigin: '0 0' }}>
          <span style={{ fontSize: 13, color: 'white', whiteSpace: 'nowrap',
                         textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}>
            {name}
          </span>
        </div>
      </div>

    </div>
  )
}
