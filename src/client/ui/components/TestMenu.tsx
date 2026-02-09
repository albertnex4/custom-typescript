"use client"

import { useState, useRef, useEffect } from "react"

// -- DATA --
const bodyParts = [
  { id: "1", name: "Body Kit" },
  { id: "2", name: "Hood" },
  { id: "3", name: "Front Bumper" },
  { id: "4", name: "Rear Bumper" },
  { id: "5", name: "Body", locked: true },
  { id: "6", name: "Doors", locked: true },
  { id: "7", name: "Spoiler" },
  { id: "8", name: "Side Skirts" },
  { id: "9", name: "Fenders" },
  { id: "10", name: "Roof" },
  { id: "11", name: "Trunk" },
  { id: "12", name: "Mirrors" },
  { id: "13", name: "Grille" },
  { id: "14", name: "Diffuser" },
  { id: "15", name: "Canards" },
  { id: "16", name: "Widebody", locked: true },
  { id: "17", name: "Roll Cage" },
  { id: "18", name: "Splitter" },
  { id: "19", name: "Air Vents" },
  { id: "20", name: "Light Covers" },
  { id: "21", name: "Custom" },
]

const brands = [
  { id: "1", name: "Slide", price: 10600 },
  { id: "2", name: "Missile", price: 11500 },
  { id: "3", name: "R&T", price: 13400 },
  { id: "4", name: "CBW", price: 15400 },
  { id: "5", name: "Street", price: 8900 },
  { id: "6", name: "Pro", price: 18200 },
  { id: "7", name: "Elite", price: 22500 },
  { id: "8", name: "Custom", price: 25000 },
  { id: "11", name: "Slide", price: 10600 },
  { id: "12", name: "Missile", price: 11500 },
  { id: "13", name: "R&T", price: 13400 },
  { id: "14", name: "CBW", price: 15400 },
  { id: "15", name: "Street", price: 8900 },
  { id: "16", name: "Pro", price: 18200 },
  { id: "17", name: "Elite", price: 22500 },
  { id: "18", name: "Custom", price: 25000 },
]

// -- LOCK SVG ICON --
function LockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="rgba(255,255,255,0.7)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

// -- MAIN COMPONENT --
export default function GameUI() {
  const [selectedPart, setSelectedPart] = useState("1")
  const [selectedBrand, setSelectedBrand] = useState("5")
  const horizontalScrollRef = useRef<HTMLDivElement>(null)

  //Ejempolo vehicle.setMod(modType, modIndex)  modType = Motor modIndex = (Nivel 4) - Aumenta la aceleración base
  const modType = bodyParts.findIndex((p) => p.id === selectedPart) + 1
  const modIndex = brands.findIndex((b) => b.id === selectedBrand) + 1

  // Wheel scroll for horizontal panel
  useEffect(() => {
    const el = horizontalScrollRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener("wheel", onWheel, { passive: false })
    return () => el.removeEventListener("wheel", onWheel)
  }, [])

  return (
    <>
      <style>{`


        /* === LAYOUT === */
        .game-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          pointer-events: none;
          max-height: 93vh;
        }

        /* === LEFT PANEL === */
        .left-panel {
          padding: 10px;
          flex-shrink: 0;
          pointer-events: auto;
        }

        .left-panel-inner {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          border-radius: 4px;
          width: 36vh;
        }

        .panel-header {
          padding: 10px 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }

        .panel-header .title {
          font-weight: 800;
          font-style: italic;
          font-size: 16px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .panel-header .subtitle {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
        }

        .panel-footer {
          padding: 6px 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: right;
          flex-shrink: 0;
        }

        .panel-footer span {
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          font-weight: 500;
        }

        /* === VERTICAL SCROLL === */
        .vertical-scroll {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .vertical-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .vertical-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        .vertical-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 2px;
        }
        .vertical-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.45);
        }

        /* === PART ITEM === */
        .part-item {
          position: relative;
          width: 100%;
          aspect-ratio: 4 / 3;
          border-radius: 3px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          background: none;
          flex-shrink: 0;
          transition: border-color 0.15s ease;
        }

        .part-item:hover {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .part-item.selected {
          border-color: white;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4);
        }

        .part-item.locked {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .part-item-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #3f3f46, #18181b);
        }

        .part-item-lock {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.4);
        }

        .part-item-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          padding: 4px 8px;
        }

        .part-item-label span {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: white;
        }

        /* === RIGHT SIDE === */
        .right-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-width: 0;
        }

        .right-spacer {
          flex: 1;
        }

        /* === BOTTOM PANEL === */
        .bottom-panel {
          padding: 10px;
          pointer-events: auto;
          flex-shrink: 0;
        }

        .bottom-panel-inner {
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(8px);
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 20px 8px 20px;
          height: 26vh;
        }

        .numbers {
          font-size: 3vh;
          font-weight: 750;
        }

        .bottom-counter {
          display: inline-block;
          padding:10px
        }

        /* === HORIZONTAL SCROLL === */
        .horizontal-scroll {
          flex: 1;
          overflow-x: auto;
          overflow-y: hidden;
          min-width: 0;
        }

        .horizontal-scroll::-webkit-scrollbar {
          height: 4px;
        }
        .horizontal-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
        }
        .horizontal-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.25);
          border-radius: 2px;
        }
        .horizontal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.45);
        }

        .horizontal-items {
          display: flex;
          gap: 8px;
          padding: 4px 0;
        }

        /* === BRAND ITEM === */
        .brand-item {
          position: relative;
          flex-shrink: 0;
          width: 33vh;
          height: 22vh;
          border-radius: 3px;
          overflow: hidden;
          border: 2px solid transparent;
          cursor: pointer;
          background: none;
          transition: border-color 0.15s ease;
        }

        .brand-item:hover {
          border-color: rgba(255, 255, 255, 0.3);
        }

        .brand-item.selected {
          border-color: white;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.4);
        }

        .brand-item-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #27272a, #09090b);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-item-bg span {
          font-weight: 800;
          font-size: 14px;
          font-style: italic;
          color: white;
        }

        .brand-item-price {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          padding: 2px 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
        }

        .brand-item-price .amount {
          color: #4ade80;
          font-weight: 700;
          font-size: 12px;
        }

        .brand-item-price .currency {
          color: #22c55e;
          font-size: 10px;
          font-weight: 600;
          padding: 1px 4px;
          background: rgba(34, 197, 94, 0.2);
          border-radius: 3px;
        }
      `}</style>

      <div className="game-overlay">
        {/* Left Panel */}
        <div className="left-panel">
          <div className="left-panel-inner">
            <div className="panel-header">
              <span className="title">STYLING</span>
              <span className="subtitle">/ BODY</span>
            </div>

            <div className="vertical-scroll">
              {bodyParts.map((part) => (
                <button
                  key={part.id}
                  className={`part-item${selectedPart === part.id ? " selected" : ""}${part.locked ? " locked" : ""}`}
                  onClick={() => {
                    if (!part.locked) setSelectedPart(part.id)
                  }}
                >
                  <div className="part-item-bg" />
                  {part.locked && (
                    <div className="part-item-lock">
                      <LockIcon />
                    </div>
                  )}
                  <div className="part-item-label">
                    <span>{part.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="panel-footer">
              <label className="numbers">{modType}/{bodyParts.length}</label>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-side">
          <div className="right-spacer" />

          {/* Bottom Panel */}
          <div className="bottom-panel">
            <div className="bottom-counter">
                <label className="numbers">{modIndex}/{brands.length}</label>
            </div>
            <div className="bottom-panel-inner">  
              <div className="horizontal-scroll" ref={horizontalScrollRef}>
                <div className="horizontal-items">
                  {brands.map((brand) => (
                    <button
                      key={brand.id}
                      className={`brand-item${selectedBrand === brand.id ? " selected" : ""}`}
                      onClick={() => setSelectedBrand(brand.id)}
                    >
                      <div className="brand-item-bg">
                        <span>{brand.name}</span>
                      </div>
                      <div className="brand-item-price">
                        <span className="amount">{brand.price.toLocaleString()}</span>
                        <span className="currency">CR</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
