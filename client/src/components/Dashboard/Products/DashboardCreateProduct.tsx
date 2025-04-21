import AdminContentWrapper from '../AdminContentWrapper';
import ProductForm from './ProductForm';

export default function DashboardCreateProduct({
  heading,
}: {
  heading: string;
}): React.ReactElement {
  return (
    <AdminContentWrapper heading={heading}>
      <ProductForm />
    </AdminContentWrapper>
  );
}
