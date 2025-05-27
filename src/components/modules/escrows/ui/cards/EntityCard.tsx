interface EntityCardProps {
  name: string;
  entity: string;
  icon: React.ReactNode;
}

export const EntityCard = ({ name, entity, icon }: EntityCardProps) => {
  return (
    <div className="flex items-start gap-3">
      <div className="bg-amber-50 p-1.5 rounded-full flex items-center justify-center text-amber-600">
        {icon}
      </div>

      <div className="w-3/4">
        <p className="font-medium text-sm">{name}</p>
        <p className="text-muted-foreground text-xs truncate">{entity}</p>
      </div>
    </div>
  );
};
