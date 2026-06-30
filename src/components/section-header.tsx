interface SectionHeaderProps {
  title: string;
}

export function SectionHeader({ title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="h-px flex-1 bg-border/60" />
    </div>
  );
}
