import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CandleChart } from "@/pages/Landing/components/effects/CandleChart";
import { GlassSweep } from "@/pages/Landing/components/effects/GlassSweep";
import {
  HERO_CHART_POINTS,
  RECENT_TRADES,
  SAMPLE_TRADE,
} from "@/pages/Landing/data/mockData";
import { LoopingNumber, TiltCard } from "@/pages/Landing/motion/interactions";
import { FadeIn, LineDraw } from "@/pages/Landing/motion/motionUtils";

function MetricCell({ label, value, className, delay = 0 }) {
  return (
    <FadeIn
      delay={delay}
      y={8}
      className={cn("space-y-0.5 bg-[#151517] px-3 py-2.5", className)}
    >
      <p className="text-[10px] tracking-wide text-[#71717A] uppercase">
        {label}
      </p>
      <p className="text-sm font-medium tabular-nums text-[#F4F4F5]">{value}</p>
    </FadeIn>
  );
}

export function HeroDashboard() {
  const trade = SAMPLE_TRADE;
  const wrapRef = useRef(null);
  const inView = useInView(wrapRef, { amount: 0.35 });
  const reduced = useReducedMotion();
  const [incoming, setIncoming] = useState(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "end start"],
  });
  const split = useTransform(scrollYProgress, [0, 1], [8, 22]);
  const splitNeg = useTransform(scrollYProgress, [0, 1], [-8, -22]);

  useEffect(() => {
    if (reduced || !inView) return undefined;

    const extras = RECENT_TRADES.filter(
      (item) => item.instrument !== trade.instrument,
    );
    let index = 0;

    const tick = () => {
      setIncoming(extras[index % extras.length]);
      index += 1;
      window.setTimeout(() => setIncoming(null), 4200);
    };

    const start = window.setTimeout(tick, 3800);
    const loop = window.setInterval(tick, 13500);

    return () => {
      window.clearTimeout(start);
      window.clearInterval(loop);
    };
  }, [inView, reduced, trade.instrument]);

  return (
    <motion.div
      ref={wrapRef}
      className="relative mx-auto w-full max-w-lg [perspective:1200px]"
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 28 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: reduced ? 0.2 : 0.65,
        delay: reduced ? 0 : 0.72,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="pointer-events-none absolute -inset-6 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.1),transparent_70%)]" />

      <motion.div
        aria-hidden="true"
        className="absolute top-20 -left-38 z-20 hidden w-36 rounded-xl border border-[#27272A] bg-[#151517]/95 p-3 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.7)] backdrop-blur-sm lg:block"
        style={{ y: reduced ? 0 : split, rotateY: -8 }}
      >
        <p className="text-[10px] tracking-wide text-[#71717A] uppercase">
          Capital
        </p>
        <p className="mt-1 text-sm font-semibold text-[#F4F4F5]">
          <LoopingNumber
            from={12480}
            to={12532}
            prefix="$"
            active={inView}
            hold={12}
          />
        </p>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute -top-15 -right-8 z-20 hidden w-32 rounded-xl border border-[#27272A] bg-[#151517]/95 p-3 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.7)] backdrop-blur-sm lg:block"
        style={{ y: reduced ? 0 : splitNeg, rotateY: 8 }}
      >
        <p className="text-[10px] tracking-wide text-[#71717A] uppercase">
          Win rate
        </p>
        <p className="mt-1 text-sm font-semibold text-[#22C55E]">
          <LoopingNumber
            from={62}
            to={64}
            suffix="%"
            active={inView}
            hold={13}
          />
        </p>
      </motion.div>

      <TiltCard max={4} className="relative z-10 isolate w-full">
        <div className="relative overflow-hidden rounded-xl border border-[#27272A] bg-[#151517] shadow-[0_24px_80px_-24px_rgba(0,0,0,0.8)]">
          <GlassSweep className="z-20" />

          <div className="absolute inset-x-3 bottom-12 h-24 opacity-40">
            <CandleChart />
          </div>
          <div className="absolute inset-x-0 bottom-10 h-28 opacity-50">
            <LineDraw
              points={HERO_CHART_POINTS}
              stroke="var(--primary)"
              strokeWidth={1.5}
              delay={0.9}
            />
          </div>

          <div className="relative border-b border-[#27272A] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="landing-pulse-dot size-1.5 rounded-full bg-[#22C55E]"
                  aria-hidden="true"
                />
                <span className="text-sm font-semibold text-[#F4F4F5]">
                  {trade.instrument}
                </span>
                <Badge variant="profit" className="text-[10px]">
                  {trade.direction}
                </Badge>
              </div>
              <span className="text-xs text-[#71717A]">Sample trade</span>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-px bg-[#27272A] p-px sm:grid-cols-3">
            <MetricCell
              label="Entry"
              value={trade.entry.toFixed(2)}
              delay={0.9}
            />
            <MetricCell
              label="Stop Loss"
              value={trade.stopLoss.toFixed(2)}
              delay={0.98}
            />
            <MetricCell
              label="Target"
              value={trade.target.toFixed(2)}
              delay={1.04}
            />
            <MetricCell label="Risk" value="$50" delay={1.1} />
            <MetricCell
              label="Reward"
              value={`$${trade.reward}`}
              delay={1.16}
            />
            <MetricCell
              label="R:R"
              value={trade.rr}
              delay={1.22}
              className="text-primary"
            />
          </div>

          <div className="relative grid grid-cols-3 gap-px border-t border-[#27272A] bg-[#27272A] lg:hidden">
            <div className="bg-[#151517] px-3 py-2">
              <p className="text-[10px] text-[#71717A] uppercase">Capital</p>
              <p className="text-xs font-medium text-[#F4F4F5]">
                <LoopingNumber
                  from={12480}
                  to={12532}
                  prefix="$"
                  active={inView}
                  hold={12}
                />
              </p>
            </div>
            <div className="bg-[#151517] px-3 py-2">
              <p className="text-[10px] text-[#71717A] uppercase">Win rate</p>
              <p className="text-xs font-medium text-[#22C55E]">
                <LoopingNumber
                  from={62}
                  to={64}
                  suffix="%"
                  active={inView}
                  hold={13}
                />
              </p>
            </div>
            <div className="bg-[#151517] px-3 py-2">
              <p className="text-[10px] text-[#71717A] uppercase">Risk</p>
              <p className="text-xs font-medium text-[#F4F4F5]">$50</p>
            </div>
          </div>

          <div className="relative flex items-center justify-between border-t border-[#27272A] px-4 py-3">
            <p className="text-xs text-[#71717A]">Outcome</p>
            <p className="text-sm font-medium text-[#22C55E] tabular-nums">
              +$75.00
            </p>
          </div>
        </div>
      </TiltCard>

      <div className="relative z-20 mt-3 flex min-h-[4.25rem] justify-end">
        <AnimatePresence>
          {incoming ? (
            <motion.div
              key={`${incoming.instrument}-${incoming.pnl}`}
              initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-44 rounded-xl border border-[#27272A] bg-[#111113]/95 p-3 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
            >
              <p className="text-[10px] tracking-wide text-[#71717A] uppercase">
                Logged
              </p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-[#F4F4F5]">
                  {incoming.instrument}
                </span>
                <span
                  className={
                    incoming.pnl >= 0
                      ? "text-xs text-[#22C55E]"
                      : "text-xs text-[#EF4444]"
                  }
                >
                  {incoming.pnl >= 0 ? "+" : ""}${incoming.pnl}
                </span>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
