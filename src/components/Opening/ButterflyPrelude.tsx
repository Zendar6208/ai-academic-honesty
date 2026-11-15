import React, { useState, useEffect, useRef } from 'react';
import '../../styles/butterfly.css';

interface ButterflyPreludeProps {
  onAwaken: (touchCoords: { x: number; y: number }) => void;
  onRevealStart?: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

interface Point2D {
  x: number;
  y: number;
}

interface BezierCurve {
  p0: Point2D;
  p1: Point2D;
  p2: Point2D;
  p3: Point2D;
  duration: number; // seconds
}

export const ButterflyPrelude: React.FC<ButterflyPreludeProps> = ({
  onAwaken,
  onRevealStart,
}) => {
  // Current live butterfly position
  const currentPosRef = useRef<Point2D>({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.45 : 450,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.45 : 350,
  });

  // Current heading angle (degrees, 0 = facing up)
  const headingRef = useRef<number>(0);
  const rollRef = useRef<number>(0);
  const pitchRef = useRef<number>(0);

  // Flight trajectory state
  const currentCurveRef = useRef<BezierCurve | null>(null);
  const curveStartTimeRef = useRef<number>(0);
  const isHoveringRef = useRef<boolean>(false);
  const hoverStartTimeRef = useRef<number>(0);
  const hoverDurationRef = useRef<number>(0);
  const hoverBasePosRef = useRef<Point2D>({ x: 0, y: 0 });
  const departureTangentRef = useRef<Point2D>({ x: 0, y: -1 });

  // Awakening / Reveal State
  const [hasAwakened, setHasAwakened] = useState<boolean>(false);
  const [touchPos, setTouchPos] = useState<Point2D | null>(null);
  const [revealRadius, setRevealRadius] = useState<number>(0);
  const [butterflyDissolved, setButterflyDissolved] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  // DOM node references
  const flightMeshRef = useRef<HTMLDivElement | null>(null);
  const wingLeftRef = useRef<HTMLDivElement | null>(null);
  const wingRightRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Helper to pick a safe target inside viewport bounds
  const getSafeMarginPoint = (): Point2D => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;

    const padX = Math.max(70, w * 0.12);
    const padY = Math.max(70, h * 0.12);

    const minX = padX;
    const maxX = w - padX;
    const minY = padY;
    const maxY = h - padY;

    return {
      x: minX + Math.random() * (maxX - minX),
      y: minY + Math.random() * (maxY - minY),
    };
  };

  // Generate a new smooth Cubic Bezier flight segment across the screen
  const generateNewFlightSegment = (startPos: Point2D, departureTangent: Point2D): BezierCurve => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;

    // Pick a destination that is a meaningful distance away across screen
    let target = getSafeMarginPoint();
    let dx = target.x - startPos.x;
    let dy = target.y - startPos.y;
    let dist = Math.hypot(dx, dy);

    // If target is too close, pick another quadrant to ensure wide screen traversal
    let attempts = 0;
    const minDist = Math.min(w, h) * 0.42;
    while (dist < minDist && attempts < 6) {
      target = getSafeMarginPoint();
      dx = target.x - startPos.x;
      dy = target.y - startPos.y;
      dist = Math.hypot(dx, dy);
      attempts++;
    }

    // Direct distance
    dist = Math.max(180, dist);

    // Tangent normalization
    const depLen = Math.hypot(departureTangent.x, departureTangent.y) || 1;
    const t0 = { x: departureTangent.x / depLen, y: departureTangent.y / depLen };

    // Control point P1 extends smoothly in the departure direction
    const handleDist1 = dist * (0.32 + Math.random() * 0.18);
    const p1: Point2D = {
      x: Math.max(50, Math.min(w - 50, startPos.x + t0.x * handleDist1)),
      y: Math.max(50, Math.min(h - 50, startPos.y + t0.y * handleDist1)),
    };

    // Arrival tangent: angle towards target plus gentle curved deflection
    const toTargetAngle = Math.atan2(dy, dx);
    const deflection = (Math.random() - 0.5) * 1.1; // +/- 30 degrees
    const arrivalAngle = toTargetAngle + deflection;
    const t3 = { x: Math.cos(arrivalAngle), y: Math.sin(arrivalAngle) };

    // Control point P2 sweeps into the arrival direction
    const handleDist2 = dist * (0.32 + Math.random() * 0.18);
    const p2: Point2D = {
      x: Math.max(50, Math.min(w - 50, target.x - t3.x * handleDist2)),
      y: Math.max(50, Math.min(h - 50, target.y - t3.y * handleDist2)),
    };

    // Calculate duration based on distance (speeds around 160 - 200 px/sec)
    const duration = Math.max(2.8, Math.min(5.2, dist / 175));

    return {
      p0: startPos,
      p1,
      p2,
      p3: target,
      duration,
    };
  };

  // Evaluate cubic Bezier position: B(s)
  const evalBezier = (curve: BezierCurve, s: number): Point2D => {
    const u = 1 - s;
    const u2 = u * u;
    const u3 = u2 * u;
    const s2 = s * s;
    const s3 = s2 * s;

    return {
      x: u3 * curve.p0.x + 3 * u2 * s * curve.p1.x + 3 * u * s2 * curve.p2.x + s3 * curve.p3.x,
      y: u3 * curve.p0.y + 3 * u2 * s * curve.p1.y + 3 * u * s2 * curve.p2.y + s3 * curve.p3.y,
    };
  };

  // Evaluate cubic Bezier velocity / tangent: B'(s)
  const evalBezierDerivative = (curve: BezierCurve, s: number): Point2D => {
    const u = 1 - s;
    const u2 = u * u;
    const s2 = s * s;

    return {
      x: 3 * u2 * (curve.p1.x - curve.p0.x) + 6 * u * s * (curve.p2.x - curve.p1.x) + 3 * s2 * (curve.p3.x - curve.p2.x),
      y: 3 * u2 * (curve.p1.y - curve.p0.y) + 6 * u * s * (curve.p2.y - curve.p1.y) + 3 * s2 * (curve.p3.y - curve.p2.y),
    };
  };

  // Smooth biological easing: gentle acceleration, steady cruise, soft arrival
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Initialize first flight curve on mount
  useEffect(() => {
    const startX = window.innerWidth * 0.45;
    const startY = window.innerHeight * 0.48;
    currentPosRef.current = { x: startX, y: startY };

    // Initial heading roughly top-right
    departureTangentRef.current = { x: 0.6, y: -0.8 };
    currentCurveRef.current = generateNewFlightSegment(
      { x: startX, y: startY },
      departureTangentRef.current
    );
    curveStartTimeRef.current = performance.now();
  }, []);

  // Main 60fps flight and wing animation loop
  useEffect(() => {
    if (hasAwakened) return;

    let animId: number;
    let flapPhase = 0;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      let posX = currentPosRef.current.x;
      let posY = currentPosRef.current.y;
      let flapSpeed = 11.5; // rad/s
      let wingAngle = 0;
      let camber = 0;

      if (isHoveringRef.current) {
        // -------------------------------------------------------------
        // HOVER STATE: Gentle pause, drifting in harmonic Lissajous micro-arcs
        // -------------------------------------------------------------
        const hoverElapsed = (now - hoverStartTimeRef.current) / 1000;
        const base = hoverBasePosRef.current;

        // Subtle biological float
        posX = base.x + Math.sin(hoverElapsed * 2.2) * 9;
        posY = base.y + Math.cos(hoverElapsed * 1.8) * 7;

        // Slower, gentle wing twitches while hovering on thermals
        flapSpeed = 6.0;
        flapPhase += flapSpeed * dt;
        const flap = Math.sin(flapPhase);
        // Wings held mostly open in dihedral position (16° - 38°)
        wingAngle = 18 + (flap > 0 ? flap * 24 : flap * 8);
        camber = -Math.cos(flapPhase) * 2;

        pitchRef.current = Math.sin(hoverElapsed * 2.5) * 3;
        rollRef.current *= 0.94; // level out banking

        // Check if hover duration finished
        if (hoverElapsed >= hoverDurationRef.current) {
          isHoveringRef.current = false;
          // Start next transit leg
          currentCurveRef.current = generateNewFlightSegment(
            { x: posX, y: posY },
            departureTangentRef.current
          );
          curveStartTimeRef.current = now;
        }
      } else if (currentCurveRef.current) {
        // -------------------------------------------------------------
        // ACTIVE FLIGHT STATE: Traversing cubic Bezier trajectory
        // -------------------------------------------------------------
        const curve = currentCurveRef.current;
        const elapsed = (now - curveStartTimeRef.current) / 1000;
        const progress = Math.min(elapsed / curve.duration, 1.0);
        const easedProgress = easeInOutCubic(progress);

        // Compute position on Bezier curve
        const bPos = evalBezier(curve, easedProgress);
        // Compute velocity vector on Bezier curve
        const bDeriv = evalBezierDerivative(curve, easedProgress);

        // Flapping kinematics
        flapSpeed = 12.0;
        flapPhase += flapSpeed * dt;
        const flap = Math.sin(flapPhase);

        // Biological flight oscillation (the characteristic butterfly "bob")
        const bob = Math.sin(flapPhase) * 4.5;
        // Lateral micro-flutter perpendicular to velocity
        const vLen = Math.hypot(bDeriv.x, bDeriv.y) || 1;
        const perpX = -bDeriv.y / vLen;
        const perpY = bDeriv.x / vLen;
        const flutter = Math.sin(flapPhase * 1.5) * 3.0;

        posX = bPos.x + perpX * flutter;
        posY = bPos.y + perpY * flutter + bob;

        // Wing angles: full stroke (-12° downstroke to 66° upstroke)
        wingAngle = flap > 0 ? flap * 66 : flap * 14;
        camber = -Math.cos(flapPhase) * 6;

        // Calculate smooth heading angle tangent to flight trajectory
        const targetHeading = Math.atan2(bDeriv.y, bDeriv.x) * (180 / Math.PI) + 90;

        // Smooth shortest-angle rotation
        let angleDiff = (targetHeading - headingRef.current) % 360;
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        headingRef.current += angleDiff * 0.10;

        // Dynamic 3D banking (roll inward on turns)
        const targetRoll = Math.max(-24, Math.min(24, angleDiff * 1.6));
        rollRef.current += (targetRoll - rollRef.current) * 0.10;

        // Body pitch in sync with wing thrust recoil
        pitchRef.current = -flap * 4;

        // When curve finishes: either hover briefly or start next flight leg
        if (progress >= 1.0) {
          departureTangentRef.current = { x: bDeriv.x / vLen, y: bDeriv.y / vLen };

          // 40% chance to hover briefly for 1.2 - 2.2 seconds
          if (Math.random() < 0.42) {
            isHoveringRef.current = true;
            hoverStartTimeRef.current = now;
            hoverDurationRef.current = 1.2 + Math.random() * 1.2; // seconds
            hoverBasePosRef.current = { x: posX, y: posY };
          } else {
            // Immediate next flight leg
            currentCurveRef.current = generateNewFlightSegment(
              { x: posX, y: posY },
              departureTangentRef.current
            );
            curveStartTimeRef.current = now;
          }
        }
      }

      currentPosRef.current = { x: posX, y: posY };

      // Apply transforms directly to hardware layers
      if (flightMeshRef.current) {
        flightMeshRef.current.style.transform = `
          translate3d(${posX}px, ${posY}px, 0)
          rotateZ(${headingRef.current}deg)
          rotateX(${pitchRef.current}deg)
          rotateY(${rollRef.current}deg)
        `;
      }

      if (triggerRef.current) {
        triggerRef.current.style.transform = `translate3d(${posX}px, ${posY}px, 0)`;
      }

      // Independent left and right wing transforms
      if (wingLeftRef.current) {
        wingLeftRef.current.style.transform = `rotateY(${wingAngle}deg) rotateX(${camber}deg)`;
        const brightness = 0.96 + Math.sin(flapPhase) * 0.12;
        wingLeftRef.current.style.filter = `brightness(${brightness}) contrast(1.04)`;
      }

      if (wingRightRef.current) {
        wingRightRef.current.style.transform = `rotateY(${-wingAngle}deg) rotateX(${camber}deg)`;
        const brightness = 0.96 + Math.sin(flapPhase) * 0.12;
        wingRightRef.current.style.filter = `brightness(${brightness}) contrast(1.04)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [hasAwakened]);

  // Handle tap / click trigger
  const handleTrigger = (clientX?: number, clientY?: number) => {
    if (hasAwakened) return;
    setHasAwakened(true);

    if (onRevealStart) {
      onRevealStart();
    }

    const touchX = clientX !== undefined ? clientX : currentPosRef.current.x;
    const touchY = clientY !== undefined ? clientY : currentPosRef.current.y;
    setTouchPos({ x: touchX, y: touchY });

    // Green digital dispersal particles
    const count = 32;
    const newParticles: Particle[] = [];
    const colors = ['#00FF88', '#10B981', '#34d399', '#38bdf8', '#059669'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.0 + Math.random() * 5.0;
      newParticles.push({
        id: i,
        x: touchX,
        y: touchY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3.5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setParticles(newParticles);

    // Rapid wing flutter on touch, then dissolve
    if (wingLeftRef.current && wingRightRef.current) {
      wingLeftRef.current.style.transform = `rotateY(75deg)`;
      wingRightRef.current.style.transform = `rotateY(-75deg)`;
    }

    setTimeout(() => {
      setButterflyDissolved(true);
    }, 280);

    // Expand radial reveal wave
    const maxRadius = Math.hypot(
      Math.max(touchX, window.innerWidth - touchX),
      Math.max(touchY, window.innerHeight - touchY)
    ) * 1.15;

    const startTime = performance.now();
    const duration = 1350; // ms

    const animateReveal = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setRevealRadius(eased * maxRadius);

      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 1.1,
            y: p.y + p.vy * 1.1,
            alpha: Math.max(0, p.alpha - 0.024),
          }))
          .filter((p) => p.alpha > 0)
      );

      if (progress < 1) {
        requestAnimationFrame(animateReveal);
      } else {
        setTimeout(() => {
          onAwaken({ x: touchX, y: touchY });
        }, 100);
      }
    };

    requestAnimationFrame(animateReveal);
  };

  return (
    <div
      className="butterfly-prelude-container"
      style={{
        background: touchPos
          ? `radial-gradient(circle at ${touchPos.x}px ${touchPos.y}px, transparent ${revealRadius}px, #000000 ${revealRadius + 28}px)`
          : '#000000',
        pointerEvents: hasAwakened ? 'none' : 'auto',
      }}
      onClick={(e) => {
        const dx = e.clientX - currentPosRef.current.x;
        const dy = e.clientY - currentPosRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) {
          handleTrigger(e.clientX, e.clientY);
        }
      }}
    >
      {/* 1. Generous Accessible Tap Target */}
      {!hasAwakened && (
        <button
          ref={triggerRef}
          className="butterfly-trigger"
          aria-label="Awaken the archive: touch or click the Monarch butterfly"
          onClick={(e) => {
            e.stopPropagation();
            handleTrigger(e.clientX, e.clientY);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
            if (e.touches && e.touches[0]) {
              handleTrigger(e.touches[0].clientX, e.touches[0].clientY);
            } else {
              handleTrigger();
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTrigger();
            }
          }}
        />
      )}

      {/* 2. Photorealistic Monarch Butterfly in 3D Flight */}
      {!butterflyDissolved && (
        <div
          ref={flightMeshRef}
          className="butterfly-flight-mesh"
          style={{
            opacity: hasAwakened ? 0.2 : 1,
            transition: hasAwakened ? 'opacity 0.25s ease-out' : 'none',
          }}
        >
          {/* Left Wing (Hinged at right boundary / thorax) */}
          <div ref={wingLeftRef} className="monarch-wing-left-wrap">
            <img
              src="/assets/monarch_wing_left.png"
              alt=""
              className="monarch-wing-img-left"
              draggable={false}
            />
          </div>

          {/* Right Wing (Hinged at left boundary / thorax) */}
          <div ref={wingRightRef} className="monarch-wing-right-wrap">
            <img
              src="/assets/monarch_wing_right.png"
              alt=""
              className="monarch-wing-img-right"
              draggable={false}
            />
          </div>

          {/* Central Thorax, Abdomen, Head & Antennae Layer */}
          <div className="monarch-body-wrap">
            <img
              src="/assets/monarch_body.png"
              alt=""
              className="monarch-body-img"
              draggable={false}
            />
          </div>
        </div>
      )}

      {/* 3. Awakening Shockwave Ripples */}
      {touchPos && (
        <>
          <div
            className="awakening-shockwave"
            style={{
              left: touchPos.x,
              top: touchPos.y,
            }}
          />
          <div
            className="awakening-shockwave-secondary"
            style={{
              left: touchPos.x,
              top: touchPos.y,
            }}
          />
        </>
      )}

      {/* 4. Green Digital Dispersal Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="dispersal-particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            opacity: p.alpha,
          }}
        />
      ))}
    </div>
  );
};

export default ButterflyPrelude;
