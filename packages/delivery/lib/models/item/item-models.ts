import { ItemContracts } from '../../data-contracts/item-contracts';
import { IQueryConfig } from '../common/common-models';
import {
    ItemUrlSlugResolver,
    ItemPropertyResolver,
    ItemResolver,
    ItemRichTextResolver,
    RichTextImageResolver,
} from './item-resolvers';

export interface IMapElementsResult<TItem extends IContentItem = IContentItem> {
    item: TItem;
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemsContainer;
    processingStartedForCodenames: string[];
}

export interface IContentItemSystemAttributes {
    /**
   * Id of the item
   */
    id: string;

    /**
     * Name of the item
     */
    name: string;

    /**
     * Codename of the item
     */
    codename: string;

    /**
     * Codename of the type this item is using
     */
    type: string;

    /**
     * Date when the item was last modified
     */
    lastModified: Date;

    /**
     * Codename of the language
     */
    language: string;

    /**
     * Array of sitemap locatoins
     */
    sitemapLocations: string[];
}

/**
 * Indexer is defined as 'any' because models can contain custom methods, different field types, linked items ...
 */
export type ContentItemIndexer = any;

export type ContentItemType = 'component' | 'linkedItem';

export interface IContentItem {

    /**
    * Indexer
    */
    [key: string]: ContentItemIndexer;

    /**
     * Content item system elements
     */
    system: IContentItemSystemAttributes;

    /**
     * Debug data of the item
     */
    _raw: IContentItemRawData;

    /**
     * Content item configuration
     */
    _config?: IContentItemConfig;
}

export class ContentItem implements IContentItem {

    /**
     * Indexer
     */
    [key: string]: ContentItemIndexer;

    /**
     * Content item system elements
     */
    public system!: ContentItemSystemAttributes;

    /**
     * Raw data
     */
    public _raw!: IContentItemRawData;

    /**
     * configuration
     */
    public _config?: IContentItemConfig;

    /**
    * Base class representing content item type. All content type models need to extend this class.
    * @constructor
    */
    constructor(config?: IContentItemConfig) {
        this._config = config;
    }
}

export class ContentItemSystemAttributes implements IContentItemSystemAttributes {

    /**
    * Id of the item
    */
    public id!: string;

    /**
     * Name of the item
     */
    public name!: string;

    /**
     * Codename of the item
     */
    public codename!: string;

    /**
     * Codename of the type this item is using
     */
    public type!: string;

    /**
     * Date when the item was last modified
     */
    public lastModified!: Date;

    /**
     * Codename of the language
     */
    public language!: string;

    /**
     * Array of sitemap locatoins
     */
    public sitemapLocations!: string[];

    constructor(
        data: {
            id: string,
            name: string,
            codename: string,
            type: string,
            lastModified: Date,
            language: string,
            sitemapLocations: string[]
        }
    ) {
        Object.assign(this, data);
    }
}

export class Link {

    /**
     * Id of the link
     */
    public linkId!: string;

    /**
     * Codename of the content item
     */
    public codename!: string;

    /**
     * Type codename of the content item
     */
    public type!: string;

    /**
     * Url slug defined for the content item
     */
    public urlSlug!: string;

    constructor(
        data: {
            linkId: string;
            codename: string,
            type: string,
            urlSlug: string,
        }
    ) {
        Object.assign(this, data);
    }
}

export interface IContentItemsContainer<TItem extends IContentItem = IContentItem> {
    [key: string]: TItem;
}

export class RichTextImage {

    public imageId!: string;
    public url!: string;
    public description?: string;
    public width?: number;
    public height?: number;

    constructor(
        data: {
            imageId: string,
            url: string,
            description?: string,
            height?: number;
            width?: number;
        }
    ) {
        Object.assign(this, data);
    }
}

export interface IContentItemRawData {
    elements: ItemContracts.IContentItemElementsContracts;
}

export interface ITypeResolverData {
    item: ItemContracts.IContentItemContract;
    modularContent: ItemContracts.IModularContentContract;
}

export interface IItemQueryConfig extends IQueryConfig {
    throwErrorForMissingLinkedItems?: boolean;
    urlSlugResolver?: ItemUrlSlugResolver;
    richTextResolver?: ItemRichTextResolver<IContentItem>;
    itemResolver?: ItemResolver;
    richTextImageResolver?: RichTextImageResolver;
}

export interface IUrlSlugResolverContext {

    /**
     * Original link text (available only for links in rich text element)
     */
    linkText?: string;

    /**
     * Content item if available
     */
    item?: IContentItem;

    /**
     * Link id (equal to `contentItem` id). Available only for links inside `richTextElement`
     */
    linkId?: string;
}

export interface IUrlSlugResolverResult {
    html?: string;
    url?: string;
}

export interface IRichTextResolverContext {
    contentType: RichTextItemDataType;
}

export interface IRichTextImageResolverResult {
    url: string;
}

export enum RichTextItemDataType {
    Item = 'item',
}

export interface IContentItemConfig {
    /**
    * Function used to bind elements returned from Kentico Kontent to a model property.
    * Common use is to bind e.g. 'FirstName' element from Kentico Kontent response to 'firstName' element in model
    */
    propertyResolver?: ItemPropertyResolver;

    /**
     *  Function used to resolve url slug elements
     */
    urlSlugResolver?: ItemUrlSlugResolver;

    /**
     * Function used to resolve linked items in rich text elements to HTML
     */
    richTextResolver?: ItemRichTextResolver<any>;
}
