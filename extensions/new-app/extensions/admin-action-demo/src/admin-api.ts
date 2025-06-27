// extensions/admin-action-demo/src/admin-api.ts

// Define los tipos para las respuestas de la API
type ProductVariant = {
    id: string;
    title: string;
    price: string;
};
// ... otros tipos que puedas necesitar

export class AdminAPI {
    private query: (query: string, options?: { variables: any }) => Promise<any>;

    constructor(query) {
        this.query = query;
    }

    // Método para obtener los datos de los productos seleccionados
    async getProductData(productIds: string[]) {
        const idQuery = productIds.map(id => `id:${id.split('/').pop()}`).join(' OR ');
        const response = await this.query(
            `query getProducts($query: String!) {
          products(first: 2, query: $query) {
            edges {
              node {
                id
                title
                featuredImage {
                  url
                  altText
                }
              }
            }
          }
        }`, { variables: { query: idQuery } }
        );
        return response.data.products.edges.map(edge => edge.node);
    }

    // Orquesta toda la operación de creación del bundle
    async generateBundle(product1Id: string, product2Id: string, bundleName: string) {
        const product1Variant = await this._getProductVariant(product1Id);
        const product2Variant = await this._getProductVariant(product2Id);

        const createBundleResponse = await this._createBundleProduct(product1Variant, product2Variant, bundleName);
        const bundleProductId = createBundleResponse.productCreate.product.id;
        const bundleVariantId = createBundleResponse.productCreate.product.variants.edges[0].node.id;

        await this._linkBundleProducts(bundleVariantId, [product1Variant.id, product2Variant.id]);

        return { success: true };
    }

    // Métodos privados auxiliares
    private async _getProductVariant(productId: string): Promise<ProductVariant> {
        // ... Lógica para obtener la primera variante de un producto
    }
    private async _createBundleProduct(variant1: ProductVariant, variant2: ProductVariant, name: string) {
        // ... Lógica de la mutación `productCreate` para crear el producto bundle
    }
    private async _linkBundleProducts(bundleVariantId: string, componentVariantIds: string[]) {
        // ... Lógica de la mutación `productVariantStagedChangesCommit` para enlazar los productos
    }
}