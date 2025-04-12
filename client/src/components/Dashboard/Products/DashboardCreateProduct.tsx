import AdminContentWrapper from '../AdminContentWrapper';
import ProductForm from './ProductForm';

export default function DashboardCreateProduct() {
  return (
    <AdminContentWrapper heading="Add a new product">
      <ProductForm />
    </AdminContentWrapper>
  );
}
