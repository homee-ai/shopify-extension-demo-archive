import {
  reactExtension,
  useApi,
  AdminBlock,
  BlockStack,
  InlineStack,
  Button,
  Icon,
  Text
} from '@shopify/ui-extensions-react/admin';

import {useEffect, useState} from 'react';

// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-details.block.render';

async function getProductInfo(id) {
  // need to configure cors
  const res = await fetch(`/app/product/${id}`);
  return res.json();
}

export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n and data.
  const {extension: {target}, i18n, data, navigation} = useApi(TARGET);
  
  const [productInfo, setProductInfo] = useState();
  useEffect(() => {
    getProductInfo(123123).then(setProductInfo);
  });
  console.log(productInfo);

  return (
    // The AdminBlock component provides an API for setting the title and summary of the Block extension wrapper.
    <AdminBlock summary="3 items">
      <BlockStack>
        <Text fontWeight="bold">Test Product Block</Text>
      </BlockStack>
      <InlineStack
        inlineSize="100%"
        blockAlignment="center"
        inlineAlignment="end"
        gap="base"
      >
        <Button
          variant="tertiary"
          onPress={() =>
            navigation?.navigate(
              `extension:viewer-demo-action`
            )
          }
        >
          <Icon name="EditMinor" />
        </Button>
      </InlineStack>
    </AdminBlock>
  );
}