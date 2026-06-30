import { FieldCard } from "@/features/review/components/field-card";
import { SectionHeader } from "@/components/section-header";
import type { ReviewField } from "@/types/review";

interface SectionCardProps {
  section: string;
  fields: ReviewField[];
  onUpdateField: (
    fieldKey: string,
    decision: {
      status: ReviewField["decision"]["status"];
      editedValue?: string;
      selectedCandidateIndex?: number;
    },
  ) => void;
  updatingFieldKey?: string | null;
}

export function SectionCard({
  section,
  fields,
  onUpdateField,
  updatingFieldKey,
}: SectionCardProps) {
  if (fields.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <SectionHeader title={section} />
      <div className="space-y-4">
        {fields.map((reviewField) => (
          <FieldCard
            key={reviewField.key}
            reviewField={reviewField}
            onUpdate={(decision) => onUpdateField(reviewField.key, decision)}
            isUpdating={updatingFieldKey === reviewField.key}
          />
        ))}
      </div>
    </section>
  );
}
