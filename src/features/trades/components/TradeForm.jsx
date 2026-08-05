import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DateTime12Field } from "@/features/trades/components/DateTime12Field";
import { ImageAttachmentField } from "@/features/trades/components/ImageAttachmentField";
import { LotSelector } from "@/features/trades/components/LotSelector";
import { SegmentedControl } from "@/features/trades/components/SegmentedControl";
import { tradeSchema } from "@/features/trades/schemas/tradeSchemas";
import { calculateTradeMetrics } from "@/features/trades/utils/tradeCalculations";
import {
  getLastTradeDirection,
  getLastTradeStyle,
  getLotConfig,
  saveLotConfig,
  setLastTradeDirection,
  setLastTradeStyle,
} from "@/features/trades/utils/tradeFormPreferences";
import {
  formatCurrency,
  toDateTimeLocalValue,
} from "@/features/capital/utils/formatCapital";
import { cn } from "@/lib/utils";

const FIELD_ORDER = [
  "entry_at",
  "instrument_id",
  "entry_price",
  "stop_loss",
  "take_profit",
  "exit_price",
  "quantity",
  "entry_reason",
  "timeframe",
  "exit_reason",
  "lesson_learned",
];

function FormSection({ title, children }) {
  return (
    <section className="rounded-card border border-border bg-card p-4 shadow-card sm:p-5">
      <h2 className="mb-4 text-heading-4">{title}</h2>
      {children}
    </section>
  );
}

function MetricCard({ label, value, className }) {
  return (
    <div className="rounded-card border border-border bg-card-secondary px-3 py-3">
      <p className="text-caption text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-sm font-medium tabular-nums", className)}>
        {value}
      </p>
    </div>
  );
}

function Chip({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-control border px-3 text-sm font-medium transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function TradeForm({
  initialValues,
  instruments = [],
  configOptions = {},
  existingImages = [],
  currentCapital = 0,
  onSubmit,
  onCancel,
  submitLabel = "Save trade",
  isSubmitting = false,
}) {
  const [lotConfig, setLotConfigState] = useState(getLotConfig);
  const [beforeFile, setBeforeFile] = useState(null);
  const [afterFile, setAfterFile] = useState(null);
  const [beforePreview, setBeforePreview] = useState(
    existingImages.find((image) => image.caption === "before")?.url || null,
  );
  const [afterPreview, setAfterPreview] = useState(
    existingImages.find((image) => image.caption === "after")?.url || null,
  );
  const exitTouchedRef = useRef(Boolean(initialValues?.exit_price));
  const timeLockedRef = useRef(Boolean(initialValues?.entry_at));
  const formRef = useRef(null);
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return undefined;

    function syncKeyboardInset() {
      const inset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      setKeyboardInset(inset);
    }

    viewport.addEventListener("resize", syncKeyboardInset);
    viewport.addEventListener("scroll", syncKeyboardInset);
    syncKeyboardInset();

    return () => {
      viewport.removeEventListener("resize", syncKeyboardInset);
      viewport.removeEventListener("scroll", syncKeyboardInset);
    };
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tradeSchema),
    defaultValues: {
      entry_at: toDateTimeLocalValue(),
      instrument_id: "",
      status: "open",
      direction: getLastTradeDirection(),
      style: getLastTradeStyle(),
      entry_price: "",
      stop_loss: "",
      take_profit: "",
      exit_price: "",
      quantity: lotConfig.min,
      fees: 0,
      entry_reason: "",
      emotion: "",
      mistakes: [],
      timeframe: "",
      exit_reason: "",
      followed_rules: false,
      lesson_learned: "",
      exit_at: "",
      ...initialValues,
    },
  });

  useEffect(() => {
    if (timeLockedRef.current) return undefined;

    function syncLiveTime() {
      if (timeLockedRef.current) return;
      const next = toDateTimeLocalValue();
      if (getValues("entry_at") === next) return;
      setValue("entry_at", next);
    }

    syncLiveTime();
    const intervalId = window.setInterval(syncLiveTime, 1000);
    return () => window.clearInterval(intervalId);
  }, [getValues, setValue]);

  const [
    direction,
    entryPrice,
    stopLoss,
    takeProfit,
    quantity,
    exitPrice,
    fees,
    status,
  ] = useWatch({
    control,
    name: [
      "direction",
      "entry_price",
      "stop_loss",
      "take_profit",
      "quantity",
      "exit_price",
      "fees",
      "status",
    ],
  });

  const metrics = useMemo(
    () =>
      calculateTradeMetrics({
        direction,
        entry_price: entryPrice,
        stop_loss: stopLoss,
        take_profit: takeProfit,
        quantity,
        exit_price: exitPrice,
        fees,
      }),
    [direction, entryPrice, exitPrice, fees, quantity, stopLoss, takeProfit],
  );

  const capitalAfterPreview = useMemo(() => {
    if (metrics.pnl == null) return null;
    const existingPnl = Number(initialValues?.pnl);
    const existingCapitalAfter = Number(initialValues?.capital_after);
    const baseCapital =
      initialValues?.status === "closed" &&
      Number.isFinite(existingCapitalAfter) &&
      Number.isFinite(existingPnl)
        ? existingCapitalAfter - existingPnl
        : Number(currentCapital) || 0;
    return baseCapital + metrics.pnl;
  }, [currentCapital, initialValues, metrics.pnl]);

  const activeInstruments = instruments.filter(
    (item) => item.is_active !== false,
  );
  const entryReasons = (configOptions.entry_reasons || []).filter(
    (item) => item.is_active !== false,
  );
  const exitReasons = (configOptions.exit_reasons || []).filter(
    (item) => item.is_active !== false,
  );
  const emotions = (configOptions.emotions || []).filter(
    (item) => item.is_active !== false,
  );
  const mistakes = (configOptions.mistakes || []).filter(
    (item) => item.is_active !== false,
  );
  const timeframes = (configOptions.timeframes || []).filter(
    (item) => item.is_active !== false,
  );

  function focusNextField(currentName) {
    const currentIndex = FIELD_ORDER.indexOf(currentName);
    if (currentIndex === -1) return;
    const nextName = FIELD_ORDER[currentIndex + 1];
    if (!nextName) return;

    const root = formRef.current;
    if (!root) return;
    const next = root.querySelector(`[data-focus-name="${nextName}"]`);
    if (next instanceof HTMLElement) {
      next.focus({ preventScroll: false });
      next.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }

  function handleEnter(event, currentName) {
    if (event.key !== "Enter" || event.shiftKey) return;
    if (event.target instanceof HTMLTextAreaElement) return;
    event.preventDefault();
    focusNextField(currentName);
  }

  function handleFieldFocus(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (!["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) return;
    window.setTimeout(() => {
      target.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 80);
  }

  function handleTargetChange(value) {
    setValue("take_profit", value, { shouldDirty: true });
    if (!exitTouchedRef.current) {
      setValue("exit_price", value, { shouldDirty: true });
    }
  }

  function handleFile(kind, file) {
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (kind === "before") {
      setBeforeFile(file);
      setBeforePreview(preview);
      return;
    }
    setAfterFile(file);
    setAfterPreview(preview);
  }

  async function handleFormSubmit(values) {
    setLastTradeDirection(values.direction);
    setLastTradeStyle(values.style);
    await onSubmit(
      {
        ...values,
        followed_rules: Boolean(values.followed_rules),
      },
      {
        before: beforeFile,
        after: afterFile,
      },
    );
  }

  return (
    <form
      ref={formRef}
      className="space-y-4 pb-28 md:pb-0"
      onSubmit={handleSubmit(handleFormSubmit)}
      onFocusCapture={handleFieldFocus}
      noValidate
    >
      <FormSection title="Trade information">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="entry_at">Date & time</Label>
            <Controller
              name="entry_at"
              control={control}
              render={({ field }) => (
                <DateTime12Field
                  id="entry_at"
                  value={field.value}
                  onChange={(next) => {
                    timeLockedRef.current = true;
                    field.onChange(next);
                  }}
                  onKeyDown={(event) => handleEnter(event, 'entry_at')}
                />
              )}
            />
            {errors.entry_at ? (
              <p className="text-sm text-destructive">
                {errors.entry_at.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Instrument</Label>
            <Controller
              name="instrument_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    focusNextField("instrument_id");
                  }}
                >
                  <SelectTrigger
                    data-focus-name="instrument_id"
                    className="h-11 w-full"
                  >
                    <SelectValue placeholder="Select instrument" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeInstruments.map((instrument) => (
                      <SelectItem key={instrument.id} value={instrument.id}>
                        {instrument.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.instrument_id ? (
              <p className="text-sm text-destructive">
                {errors.instrument_id.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Buy / Sell</Label>
            <Controller
              name="direction"
              control={control}
              render={({ field }) => (
                <SegmentedControl
                  ariaLabel="Buy or sell"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setLastTradeDirection(value);
                  }}
                  options={[
                    { value: "long", label: "Buy" },
                    { value: "short", label: "Sell" },
                  ]}
                />
              )}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Trade style</Label>
            <Controller
              name="style"
              control={control}
              render={({ field }) => (
                <SegmentedControl
                  ariaLabel="Trade style"
                  value={field.value}
                  onChange={(value) => {
                    field.onChange(value);
                    setLastTradeStyle(value);
                  }}
                  options={[
                    { value: "scalp", label: "Scalp" },
                    { value: "intraday", label: "Intraday" },
                    { value: "swing", label: "Swing" },
                  ]}
                />
              )}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <SegmentedControl
                  ariaLabel="Trade status"
                  value={field.value}
                  onChange={field.onChange}
                  options={[
                    { value: "open", label: "Open" },
                    { value: "closed", label: "Closed" },
                    { value: "cancelled", label: "Cancelled" },
                  ]}
                />
              )}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Prices & position">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="entry_price">Entry price</Label>
            <Input
              id="entry_price"
              type="number"
              inputMode="decimal"
              step="any"
              data-focus-name="entry_price"
              className="h-11 scroll-mt-28"
              enterKeyHint="next"
              onKeyDown={(event) => handleEnter(event, "entry_price")}
              {...register("entry_price")}
            />
            {errors.entry_price ? (
              <p className="text-sm text-destructive">
                {errors.entry_price.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stop_loss">Stop loss</Label>
            <Input
              id="stop_loss"
              type="number"
              inputMode="decimal"
              step="any"
              data-focus-name="stop_loss"
              className="h-11 scroll-mt-28"
              enterKeyHint="next"
              onKeyDown={(event) => handleEnter(event, "stop_loss")}
              {...register("stop_loss")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="take_profit">Target</Label>
            <Controller
              name="take_profit"
              control={control}
              render={({ field }) => (
                <Input
                  id="take_profit"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  data-focus-name="take_profit"
                  className="h-11 scroll-mt-28"
                  enterKeyHint="next"
                  value={field.value ?? ""}
                  onChange={(event) => handleTargetChange(event.target.value)}
                  onKeyDown={(event) => handleEnter(event, "take_profit")}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exit_price">Exit price</Label>
            <Controller
              name="exit_price"
              control={control}
              render={({ field }) => (
                <Input
                  id="exit_price"
                  type="number"
                  inputMode="decimal"
                  step="any"
                  data-focus-name="exit_price"
                  className="h-11 scroll-mt-28"
                  enterKeyHint="next"
                  value={field.value ?? ""}
                  onChange={(event) => {
                    exitTouchedRef.current = true;
                    field.onChange(event.target.value);
                  }}
                  onKeyDown={(event) => handleEnter(event, "exit_price")}
                />
              )}
            />
            {errors.exit_price ? (
              <p className="text-sm text-destructive">
                {errors.exit_price.message}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-4 max-w-md">
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <LotSelector
                value={field.value}
                step={lotConfig.step}
                min={lotConfig.min}
                max={lotConfig.max}
                error={errors.quantity?.message}
                onChange={field.onChange}
                onKeyDown={(event) => handleEnter(event, "quantity")}
                onConfigChange={(next) => {
                  const merged = { ...lotConfig, ...next };
                  saveLotConfig(merged);
                  setLotConfigState(merged);
                }}
              />
            )}
          />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Risk amount"
            value={
              metrics.risk_amount == null
                ? "—"
                : formatCurrency(metrics.risk_amount)
            }
          />
          <MetricCard
            label="Reward"
            value={
              metrics.reward_amount == null
                ? "—"
                : formatCurrency(metrics.reward_amount)
            }
          />
          <MetricCard
            label="Risk reward ratio"
            value={
              metrics.risk_reward == null
                ? "—"
                : `1 : ${metrics.risk_reward.toFixed(2)}`
            }
          />
          <MetricCard
            label="Profit / Loss"
            value={metrics.pnl == null ? "—" : formatCurrency(metrics.pnl)}
            className={
              metrics.pnl == null
                ? undefined
                : metrics.pnl < 0
                  ? "text-status-loss"
                  : "text-status-profit"
            }
          />
          <MetricCard
            label="Capital after trade"
            value={
              status === "closed" && capitalAfterPreview != null
                ? formatCurrency(capitalAfterPreview)
                : "—"
            }
          />
        </div>
      </FormSection>

      <FormSection title="Review">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Entry reason</Label>
            <Controller
              name="entry_reason"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "__none"}
                  onValueChange={(value) =>
                    field.onChange(value === "__none" ? "" : value)
                  }
                >
                  <SelectTrigger
                    data-focus-name="entry_reason"
                    className="h-11 w-full"
                  >
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">None</SelectItem>
                    {entryReasons.map((item) => (
                      <SelectItem key={item.id} value={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Timeframe</Label>
            <Controller
              name="timeframe"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "__none"}
                  onValueChange={(value) =>
                    field.onChange(value === "__none" ? "" : value)
                  }
                >
                  <SelectTrigger
                    data-focus-name="timeframe"
                    className="h-11 w-full"
                  >
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">None</SelectItem>
                    {timeframes.map((item) => (
                      <SelectItem key={item.id} value={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Emotion</Label>
            <Controller
              name="emotion"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {emotions.length ? (
                    emotions.map((item) => (
                      <Chip
                        key={item.id}
                        selected={field.value === item.label}
                        onClick={() =>
                          field.onChange(
                            field.value === item.label ? "" : item.label,
                          )
                        }
                      >
                        {item.label}
                      </Chip>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No emotions configured yet.
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Mistakes</Label>
            <Controller
              name="mistakes"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {mistakes.length ? (
                    mistakes.map((item) => {
                      const selected = field.value?.includes(item.label);
                      return (
                        <Chip
                          key={item.id}
                          selected={selected}
                          onClick={() => {
                            const current = field.value || [];
                            field.onChange(
                              selected
                                ? current.filter(
                                    (value) => value !== item.label,
                                  )
                                : [...current, item.label],
                            );
                          }}
                        >
                          {item.label}
                        </Chip>
                      );
                    })
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No mistakes configured yet.
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Exit reason</Label>
            <Controller
              name="exit_reason"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || "__none"}
                  onValueChange={(value) =>
                    field.onChange(value === "__none" ? "" : value)
                  }
                >
                  <SelectTrigger
                    data-focus-name="exit_reason"
                    className="h-11 w-full"
                  >
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">None</SelectItem>
                    {exitReasons.map((item) => (
                      <SelectItem key={item.id} value={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex items-end">
            <Controller
              name="followed_rules"
              control={control}
              render={({ field }) => (
                <label className="flex min-h-11 w-full items-center gap-3 rounded-control border border-border px-3">
                  <Checkbox
                    checked={Boolean(field.value)}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked))
                    }
                  />
                  <span className="text-sm font-medium">Followed rules</span>
                </label>
              )}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="lesson_learned">Remark</Label>
            <Textarea
              id="lesson_learned"
              rows={3}
              data-focus-name="lesson_learned"
              className="scroll-mt-28"
              placeholder="Optional note"
              {...register("lesson_learned")}
            />
          </div>
        </div>
      </FormSection>

      <FormSection title="Attachments">
        <div className="grid gap-4 md:grid-cols-2">
          <ImageAttachmentField
            id="beforeScreenshot"
            label="Before screenshot"
            previewUrl={beforePreview}
            onFileChange={(file) => handleFile("before", file)}
          />
          <ImageAttachmentField
            id="afterScreenshot"
            label="After screenshot"
            previewUrl={afterPreview}
            onFileChange={(file) => handleFile("after", file)}
          />
        </div>
      </FormSection>

      <div
        className="fixed inset-x-0 z-30 border-t border-border bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:static md:z-auto md:border-0 md:bg-transparent md:p-0"
        style={{ bottom: keyboardInset }}
      >
        <div className="mx-auto flex w-full max-w-6xl gap-2 md:justify-end">
          {onCancel ? (
            <Button
              type="button"
              variant="outline"
              className="hidden min-h-11 md:inline-flex"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            type="submit"
            className="min-h-11 flex-1 md:flex-none md:px-8"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </div>
    </form>
  );
}
