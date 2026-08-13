function pad(value) {
  return String(value).padStart(2, '0')
}

export function toInputDate(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function startOfDay(date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function endOfDay(date) {
  const next = new Date(date)
  next.setHours(23, 59, 59, 999)
  return next
}

function startOfWeek(date = new Date()) {
  const next = startOfDay(date)
  const day = next.getDay()
  const diff = day === 0 ? 6 : day - 1
  next.setDate(next.getDate() - diff)
  return next
}

function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function startOfYear(date = new Date()) {
  return new Date(date.getFullYear(), 0, 1)
}

export const REPORT_TYPES = [
  {
    id: 'daily',
    label: 'Daily Report',
    description: 'Performance for a single day',
  },
  {
    id: 'weekly',
    label: 'Weekly Report',
    description: 'Monday through selected day',
  },
  {
    id: 'monthly',
    label: 'Monthly Report',
    description: 'From the 1st through selected day',
  },
  {
    id: 'yearly',
    label: 'Yearly Report',
    description: 'Year-to-date through selected day',
  },
  {
    id: 'custom',
    label: 'Custom Range',
    description: 'Choose any start and end date',
  },
]

export function getPeriodForReportType(type, { date = new Date(), dateFrom, dateTo } = {}) {
  const selected = startOfDay(date)

  if (type === 'daily') {
    return {
      dateFrom: toInputDate(selected),
      dateTo: toInputDate(selected),
      label: new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }).format(selected),
    }
  }

  if (type === 'weekly') {
    const from = startOfWeek(selected)
    return {
      dateFrom: toInputDate(from),
      dateTo: toInputDate(selected),
      label: `${new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(from)} – ${new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(selected)}`,
    }
  }

  if (type === 'monthly') {
    const from = startOfMonth(selected)
    return {
      dateFrom: toInputDate(from),
      dateTo: toInputDate(selected),
      label: new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
      }).format(selected),
    }
  }

  if (type === 'yearly') {
    const from = startOfYear(selected)
    return {
      dateFrom: toInputDate(from),
      dateTo: toInputDate(selected),
      label: String(selected.getFullYear()),
    }
  }

  const from = dateFrom ? startOfDay(new Date(dateFrom)) : startOfMonth(new Date())
  const to = dateTo ? endOfDay(new Date(dateTo)) : endOfDay(new Date())

  return {
    dateFrom: toInputDate(from),
    dateTo: toInputDate(to),
    label: `${new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(from)} – ${new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(to)}`,
  }
}
