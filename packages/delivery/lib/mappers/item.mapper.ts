import { IDeliveryClientConfig } from '../config';
import { ItemContracts } from '../data-contracts';
import { IContentItem, IContentItemsContainer, IItemQueryConfig } from '../models';
import { IRichTextHtmlParser } from '../parser';
import { ElementMapper } from './element.mapper';

export interface MapItemResult<TItem extends IContentItem = IContentItem> {
    item: TItem;
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemsContainer;
    processingStartedForCodenames: string[];
}

export interface MapItemsResult<TItem extends IContentItem = IContentItem> {
    items: TItem[];
    processedItems: IContentItemsContainer;
    preparedItems: IContentItemsContainer;
    processingStartedForCodenames: string[];
}

export class ItemMapper {

    private readonly elementMapper: ElementMapper;

    constructor(
        readonly config: IDeliveryClientConfig,
        readonly richTextHtmlParser: IRichTextHtmlParser
    ) {
        this.elementMapper = new ElementMapper(config, richTextHtmlParser);
    }

    /**
     * Maps single item to its proper strongly typed model from the given Kontent response
     * @param response Kontent response used to map the item
     * @param queryConfig Query configuration
     */
    mapSingleItem<TItem extends IContentItem = IContentItem>(response: ItemContracts.IViewContentItemContract, queryConfig: IItemQueryConfig): MapItemResult<TItem> {
        return this.mapItem<TItem>({
            item: response.item,
            modularContent: response.modular_content,
            preparedItems: {},
            processedItems: {},
            rocessingStartedForCodenames: [],
            queryConfig: queryConfig
        });
    }

    /**
    * Maps multiple items to their strongly typed model from the given Kontent response
    * @param response Kontent response used to map the item
    * @param queryConfig Query configuration
    */
    mapMultipleItems<TItem extends IContentItem = IContentItem>(response: ItemContracts.IListContentItemsContract, queryConfig: IItemQueryConfig): MapItemsResult<TItem> {
        const that = this;

        const processedItems: IContentItemsContainer = {};
        const preparedItems: IContentItemsContainer = {};
        const processingStartedForCodenames: string[] = [];
        const mappedItems: TItem[] = [];

        response.items.forEach((item) => {
            const mappedItem = that.mapItem<TItem>({
                item: item,
                modularContent: response.modular_content,
                processedItems: processedItems,
                queryConfig: queryConfig,
                preparedItems: preparedItems,
                rocessingStartedForCodenames: processingStartedForCodenames
            });
            mappedItems.push(mappedItem.item);
        });

        return {
            items: mappedItems,
            processedItems: processedItems,
            preparedItems: preparedItems,
            processingStartedForCodenames: processingStartedForCodenames
        };
    }

    private mapItem<TItem extends IContentItem = IContentItem>(data: {
        item: ItemContracts.IContentItemContract,
        modularContent: ItemContracts.IModularContentContract,
        queryConfig: IItemQueryConfig,
        processedItems: IContentItemsContainer,
        rocessingStartedForCodenames: string[],
        preparedItems: IContentItemsContainer
    }): MapItemResult<TItem> {
        if (!data.item) {
            throw Error(`Could not map item because its undefined`);
        }

        const result = this.elementMapper.mapElements<TItem>({
            item: data.item,
            modularContent: data.modularContent,
            preparedItems: <IContentItemsContainer>{},
            processingStartedForCodenames: [],
            processedItems: data.processedItems,
            queryConfig: data.queryConfig
        });

        return {
            item: result.item,
            processedItems: result.processedItems,
            preparedItems: result.preparedItems,
            processingStartedForCodenames: result.processingStartedForCodenames
        };
    }
}
