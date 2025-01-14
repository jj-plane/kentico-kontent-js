import { ItemContracts } from '../data-contracts';
import { ContentItem, ContentItemSystemAttributes, IContentItem, ITypeResolverData } from '../models';
import { TypeResolver } from '../models/item/type-resolver.class';

export class DeliveryItemStronglyTypeResolver {

    private readonly systemElementName = 'system';
    private readonly elementsElementName = 'elements';

    /**
     * Creates item instance using either TypeResolver (if registered) or returns ContentItem
     */
    createItemInstance<TItem extends IContentItem = IContentItem>(type: string, data: ITypeResolverData, typeResolvers: TypeResolver[]): TItem {
        const typeResolver = this.getTypeResolver(type, typeResolvers);
        let itemInstance: TItem | undefined;
        if (typeResolver) {
            // type resolver is registered, create new instance of given type
            itemInstance = this.createInstanceWithResolver<TItem>(data, typeResolver);
        } else {
            // not type resolver is register for this type, use ContentItem
            itemInstance = this.createContentItem(data.item) as TItem;
        }

        if (!itemInstance) {
            throw Error(`Item with codename '${data.item.system.codename}' could not be instantiated`);
        }

        this.assignRequiredContentItemData(itemInstance, data.item);
        return itemInstance;
    }

    /**
     * Maps raw system response to strongly typed class
     * @param rawSystem Raw system response
     */
    mapSystemAttributes(rawSystem: ItemContracts.IContentItemSystemAttributesContract): ContentItemSystemAttributes {
        return new ContentItemSystemAttributes({
            name: rawSystem.name,
            codename: rawSystem.codename,
            id: rawSystem.id,
            lastModified: new Date(rawSystem.last_modified),
            language: rawSystem.language,
            type: rawSystem.type,
            sitemapLocations: rawSystem.sitemap_locations
        });
    }

    /**
     * Creates new instance of given type
     * @param type Type of the content item
     * @param resolvers Type resolvers
     */
    private createInstanceWithResolver<TItem extends IContentItem>(data: ITypeResolverData, resolver: TypeResolver): TItem {
        return resolver.resolve(data) as TItem;
    }

    /**
     * Gets TypeResolver associated with given type (type = codename of Kentico Kontent content type)
     * @param type Kentico Kontent content type codename
     * @param resolvers Array of TypeResolver
     */
    private getTypeResolver(type: string, resolvers: TypeResolver[]): TypeResolver | undefined {
        return resolvers.find(m => m.type.toLowerCase() === type.toLowerCase());
    }

    /**
     * Creates base ContentItem when content type does not have a strongly typed model
     */
    private createContentItem(item: ItemContracts.IContentItemContract): IContentItem {
        const contentItem = new ContentItem();
        this.assignRequiredContentItemData(contentItem, item);
        return contentItem;
    }

    /**
     * Maps default properties (system & elements)
     * @param item Mapped content item
     * @param rawItem Raw content item from response
     */
    private assignRequiredContentItemData(item: IContentItem, rawItem: ItemContracts.IContentItemContract): void {
        item.system = this.mapSystemAttributes(rawItem[this.systemElementName]);
        item._raw = {
            elements: rawItem[this.elementsElementName],
        };
    }

}

export const stronglyTypedResolver = new DeliveryItemStronglyTypeResolver();
