import { PoolDetailPage } from "@/components/modules/blend/ui/pages/PoolDetailPage";

export default function Page({ params }: { params: { id: string } }) {
  return <PoolDetailPage id={params.id} />;
}
