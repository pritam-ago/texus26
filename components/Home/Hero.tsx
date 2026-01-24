"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const quickerPoint = 0.2;

const sat = (x: number) => {
  return Math.min(Math.max(x, 0), 1);
};

const remap01 = (a: number, b: number, t: number) => {
  return sat((t - a) / (b - a));
};

const remap = (a: number, b: number, c: number, d: number, t: number) => {
  return sat(remap01(a, b, t) * (d - c) + c);
};

class TextSketch {
  static defaultEase = "expo.inOut";
  static edgeSize = 0.07;

  _rendererBounds: { width: number; height: number } = { width: 1, height: 1 };
  _translateOffset = { x: 0, y: 0 };
  _textValue: string;
  _ctx: CanvasRenderingContext2D | null;
  _pixelRatio = 1;
  _textMeasures = { width: 0, height: 0, fontSize: 0 };
  _transitionTl: gsap.core.Timeline | null = null;
  _scrollRatio = 0;
  _scrollRatioQuicker = 0;
  _scrollRatioRest = 0;

  constructor(text: string, ctx: CanvasRenderingContext2D | null) {
    this._ctx = ctx;
    this._textValue = text;
  }

  _drawBackground() {
    if (!this._ctx) return;

    this._ctx.beginPath();

    const segments = 20;

    const widthSegments = Math.ceil(this._rendererBounds.width / segments);
    this._ctx.moveTo(this._rendererBounds.width, this._rendererBounds.height);
    this._ctx.lineTo(0, this._rendererBounds.height);

    const t = (1 - this._scrollRatioRest) * this._rendererBounds.height;
    const amplitude = this._rendererBounds.width * 0.1 * Math.sin(this._scrollRatioRest * Math.PI);

    this._ctx.lineTo(0, t);

    for (let index = 0; index <= widthSegments; index++) {
      const n = segments * index;
      const r = t - Math.sin((n / this._rendererBounds.width) * Math.PI) * amplitude;

      this._ctx.lineTo(n, r);
    }

    this._ctx.fillStyle = "rgb(244,244,244)";
    this._ctx.fill();
  }

  _clipRect() {
    if (!this._ctx) return;
    const edgeRounded = Math.round(this._rendererBounds.width * TextSketch.edgeSize);
    const leftX = edgeRounded;

    this._ctx.beginPath();
    this._ctx.rect(leftX, 0, this._rendererBounds.width - 2 * leftX, this._rendererBounds.height);
    this._ctx.clip();
  }

  _scaleContext() {
    if (!this._ctx) return;

    const desiredScale = 1 - 0.51 * this._scrollRatioRest;
    const scale = desiredScale * this._pixelRatio;
    const sFactor = (scale - 1 * this._pixelRatio) * 0.5;
    const tX = -this._rendererBounds.width * sFactor;
    const tY = -this._rendererBounds.height * sFactor;
    this._ctx.setTransform(scale, 0, 0, scale, tX, tY);
  }

  _drawText() {
    if (!this._ctx) return;
    this._ctx.fillStyle = "#000000";
    this._ctx.fillText(
      this._textValue,
      this._textMeasures.width * this._scrollRatioRest * 0.53 * 0.5 +
        this._rendererBounds.width * TextSketch.edgeSize +
        this._translateOffset.x -
        this._textMeasures.width * this._scrollRatioQuicker * 0.52 -
        this._textMeasures.width * 0.01,
      this._rendererBounds.height / 2 +
        this._textMeasures.height / 2 +
        this._translateOffset.y -
        this._textMeasures.width * -this._scrollRatioRest * 0.05 * 0
    );
  }

  update(updateInfo: { delta: number; slowDownFactor: number; time: number }) {
    if (!this._ctx) return;

    this._ctx.font = `bold ${this._textMeasures.fontSize}px teko`;

    if (this._ctx) this._ctx.globalCompositeOperation = "source-over";
    this._ctx.fillStyle = "rgba(0,0,0,1)";
    this._ctx.fillRect(0, 0, this._rendererBounds.width, this._rendererBounds.height);

    if (this._ctx) this._ctx.globalCompositeOperation = "source-over";
    this._drawBackground();
    if (this._ctx) this._ctx.globalCompositeOperation = "xor";

    this._ctx.save();
    this._clipRect();
    this._scaleContext();

    this._drawText();
    this._ctx.restore();
  }

  _animateOffsetY(destination: number, duration: number) {
    return gsap.to(this._translateOffset, {
      y: destination,
      duration,
      ease: TextSketch.defaultEase,
    });
  }

  _animateOffsetX(destination: number, duration: number) {
    return gsap.to(this._translateOffset, {
      x: destination,
      duration,
      ease: TextSketch.defaultEase,
    });
  }

  _updateFontSize() {
    if (!this._ctx) return;
    this._ctx.font = `bold ${this._textMeasures.fontSize}px teko`;

    const metrics = this._ctx.measureText(this._textValue);
    const actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    this._textMeasures.height = actualHeight;
    this._textMeasures.width = metrics.width;
  }

  setRendererBounds(bounds: { width: number; height: number }) {
    this._rendererBounds = bounds;
    if (!this._ctx) return;

    this._textMeasures.fontSize = this._rendererBounds.width * 0.417;
    this._updateFontSize();
  }

  setPixelRatio(value: number) {
    this._pixelRatio = value;
  }

  setScrollRatio(value: number) {
    this._scrollRatio = value;
  }

  setScrollRatioQuicker(value: number) {
    this._scrollRatioQuicker = value;
  }

  setScrollRatioRest(value: number) {
    this._scrollRatioRest = value;
  }

  animateIn() {
    this._transitionTl = gsap.timeline();
  }

  destroy() {
    this._transitionTl && this._transitionTl.kill();
  }
}

const Hero = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const captionWrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [shouldReveal, setShouldReveal] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const [scrollRatio, setScrollRatio] = useState(0);
  const [scrollRatioQuicker, setScrollRatioQuicker] = useState(0);
  const [scrollRatioRest, setScrollRatioRest] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !scrollContainerRef.current) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const containerHeight = captionWrapperRef.current?.getBoundingClientRect().height || 1000;
      const windowHeight = window.innerHeight;

      const scrollPadded = sat(scrollY / (containerHeight - windowHeight));
      const scrollPaddedQuicker = remap(0, quickerPoint, 0, 1, scrollPadded);
      const scrollPaddedRest = remap(quickerPoint * 2, quickerPoint * 3, 0, 1, scrollPadded);

      setScrollRatio(scrollPadded);
      setScrollRatioQuicker(scrollPaddedQuicker);
      setScrollRatioRest(scrollPaddedRest);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const textSketch = new TextSketch("TEXUS26", ctx);

    const resizeCanvas = () => {
      const container = captionWrapperRef.current;
      if (!container) return;

      const clientRect = container.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio, 2);

      canvas.width = clientRect.width * pixelRatio;
      canvas.height = clientRect.height * pixelRatio;
      canvas.style.width = clientRect.width + "px";
      canvas.style.height = clientRect.height + "px";
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      textSketch.setRendererBounds({ width: clientRect.width, height: clientRect.height });
      textSketch.setPixelRatio(pixelRatio);
    };

    const loadFonts = async () => {
      try {
        await document.fonts.ready;
        textSketch.animateIn();
        setShouldReveal(true);
      } catch {
        textSketch.animateIn();
        setShouldReveal(true);
      }
    };

    resizeCanvas();
    loadFonts();

    let rafId: number;

    const render = (time: number) => {
      const container = captionWrapperRef.current;
      if (!container) return;

      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      textSketch.setScrollRatio(scrollRatio);
      textSketch.setScrollRatioQuicker(scrollRatioQuicker);
      textSketch.setScrollRatioRest(scrollRatioRest);
      textSketch.update({ delta: 16, slowDownFactor: 1, time });
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    const handleResize = () => resizeCanvas();
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      textSketch.destroy();
    };
  }, [isClient, scrollRatio, scrollRatioQuicker, scrollRatioRest]);

  if (!isClient) {
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="text-center mt-32">
            <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch justify-center w-full max-w-5xl px-2">
              <div className="group relative w-full md:w-[320px] cursor-pointer block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-40 group-hover:opacity-80 transition duration-500" />
                <div className="relative flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 p-5 rounded-lg w-full h-full transform transition-transform hover:-translate-y-1 duration-300">
                  <span className="text-pink-400 font-bold tracking-[0.2em] text-xs sm:text-sm mb-2 uppercase">
                    Phase 1
                  </span>
                  <h3 className="text-2xl sm:text-3xl text-white mb-2 text-center tracking-wide">
                    GLOBAL SUMMIT
                  </h3>
                  <div className="w-12 h-0.5 bg-pink-500/50 mb-3" />
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="text-lg font-medium">FEB 14 & 15</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/20 to-transparent self-stretch my-2" />

              <div className="group relative w-full md:w-[320px] cursor-pointer block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-40 group-hover:opacity-80 transition duration-500" />
                <div className="relative flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 p-5 rounded-lg w-full h-full transform transition-transform hover:-translate-y-1 duration-300">
                  <span className="text-purple-400 font-bold tracking-[0.2em] text-xs sm:text-sm mb-2 uppercase">
                    Phase 2
                  </span>
                  <h3 className="text-2xl sm:text-3xl text-white mb-2 text-center tracking-wide">
                    TEXUS&apos;26
                  </h3>
                  <div className="w-12 h-0.5 bg-purple-500/50 mb-3" />
                  <div className="flex items-center gap-2 text-white/90">
                    <span className="text-lg font-medium">FEB 27 & 28</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollContainerRef} className="relative w-full h-screen overflow-hidden bg-black">
      <div
        ref={captionWrapperRef}
        className="absolute inset-0 w-full h-full"
        style={{ height: "400vh" }}
      >
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          <canvas ref={canvasRef} className="w-full h-full" />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: shouldReveal ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 flex flex-col justify-center items-center"
          >
            <div className="text-center mt-32">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex flex-col md:flex-row gap-6 md:gap-12 items-stretch justify-center w-full max-w-5xl px-2"
              >
                <a
                  href="/nilgiris"
                  className="group relative w-full md:w-[320px] cursor-pointer block"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-40 group-hover:opacity-80 transition duration-500" />
                  <div className="relative flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 p-5 rounded-lg w-full h-full transform transition-transform hover:-translate-y-1 duration-300">
                    <span className="text-pink-400 font-bold tracking-[0.2em] text-xs sm:text-sm mb-2 uppercase">
                      Phase 1
                    </span>
                    <h3 className="text-2xl sm:text-3xl text-white mb-2 text-center tracking-wide">
                      GLOBAL SUMMIT
                    </h3>
                    <div className="w-12 h-0.5 bg-pink-500/50 mb-3" />
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="text-lg font-medium">FEB 14 & 15</span>
                    </div>
                  </div>
                </a>

                <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-white/20 to-transparent self-stretch my-2" />

                <a
                  href="/events/#events"
                  className="group relative w-full md:w-[320px] cursor-pointer block"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-40 group-hover:opacity-80 transition duration-500" />
                  <div className="relative flex flex-col items-center justify-center bg-black/60 backdrop-blur-md border border-white/10 p-5 rounded-lg w-full h-full transform transition-transform hover:-translate-y-1 duration-300">
                    <span className="text-purple-400 font-bold tracking-[0.2em] text-xs sm:text-sm mb-2 uppercase">
                      Phase 2
                    </span>
                    <h3 className="text-2xl sm:text-3xl text-white mb-2 text-center tracking-wide">
                      TEXUS&apos;26
                    </h3>
                    <div className="w-12 h-0.5 bg-purple-500/50 mb-3" />
                    <div className="flex items-center gap-2 text-white/90">
                      <span className="text-lg font-medium">FEB 27 & 28</span>
                    </div>
                  </div>
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
