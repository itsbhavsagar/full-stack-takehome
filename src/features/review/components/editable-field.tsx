"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { buttonBusyClass } from "@/lib/utils/button-utils";

interface EditableFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function EditableField({
  value,
  onChange,
  onSave,
  onCancel,
  isSaving = false,
}: EditableFieldProps) {
  return (
    <div className="space-y-3">
      <Textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="rounded-xl"
      />
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={isSaving || !value.trim()}
          aria-busy={isSaving}
          className={buttonBusyClass(isSaving, "rounded-lg")}
        >
          Save edit
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
          className="rounded-lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
