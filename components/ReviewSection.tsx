interface ReviewSectionProps {
  children: React.ReactNode;
  title: string;
}

export default function ReviewSection({ children, title }: ReviewSectionProps) {
  return (
    <div className="rounded border overflow-auto">
      <h1 className="bg-palette_grey bg-opacity-10 p-2 font-medium text-sm text-palette_blue">
        {title}
      </h1>
      <div className="p-2 space-y-2">{children}</div>
    </div>
  );
}
