import type { SavedProfileField } from "@/types/profile";
import { SectionHeader } from "@/components/section-header";
import { ProfileFieldCard } from "@/features/profile/components/profile-field-card";
import { getSavedFieldKey } from "@/features/profile/saved-profile-utils";
import { getSectionOrderFromItems } from "@/lib/utils/field-utils";

interface SavedProfileSectionsProps {
  fields: SavedProfileField[];
}

export function SavedProfileSections({ fields }: SavedProfileSectionsProps) {
  const sections = getSectionOrderFromItems(fields);

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const sectionFields = fields.filter((field) => field.section === section);

        if (sectionFields.length === 0) {
          return null;
        }

        return (
          <section key={section} className="space-y-4">
            <SectionHeader title={section} />
            <div className="space-y-4">
              {sectionFields.map((field) => (
                <ProfileFieldCard key={getSavedFieldKey(field)} field={field} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
