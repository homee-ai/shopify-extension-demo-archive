import { json, redirect } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Card,
  Layout,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";

import {  ImageMajor } from "@shopify/polaris-icons";
import { cors } from 'remix-utils/cors';

export async function loader({ request, params }) {
  const { session, admin } = await authenticate.admin(request);

  variantResponse = await admin.rest.resources.Variant.all({
    session: session,
    product_id: parseInt(params.id),
  })
  
  imageIdToSrc = {}
  for (var i = 0; i < variantResponse.data.length; i += 1){
    if (!(variantResponse.data[i]["image_id"] in imageIdToSrc)){
        imageResponse = await admin.rest.resources.Image.find({
            session: session,
            product_id: parseInt(params.id),
            id: variantResponse.data[i]["image_id"],
        });
        
        imageIdToSrc[variantResponse.data[i]["image_id"]] = imageResponse["src"]
    }
  }

  return cors(request, json({variant: variantResponse.data, image: imageIdToSrc}));
}

export async function action({ request, params }) {
  const { session } = await authenticate.admin(request);
  const { shop } = session;
  

  const data = {
    ...Object.fromEntries(await request.formData()),
    shop,
  };

  const response = json({ body: params });
  return response;
}

export default function ProductView() {
  const errors = useActionData()?.errors || {};
  
  const { variant, image } = useLoaderData();
  const navigate = useNavigate();


  return (
    <Page>
      <ui-title-bar title={"Upload Product Model"}>
        <button variant="breadcrumb" onClick={() => navigate("/app")}>
          Products
        </button>
      </ui-title-bar>
      <Layout>
        <Layout.Section>
          <BlockStack gap="500">
            {variant?.map((item,index)=>{
                return (
                    <>
                <Card key={index}>
                    <BlockStack gap="500">
                        <Text as={"h1"} variant="headingLg">
                        Variant ID: {item.id}
                        </Text>
                        <Text as={"h1"} variant="headingLg">
                        Price: {item.price}
                        </Text>
                        {item["image_id"] && item["image_id"] in image ?
                         <img src={image[item["image_id"]]} width="200" height="200"/> :<ImageMajor width="200" height="200"/>}
                    </BlockStack>
                </Card>  
                </>
              )
            })}
            
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}