
export async function getProductVariants(productId) {
    // This example uses metafields to store the data. For more information, refer to https://shopify.dev/docs/apps/custom-data/metafields.
    return await makeGraphQLQuery(
      `query Product($id: ID!) {
        product(id: $id) {
          metafield(namespace: "$app:issues", key:"issues") {
            value
          }
        }
      }
    `,
      { id: productId }
    );
}
async function makeGraphQLQuery(query, variables) {
    const graphQLQuery = {
      query,
      variables,
    };
  
    const res = await fetch("shopify:admin/api/graphql.json", {
      method: "POST",
      body: JSON.stringify(graphQLQuery),
    });
  
    if (!res.ok) {
      console.error("Network error");
    }
  
    return await res.json();
}

export async function makeRestApi(endpoint, data){
    const res = await fetch(endpoint, {
        method: "GET",
        body: JSON.stringify(data),
      });
    
      if (!res.ok) {
        console.error("Network error");
      }
    
      return await res.json();
}
