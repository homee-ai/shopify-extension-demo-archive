import { json } from "@remix-run/node";
import { useLoaderData, Link, useNavigate } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  EmptyState,
  Layout,
  Page,
  IndexTable,
  Thumbnail,
  Text,
  Icon,
  InlineStack,
} from "@shopify/polaris";

import { DiamondAlertMajor, ImageMajor } from "@shopify/polaris-icons";

export async function loader({ request }) {
  const { admin, session } = await authenticate.admin(request);
  productResponse = await admin.rest.resources.Product.all({
    session: session,
  });
  return {products: productResponse.data};
}

const EmptyProductState = ({ onAction }) => (
  <EmptyState
    heading="Add New Product on Shopify"
    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
  >
    <p>Allow customers to upload and view 3D model for their product</p>
  </EmptyState>
);

function truncate(str, { length = 25 } = {}) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

const ProductTable = ({ products }) => (
  <IndexTable
    resourceName={{
      singular: "Product",
      plural: "Products",
    }}
    itemCount={products.length}
    headings={[
      { title: "Thumbnail", hidden: true },
      { title: "Title" },
      { title: "Date created" },
      { title: "Status" },
    ]}
    selectable={false}
  >
    {products.map((product) => (
      <ProductTableRow key={product.id} product={product} />
    ))}
  </IndexTable>
);

const ProductTableRow = ({ product }) => (
  <IndexTable.Row id={product.id} position={product.id}>
    <IndexTable.Cell>
      <Thumbnail
        source={product.image?.src || ImageMajor}
        alt={product.title}
        size="small"
      />
    </IndexTable.Cell>
    <IndexTable.Cell>
      <Link to={`products/${product.id}`}>{truncate(product.title)}</Link>
    </IndexTable.Cell>
    
    <IndexTable.Cell>
      {new Date(product["created_at"]).toDateString()}
    </IndexTable.Cell>
    <IndexTable.Cell>{product.status}</IndexTable.Cell>
  </IndexTable.Row>
);

export default function Index() {
  const { products } = useLoaderData();
  const navigate = useNavigate();

  return (
    <Page>
      <ui-title-bar title="Products">
        
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <Card padding="0">
            {products.length === 0 ? (
              <EmptyProductState onAction={() => navigate("qrcodes/new")} />
            ) : (
              <ProductTable products={products}/> 
            )}
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}