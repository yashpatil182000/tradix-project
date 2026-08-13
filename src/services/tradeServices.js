import { supabase, handleSupabaseError } from "./api";
import {
  removeCapitalForTrade,
  syncCapitalForClosedTrade,
} from "./capitalServices";
import { toUtcIsoFromLocalInput } from "@/features/capital/utils/formatCapital";
import {
  calculateTradeMetrics,
  parseMistakes,
  serializeMistakes,
} from "@/features/trades/utils/tradeCalculations";

const SCREENSHOT_BUCKET = "trade-screenshots";

async function getAuthUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    handleSupabaseError(error);
  }

  if (!user) {
    throw new Error("You must be signed in");
  }

  return user;
}

async function ensureUserProfile(user) {
  const { data: existing, error: selectError } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    handleSupabaseError(selectError);
  }

  if (existing) return;

  const { error } = await supabase.from("users").insert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name ?? null,
  });

  if (error) {
    handleSupabaseError(error);
  }
}

function mapDirection(value) {
  if (value === "buy" || value === "long") return "long";
  if (value === "sell" || value === "short") return "short";
  return value;
}

function emptyToNull(value) {
  if (value === "" || value === undefined) return null;
  return value;
}

function buildTradePayload(payload) {
  const direction = mapDirection(payload.direction);
  const metrics = calculateTradeMetrics({
    instrument: payload.instrument || null,
    direction,
    entry_price: payload.entry_price,
    stop_loss: payload.stop_loss,
    target: payload.take_profit,
    take_profit: payload.take_profit,
    lot_size: payload.quantity,
    quantity: payload.quantity,
    exit_price: payload.exit_price,
    fees: payload.fees,
    current_capital: payload.current_capital,
  });

  return {
    instrument_id: payload.instrument_id,
    direction,
    status: payload.status,
    style: emptyToNull(payload.style),
    entry_price: payload.entry_price,
    stop_loss: emptyToNull(payload.stop_loss),
    take_profit: emptyToNull(payload.take_profit),
    exit_price: emptyToNull(payload.exit_price),
    quantity: payload.quantity,
    fees: payload.fees || 0,
    pnl: payload.status === "closed" ? metrics.pnl : null,
    risk_amount: metrics.risk_amount,
    reward_amount: metrics.reward_amount,
    risk_reward: metrics.risk_reward,
    entry_at: toUtcIsoFromLocalInput(payload.entry_at) || payload.entry_at,
    exit_at:
      payload.status === "closed"
        ? toUtcIsoFromLocalInput(payload.exit_at || payload.entry_at) ||
          payload.exit_at ||
          payload.entry_at
        : emptyToNull(toUtcIsoFromLocalInput(payload.exit_at) || payload.exit_at),
    entry_reason: emptyToNull(payload.entry_reason),
    exit_reason: emptyToNull(payload.exit_reason),
    emotions: emptyToNull(payload.emotion || payload.emotions),
    mistakes: Array.isArray(payload.mistakes)
      ? serializeMistakes(payload.mistakes)
      : emptyToNull(payload.mistakes),
    timeframe: emptyToNull(payload.timeframe),
    followed_rules:
      payload.followed_rules === "" || payload.followed_rules == null
        ? null
        : Boolean(payload.followed_rules),
    lesson_learned: emptyToNull(payload.lesson_learned),
    notes: emptyToNull(payload.notes),
    capital_after: null,
  };
}

async function signImageUrls(images = []) {
  return Promise.all(
    images.map(async (image) => {
      const { data, error } = await supabase.storage
        .from(SCREENSHOT_BUCKET)
        .createSignedUrl(image.storage_path, 60 * 60);

      if (error) {
        return { ...image, url: null };
      }

      return { ...image, url: data.signedUrl };
    }),
  );
}

function decorateMasterInstrument(master) {
  if (!master) return null;

  return {
    ...master,
    name: master.display_name,
    type: master.asset_class,
    contract_size: Number(master.contract_size),
    pip_size: Number(master.pip_size),
    min_lot: Number(master.min_lot),
    lot_step: Number(master.lot_step),
    max_lot: Number(master.max_lot),
  };
}

function decorateTrade(trade) {
  if (!trade) return trade;

  return {
    ...trade,
    emotion: trade.emotions,
    mistakes: parseMistakes(trade.mistakes),
    instrument: decorateMasterInstrument(
      trade.master_instruments || trade.instruments || null,
    ),
    images: trade.trade_images || [],
  };
}

async function uploadScreenshot(userId, tradeId, file, kind) {
  const extension = file.name.split(".").pop() || "png";
  const storagePath = `${userId}/${tradeId}/${kind}-${Date.now()}.${extension}`;

  const { error } = await supabase.storage
    .from(SCREENSHOT_BUCKET)
    .upload(storagePath, file, {
      upsert: true,
      contentType: file.type || "image/png",
    });

  if (error) {
    handleSupabaseError(error);
  }

  const { data, error: insertError } = await supabase
    .from("trade_images")
    .insert({
      trade_id: tradeId,
      user_id: userId,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type || null,
      file_size_bytes: file.size || null,
      caption: kind,
    })
    .select("*")
    .single();

  if (insertError) {
    handleSupabaseError(insertError);
  }

  return data;
}

async function deleteScreenshotRecord(image) {
  await supabase.storage.from(SCREENSHOT_BUCKET).remove([image.storage_path]);
  const { error } = await supabase
    .from("trade_images")
    .delete()
    .eq("id", image.id);
  if (error) {
    handleSupabaseError(error);
  }
}

async function syncScreenshots(
  userId,
  tradeId,
  files = {},
  existingImages = [],
) {
  if (files.before) {
    const current = existingImages.find((image) => image.caption === "before");
    if (current) await deleteScreenshotRecord(current);
    await uploadScreenshot(userId, tradeId, files.before, "before");
  }

  if (files.after) {
    const current = existingImages.find((image) => image.caption === "after");
    if (current) await deleteScreenshotRecord(current);
    await uploadScreenshot(userId, tradeId, files.after, "after");
  }
}

async function applyCapitalSideEffects(trade) {
  if (trade.status === "closed") {
    const capitalAfter = await syncCapitalForClosedTrade({
      tradeId: trade.id,
      pnl: trade.pnl,
      recordedAt: trade.exit_at || trade.entry_at,
    });

    const { data, error } = await supabase
      .from("trades")
      .update({ capital_after: capitalAfter })
      .eq("id", trade.id)
      .select("*")
      .single();

    if (error) {
      handleSupabaseError(error);
    }

    return data;
  }

  await removeCapitalForTrade(trade.id);
  const { data, error } = await supabase
    .from("trades")
    .update({ capital_after: null })
    .eq("id", trade.id)
    .select("*")
    .single();

  if (error) {
    handleSupabaseError(error);
  }

  return data;
}

export async function getTrades() {
  const user = await getAuthUser();
  await ensureUserProfile(user);

  const { data, error } = await supabase
    .from("trades")
    .select("*, master_instruments(*), trade_images(*)")
    .eq("user_id", user.id)
    .order("entry_at", { ascending: false });

  if (error) {
    handleSupabaseError(error);
  }

  const trades = await Promise.all(
    (data ?? []).map(async (trade) => {
      const images = await signImageUrls(trade.trade_images || []);
      return decorateTrade({ ...trade, trade_images: images });
    }),
  );

  return trades;
}

export async function getTradeById(id) {
  const user = await getAuthUser();
  await ensureUserProfile(user);

  const { data, error } = await supabase
    .from("trades")
    .select("*, master_instruments(*), trade_images(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    handleSupabaseError(error);
  }

  const images = await signImageUrls(data.trade_images || []);
  return decorateTrade({ ...data, trade_images: images });
}

export async function createTrade(payload, files = {}) {
  const user = await getAuthUser();
  await ensureUserProfile(user);

  let instrument = payload.instrument || null;
  if (!instrument && payload.instrument_id) {
    const { data: master } = await supabase
      .from("master_instruments")
      .select("*")
      .eq("id", payload.instrument_id)
      .maybeSingle();
    instrument = decorateMasterInstrument(master);
  }

  const body = buildTradePayload({ ...payload, instrument });

  const { data, error } = await supabase
    .from("trades")
    .insert({
      ...body,
      user_id: user.id,
    })
    .select("*, master_instruments(*), trade_images(*)")
    .single();

  if (error) {
    handleSupabaseError(error);
  }

  await syncScreenshots(user.id, data.id, files);
  const withCapital = await applyCapitalSideEffects(data);
  return getTradeById(withCapital.id);
}

export async function updateTrade(id, payload, files = {}) {
  const user = await getAuthUser();
  await ensureUserProfile(user);

  const existing = await getTradeById(id);

  let instrument = payload.instrument || existing.instrument || null;
  if (!instrument && payload.instrument_id) {
    const { data: master } = await supabase
      .from("master_instruments")
      .select("*")
      .eq("id", payload.instrument_id)
      .maybeSingle();
    instrument = decorateMasterInstrument(master);
  }

  const body = buildTradePayload({ ...payload, instrument });

  const { data, error } = await supabase
    .from("trades")
    .update(body)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("*, master_instruments(*), trade_images(*)")
    .single();

  if (error) {
    handleSupabaseError(error);
  }

  await syncScreenshots(user.id, id, files, existing.images);
  const withCapital = await applyCapitalSideEffects(data);
  return getTradeById(withCapital.id);
}

export async function deleteTrade(id) {
  const user = await getAuthUser();
  await ensureUserProfile(user);

  const existing = await getTradeById(id);
  await removeCapitalForTrade(id);

  if (existing.images?.length) {
    await supabase.storage
      .from(SCREENSHOT_BUCKET)
      .remove(existing.images.map((image) => image.storage_path));
  }

  const { error } = await supabase
    .from("trades")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    handleSupabaseError(error);
  }
}
