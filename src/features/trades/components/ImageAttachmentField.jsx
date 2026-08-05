import { useRef } from 'react'
import { ImagePlus, Replace } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export function ImageAttachmentField({
  id,
  label,
  previewUrl,
  onFileChange,
}) {
  const inputRef = useRef(null)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => onFileChange(event.target.files?.[0] || null)}
      />

      {previewUrl ? (
        <div className="space-y-2">
          <img
            src={previewUrl}
            alt={`${label} preview`}
            className="max-h-48 w-full rounded-card border border-border object-cover"
          />
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full"
            onClick={() => inputRef.current?.click()}
          >
            <Replace className="size-4" />
            Replace image
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-card border border-dashed border-border px-3 py-6 text-sm text-muted-foreground hover:bg-muted"
        >
          <ImagePlus className="size-5" />
          Tap to upload
        </button>
      )}
    </div>
  )
}
