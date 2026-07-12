import { ProductEditorPage } from "@/components/admin/product-editor-page";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <ProductEditorPage mode="edit" productId={params.id} />;
}
